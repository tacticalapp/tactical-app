import { randomBytes } from '../crypto/randomBytes';
import { Storage } from "./Storage";
import { CloudStorage } from './CloudStorage';
import { Events } from './Events';

export class LiveStorage {
    #cloud: CloudStorage;
    #events: Events;
    #storage: Storage;
    #actorId: string;

    constructor(storage: Storage, cloud: CloudStorage, events: Events) {
        this.#storage = storage;
        this.#cloud = cloud;
        this.#events = events;
        let id = storage.get('sync:actor-id');
        if (typeof id === 'string') {
            this.#actorId = id;
        } else {
            this.#actorId = randomBytes(16).toString('hex');
            this.#storage.set('sync:actor-id', this.#actorId);
        }
        this.#events.on('cloud-key-changed', this.#handleValueChanged);
    }

    #handleValueChanged = (key: string, value: Buffer | null) => {

    }

    async awaitValue(key: string) {
        // TODO: implement
    }
}