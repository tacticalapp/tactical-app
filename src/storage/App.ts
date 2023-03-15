import * as React from 'react';
import { tacticalClient } from '../api/client';
import { TacticalAccountClient } from '../api/TacticalClient';
import { CloudStorage } from './CloudStorage';
import { Contacts } from './Contacts';
import { Events } from './Events';
import { LiveStorage } from "./LiveStorage";
import { Logs } from './Logs';
import { Storage } from "./Storage";
import { Wallets } from './Wallets';

//
// App
//

export class App {

    static async create(storage: Storage) {
        let logs = new Logs();
        let events = new Events();
        let client = new TacticalAccountClient(tacticalClient.endpoint, Buffer.from(storage.get('account:token') as string, 'base64'));
        let cloud = new CloudStorage(storage, events, logs, client);
        let live = new LiveStorage(storage, cloud, events);
        let res = new App(storage, live, cloud, events, client);
        await res.#awaitForData();
        return res;
    }

    readonly events: Events;
    readonly storage: Storage;
    readonly cloud: CloudStorage;
    readonly live: LiveStorage;
    readonly username: string;
    readonly client: TacticalAccountClient;
    readonly contacts: Contacts;
    readonly wallets: Wallets;

    constructor(storage: Storage, live: LiveStorage, cloud: CloudStorage, events: Events, client: TacticalAccountClient) {
        this.storage = storage;
        this.events = events;
        this.live = live;
        this.client = client;
        this.cloud = cloud;
        this.username = storage.get('account:username') as string;
        this.contacts = new Contacts(this);
        this.wallets = new Wallets(this);
    }

    async #awaitForData() {
        await Promise.all([
            this.cloud.readValue('live:contacts'),
            this.cloud.readValue('live:wallets')
        ]);
    }

    destroy() {
        console.warn('Destroy app');
        this.storage.detach();
        this.cloud.detach();
    }

    async destroyAsync() {
        await this.storage.detach();
        this.cloud.detach();
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