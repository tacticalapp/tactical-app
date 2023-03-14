import { LiveStorage } from "./LiveStorage";
import { AutomergeValue } from "./automerge/AutomergeValue";
import * as Automerge from '@automerge/automerge';

export class LiveValue<T extends Object> {
    readonly key: string;
    readonly live: LiveStorage;
    readonly value: AutomergeValue<T>;

    constructor(key: string, live: LiveStorage, initial?: Buffer | Automerge.ChangeFn<T> | null | undefined) {
        this.key = key;
        this.live = live;
        if (Buffer.isBuffer(initial)) {
            this.value = AutomergeValue.fromExisting<T>(live.actorId, initial);
        } else {
            this.value = AutomergeValue.fromEmpty<T>(live.actorId, initial);
        }
    }

    update(updater: Automerge.ChangeFn<T>) {
        let updated = this.value.update(updater);
        console.warn('Updated', this.key, this.value.value);
        this.live.updated(this.key, updated);        
    }

    apply(remote: AutomergeValue<any>) {
        if (this.value.apply(remote)) {
            console.warn('Updated', this.key, this.value.value);
        }
    }

    get(): T {
        return this.value.value;
    }
}