import * as Automerge from '@automerge/automerge';
import { randomBytes } from '../crypto/randomBytes';
import { Storage } from "./Storage";

export class LiveStorage {
    #storage: Storage;
    #accountKey: Buffer;
    #actorId: string;
    #seq: number = 0;

    constructor(storage: Storage) {
        this.#storage = storage;
        this.#accountKey = Buffer.from(storage.get('account:secret') as string);
        let id = storage.get('sync:actor-id');
        if (typeof id === 'string') {
            this.#actorId = id;
        } else {
            this.#actorId = randomBytes(16).toString('hex');
            this.#storage.set('sync:actor-id', this.#actorId);
        }
        let seq = storage.get('sync:seq');
        if (typeof seq === 'number') {
            this.#seq = seq;
        }
    }

    async readValue(key: string) {

    }

    async awaitValue(key: string) {
        // TODO: implement
    }
}