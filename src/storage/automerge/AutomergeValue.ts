import * as Automerge from '@automerge/automerge';

export class AutomergeValue<T> {

    static fromEmpty<T>(actor: string, initial?: Automerge.ChangeFn<T> | null | undefined) {
        let doc = Automerge.init<T>({ actor });
        if (initial) {
            doc = Automerge.change(doc, initial);
        }
        return new AutomergeValue<T>(doc);
    }

    static fromExisting<T>(actor: string, src: Buffer) {
        return new AutomergeValue<T>(Automerge.load<T>(src, { actor }));
    }

    #doc: Automerge.Doc<T>;

    private constructor(initial: Automerge.Doc<T>) {
        this.#doc = initial;
    }

    update(updater: Automerge.ChangeFn<T>) {
        let prev = this.#doc;
        this.#doc = Automerge.change(this.#doc, updater);
        return !Automerge.equals(prev, this.#doc);
    }

    get value() {
        return this.#doc;
    }

    //
    // Sync
    //

    apply(remote: AutomergeValue<T>) {
        if (Automerge.equals(remote.#doc, this.#doc)) {
            return false;
        }
        this.#doc = Automerge.merge(this.#doc, remote.#doc);
        return true;
    }

    save() {
        return Buffer.from(Automerge.save(this.#doc));
    }

    clone(actor: string) {
        return AutomergeValue.fromExisting<T>(actor, this.save());
    }
}