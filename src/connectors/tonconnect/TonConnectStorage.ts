import { IStorage } from "@tonconnect/sdk";

export class TonConnectStorage implements IStorage {

    static load(src: string) {
        let res = new TonConnectStorage();
        let data = JSON.parse(src);
        for (let key in data) {
            res.data.set(key, data[key]);
        }
        return res;
    }

    data = new Map<string, string>();

    async getItem(key: string): Promise<string | null> {
        let res = this.data.get(key);
        if (res === undefined) {
            return null;
        } else {
            return res;
        }
    }

    async setItem(key: string, value: string): Promise<void> {
        this.data.set(key, value);
    }

    async removeItem(key: string): Promise<void> {
        this.data.delete(key);
    }

    serialize() {
        let res: any = {};
        for (let [key, value] of this.data) {
            res[key] = value;
        }
        return JSON.stringify(res);
    }
}