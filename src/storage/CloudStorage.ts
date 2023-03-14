import { Storage } from "./Storage";
import { contentDecrypt, contentEncrypt, contentKeyDecrypt, contentKeyEncrypt } from '../crypto/content';
import { TacticalAccountClient } from '../api/TacticalClient';
import { InvalidateSync } from '../utils/invalidate';
import { delay } from '../utils/time';
import * as z from 'zod';
import { Events } from "./Events";
import { Logs } from "./Logs";

const cloudCacheFormat = z.object({
    seq: z.number(),
    value: z.string().nullable()
});

export class CloudStorage {
    #storage: Storage;
    #events: Events;
    #accountKey: Buffer;
    #seq: number = 0;
    #client: TacticalAccountClient;
    #pendingReads: Map<string, ((param: { value: Buffer | null, seq: number }) => void)[]> = new Map();
    #loadingLock: InvalidateSync;
    #syncLock: InvalidateSync;
    #logs: Logs;
    #detached: boolean = false;

    constructor(storage: Storage, events: Events, logs: Logs, client: TacticalAccountClient) {
        this.#storage = storage;
        this.#events = events;
        this.#accountKey = Buffer.from(storage.get('account:secret') as string);
        this.#client = client;
        this.#logs = logs;
        let seq = storage.get('sync:seq');
        if (typeof seq === 'number') {
            this.#seq = seq;
        }
        this.#loadingLock = new InvalidateSync(() => this.#doLoading());
        this.#syncLock = new InvalidateSync(() => this.#doSync());
        this.#syncLock.invalidate();
    }

    async readValue(key: string): Promise<{ value: Buffer | null, seq: number }> {

        // Check cache
        let ex = this.#readCache(key);
        if (ex) {
            return ex;
        }

        // Request from backend
        return await this.#requestValue(key);
    }

    readValueFromCache(key: string): Buffer | null {
        let ex = this.#readCache(key);
        if (ex) {
            return ex.value;
        }
        return null;
    }

    async writeValue(key: string, value: Buffer | null | ((existing: Buffer | null) => Buffer)) {
        while (true) {

            // Read-and-update
            let existing = await this.readValue(key);
            let updated = typeof value === 'function' ? value(existing.value) : value;
            let ok = await this.#writeValue(key, updated, null);
            this.#writeCache(ok.key, ok.value, ok.seq);

            // Exit if successful
            if (ok.ok) {
                return;
            }
        }
    }

    detach() {
        this.#detached = true;
    }

    async #writeValue(key: string, value: Buffer | null, seq: number | null) {

        // Encrypt
        const encryptedKey = await contentKeyEncrypt({ key, secret: this.#accountKey });
        let encryptedValue: string | null = null;
        if (value) {
            encryptedValue = (await contentEncrypt({ key: key, value, secret: this.#accountKey })).value;
        }

        // Send
        let res = await this.#client.updateKey(encryptedKey, encryptedValue, seq);
        let decodedValue: Buffer | null = null;
        if (res.value) {
            let d = await contentDecrypt({ key: res.key, value: res.value, secret: this.#accountKey });
            if (d) {
                decodedValue = d.value;
            }
        }

        return {
            ok: res.status === 'ok',
            key: key,
            value: decodedValue,
            seq: res.seq
        }
    }

    async #requestValue(key: string): Promise<{ value: Buffer | null, seq: number }> {
        let ex = this.#pendingReads.get(key);
        if (!ex) {
            ex = [];
        }
        const vv = ex;
        let p = new Promise<{ value: Buffer | null, seq: number }>((resolve) => {
            vv.push(resolve);
        });
        this.#pendingReads.set(key, ex);
        this.#loadingLock.invalidate();
        return await p;
    }

    async #doLoading() {

        // Small delay for better batching
        await delay(100);

        // Get pending reads
        let p = Array.from(this.#pendingReads.keys());
        if (p.length === 0) {
            return;
        }
        if (p.length > 20) {
            p = p.slice(0, 20);
        }

        // Request from backend
        let encryptedKeys: string[] = [];
        for (let i = 0; i < p.length; i++) {
            encryptedKeys.push(await contentKeyEncrypt({ key: p[i], secret: this.#accountKey }))
        }
        let loaded = await this.#client.getKeys(encryptedKeys);

        // Unpack
        for (let i = 0; i < p.length; i++) {
            let key = p[i];

            // Decrypt
            let entity = loaded.find((v) => v.key === encryptedKeys[i]);
            let value: Buffer | null = null;
            let seq: number = 0;
            if (entity) {
                seq = entity.seq;
                if (entity.value) {
                    let decrypted = await contentDecrypt({ key: entity.key, value: entity.value, secret: this.#accountKey });
                    if (decrypted) {
                        value = decrypted.value;
                    } else {
                        console.log('Failed to decrypt', key);
                    }
                }
            }

            // Store in cache
            this.#writeCache(key, value, seq);

            // Notify
            let kp = this.#pendingReads.get(key);
            if (kp) {
                this.#pendingReads.delete(key);
                for (let k of kp) {
                    k({ value, seq });
                }
            }
        }
    }

    async #doSync() {
        while (!this.#detached) {

            // Get changes
            let changes = await this.#client.getChanges(this.#seq);

            // Check if seqno changed
            if (changes.seq === this.#seq || changes.seq < this.#seq) {
                await delay(5000);
                continue;
            }

            // Process changes
            if (changes.changes.length > 0) {
                let updated = new Map<string, number>();
                let changedKeys: string[] = [];
                for (let c of changes.changes) {
                    let k = await contentKeyDecrypt({ key: c.key, secret: this.#accountKey });
                    if (k) {
                        changedKeys.push(k);
                        updated.set(k, c.seq);
                    }
                }

                // Find keys to update
                for (let k of Array.from(updated.keys())) {
                    let ex = this.#readCache(k);
                    if (ex && ex.seq >= updated.get(k)!) {
                        updated.delete(k);
                    }
                }

                // Load values
                let loaded = await Promise.all(Array.from(updated.keys()).map(async (v) => ({ key: v, ...await this.#requestValue(v) })));

                // Update cache
                let allKeysUpdated = true;
                for (let i = 0; i < loaded.length; i++) {
                    let ee = updated.get(loaded[i].key);
                    if (ee === undefined) {
                        throw new Error('Invalid key loaded');
                    }
                    if (loaded[i].seq < ee) { // What if server returned older key
                        console.warn('Server returned older key', loaded[i].key, loaded[i].seq, ee);
                        allKeysUpdated = false;
                    }
                    this.#writeCache(loaded[i].key, loaded[i].value, loaded[i].seq);
                }

                // Update seq if all keys updated
                if (allKeysUpdated) {
                    this.#seq = changes.seq;
                    this.#storage.set('sync:seq', changes.seq);
                }
                this.#logs.cloudChanges(changedKeys, changes.seq);
            } else if (changes.seq > this.#seq) {
                this.#seq = changes.seq;
                this.#storage.set('sync:seq', changes.seq);
                this.#logs.cloudChanges([], changes.seq);
            }

            // Retry in 5 seconds
            await delay(5000);
        }
    }

    #readCache(key: string): { value: Buffer | null, seq: number } | null {
        let ex = this.#storage.get('sync:cache:' + key);
        if (typeof ex === 'string') {
            let parsed = cloudCacheFormat.safeParse(JSON.parse(ex));
            if (parsed.success) {
                return {
                    value: parsed.data.value ? Buffer.from(parsed.data.value, 'base64') : null,
                    seq: parsed.data.seq
                }
            }
        }
        return null;
    }

    #writeCache(key: string, value: Buffer | null, seq: number) {
        let ex = this.#readCache(key);
        if (ex && ex.seq >= seq) {
            return;
        }
        this.#storage.set('sync:cache:' + key, JSON.stringify({
            seq: seq,
            value: value ? value.toString('base64') : null
        }));
        this.#events.emit('cloud-key-changed', key, value, seq);
        this.#logs.cloudKeyUpdated(key, seq);
    }
}