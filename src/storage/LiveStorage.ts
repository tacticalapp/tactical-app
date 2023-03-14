import * as Automerge from '@automerge/automerge';
import * as z from 'zod';
import { randomBytes } from '../crypto/randomBytes';
import { Storage } from "./Storage";
import { CloudStorage } from './CloudStorage';
import { Events } from './Events';
import { LiveValue } from './LiveValue';
import { AutomergeValue } from './automerge/AutomergeValue';
import { InvalidateSync } from '../utils/invalidate';

const livePendingFormat = z.record(z.string(), z.object({
    seq: z.number(),
    doc: z.string()
}));

export class LiveStorage {
    readonly cloud: CloudStorage;
    readonly events: Events;
    readonly storage: Storage;
    readonly actorId: string;
    #values: Map<string, LiveValue<Object>> = new Map();
    #pending: Map<string, { seq: number, doc: Automerge.Doc<any> }> = new Map();
    #localSeq = 0;
    #sync: InvalidateSync;

    constructor(storage: Storage, cloud: CloudStorage, events: Events) {
        this.storage = storage;
        this.cloud = cloud;
        this.events = events;

        // Actor ID
        let id = storage.get('live:actor-id');
        if (typeof id === 'string') {
            this.actorId = id;
        } else {
            this.actorId = randomBytes(16).toString('hex');
            this.storage.set('live:actor-id', this.actorId);
        }

        // Load pending
        let pending = storage.get('live:pending');
        if (typeof pending === 'string') {
            let p = livePendingFormat.safeParse(JSON.parse(pending));
            if (p.success) {
                for (let k of Object.keys(p.data)) {
                    let v = p.data[k];
                    this.#pending.set(k, { seq: v.seq, doc: Automerge.load(Buffer.from(v.doc, 'base64')) });
                }
            }
        }

        // Start pending
        this.#sync = new InvalidateSync(() => this.#doSync());
        if (this.#pending.size > 0) {
            console.warn('pending', this.#pending);
            this.#sync.invalidate();
        }

        // Subscribe to events
        this.events.on('cloud-key-changed', this.#handleValueChanged);
    }

    get<T extends Object>(key: string, initial?: Automerge.ChangeFn<T> | null | undefined) {
        let k = this.#values.get(key);
        if (!k) {

            // Load from cache
            let i: Automerge.ChangeFn<T> | null | undefined | Buffer = initial;
            let cached = this.cloud.readValueFromCache('live:' + key);
            if (cached && cached.value) {
                i = cached.value;
            } else {
                if (!cached) {
                    this.cloud.requestToSync('live:' + key);
                }
                if (this.#pending.has(key)) {
                    i = Buffer.from(Automerge.save(this.#pending.get(key)!.doc));
                }
            }

            // Create
            let updated = new LiveValue<T>(key, this, i);
            this.#values.set(key, updated);

            // Return value
            return updated;
        } else {
            return k as LiveValue<T>;
        }
    }

    updated(key: string, value: Automerge.Doc<any>) {
        this.#pending.set(key, { seq: this.#localSeq++, doc: value });
        this.#persistPending();
        this.#sync.invalidate();
    }

    #handleValueChanged = (key: string, value: Buffer | null) => {
        if (value === null) {
            return;
        }
        if (!key.startsWith('live:')) {
            return;
        }
        let k = key.substring(5);
        let v = this.#values.get(k);
        if (!v) {
            return;
        }
        let ex = AutomergeValue.fromExisting(this.actorId, value);
        v.apply(ex);
    }

    #persistPending = () => {
        let res: any = {};
        for (let k of this.#pending.keys()) {
            let v = this.#pending.get(k)!;
            res[k] = {
                seq: v.seq,
                doc: Buffer.from(Automerge.save(v.doc)).toString('base64')
            }
        }
        this.storage.set('live:pending', JSON.stringify(res));
    }

    #doSync = async () => {

        while (this.#pending.size > 0) {

            // Fetch first pending
            let key = Array.from(this.#pending.keys())[0];
            let value = this.#pending.get(key)!;
            console.warn('sync', key, value.seq);

            // Update
            await this.cloud.writeValue('live:' + key, (ex) => {
                if (!ex) {
                    return Buffer.from(Automerge.save(value.doc));
                } else {
                    let exv = Automerge.load(ex, { actor: this.actorId });
                    let merged = Automerge.merge(exv, value.doc);
                    return Buffer.from(Automerge.save(merged));
                }
            });

            // Remove from pending
            let ex = this.#pending.get(key);
            if (ex?.seq === value.seq) {
                this.#pending.delete(key);
                this.#persistPending();
            }
        }
    }
}