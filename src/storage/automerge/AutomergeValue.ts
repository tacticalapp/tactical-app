import * as Automerge from '@automerge/automerge';

export class AutomergeValue<T> {

    static fromEmpty<T>(actor: string, initial: Automerge.ChangeFn<T>) {
        let doc = Automerge.init<T>({ actor });
        let updated = Automerge.change(doc, initial);
        return new AutomergeValue<T>(updated);
    }

    static fromExisting<T>(src: Buffer) {
        return new AutomergeValue<T>(Automerge.load<T>(src));
    }

    #doc: Automerge.Doc<T>;

    private constructor(initial: Automerge.Doc<T>) {
        this.#doc = initial;
    }

    update(updater: Automerge.ChangeFn<T>) {
        this.#doc = Automerge.change(this.#doc, updater);
    }

    get value() {
        return this.#doc;
    }

    //
    // Sync
    //

    apply(remote: AutomergeValue<T>) {
        if (Automerge.equals(remote.#doc, this.#doc)) {
            return;
        }
        this.#doc = Automerge.merge(this.#doc, remote.#doc);
    }

    save() {
        return Buffer.from(Automerge.save(this.#doc));
    }

    clone() {
        return AutomergeValue.fromExisting<T>(this.save());
    }
}