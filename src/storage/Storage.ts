import localforage from "localforage";

export class Storage {

    static async load(): Promise<Storage | null> {

        // Load from localforage
        let lf = await localforage.getItem<string>('tactical-key');
        if (lf !== null) {

        }

        return null;
        // const data = await browser.storage.local.get();
        // return new Storage(data);
    }

    #data: { [key: string]: string | number | boolean };

    private constructor(data: { [key: string]: string | number | boolean }) {
        this.#data = { ...data };
    }

    async set(key: string, value: string | number | boolean | null) {
        if (value === null) {
            delete this.#data[key];
        } else {
            this.#data[key] = value;
        }
        await this.#store();
    }

    async get(key: string) {
        let r = this.#data[key];
        if (r !== undefined) {
            return r;
        } else {
            return null;
        }
    }

    async #store() {
        // TODO: Implement
    }
}