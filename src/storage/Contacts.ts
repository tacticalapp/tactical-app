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

    use() {
        return this.#live.use();
    }
}