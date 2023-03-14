import * as React from 'react';
import { LiveStorage } from "./LiveStorage";
import { Storage } from "./Storage";

//
// App
//

export class App {

    static async create(storage: Storage) {
        let liveStorage = new LiveStorage(storage);
        let res = new App(storage, liveStorage);
        await res.#awaitForData();
        return res;
    }

    readonly storage: Storage;
    readonly liveStorage: LiveStorage;
    readonly username: string;

    constructor(storage: Storage, liveStorage: LiveStorage) {
        this.storage = storage;
        this.liveStorage = liveStorage;
        this.username = storage.get('account:username') as string;
    }

    async #awaitForData() {

        //
        // Preload data
        //

        await Promise.all([
            this.liveStorage.awaitValue('contacts')
        ]);
    }
}

//
// Context
//

export const AppContext = React.createContext<App | null>(null);

export function useApp() {
    let res = React.useContext(AppContext);
    if (res === null) {
        throw new Error('AppContext not set');
    }
    return res;
}