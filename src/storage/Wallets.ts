import { Address } from "ton-core";
import { isMainnet } from "../utils/chain";
import { App } from "./App";
import { LiveValue } from "./LiveValue";

export type WalletsType = {
    [key: string]: {
        name: string;
        config: WalletConfig;
    }
};

export type WalletConfig = {
    kind: 'ton-connect',
    storage: string,
    device: {
        platform: string,
        appName: string
    }
} | {
    kind: 'ledger',
    path: number[],
    publicKey: string
}

export class Wallets {

    readonly app: App;

    #live: LiveValue<WalletsType>;

    constructor(app: App) {
        this.app = app;
        this.#live = app.live.get<WalletsType>('wallets');
    }

    get(address: Address) {
        let r = this.#live.get()[address.toString({ testOnly: !isMainnet })];
        if (!r) {
            return null;
        } else {
            return r;
        }
    }

    use() {
        return this.#live.use();
    }

    hasWallet(address: string) {
        return this.#live.get().hasOwnProperty(address);
    }

    renameWallet(address: string, name: string) {
        let normalized = name.trim();
        if (normalized.length > 0) {
            this.#live.update((data) => {
                if (data[address]) {
                    data[address].name = normalized;
                }
            });
        }
    }

    registerWallet(address: string, name: string, config: WalletConfig) {
        this.#live.update((data) => {
            data[address] = {
                name,
                config: config as any // Due conversion of arrays to list
            };
        });
    }

    unregisterWallet(address: string) {
        this.#live.update((data) => {
            delete data[address];
        });
    }
}