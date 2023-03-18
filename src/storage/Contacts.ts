import { App } from "./App";
import { LiveValue } from "./LiveValue";

export type ContactsType = {
    [key: string]: {
        name: string;
    }
};

export class Contacts {

    readonly app: App;

    #live: LiveValue<ContactsType>;

    constructor(app: App) {
        this.app = app;
        this.#live = app.live.get<ContactsType>('contacts');
    }

    updateContact(address: string, name: string | null) {
        let normalized = name ? name.trim() : '';
        this.#live.update((data) => {
            if (normalized.length === 0) {
                delete data[address];
            } else {
                data[address] = { name: normalized };
            }
        });
    }

    use() {
        return this.#live.use();
    }
}