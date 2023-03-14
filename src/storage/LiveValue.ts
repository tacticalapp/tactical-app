import * as React from 'react';
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

    use() {
        let [state, setState] = React.useState(this.value.value);
        React.useEffect(() => {
            let listener = (key: string, value: any) => {
                if (key === this.key) {
                    setState(value);
                }
            };
            this.live.events.on('live-key-changed', listener);
            return () => {
                this.live.events.off('live-key-changed', listener);
            }
        }, []);

        return [state as T, (updater: Automerge.ChangeFn<T>) => this.update(updater)] as const;
    }

    update(updater: Automerge.ChangeFn<T>) {
        let updated = this.value.update(updater);
        this.live.events.emit('live-key-changed', this.key, this.value.value);
        this.live.updated(this.key, updated);
    }

    apply(remote: AutomergeValue<any>) {
        if (this.value.apply(remote)) {
            this.live.events.emit('live-key-changed', this.key, this.value.value);
        }
    }

    get(): T {
        return this.value.value;
    }
}