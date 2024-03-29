import localforage from "localforage";
import { decryptForKey } from "../crypto/decryptForKey";
import { encryptForKey } from "../crypto/encryptForKey";
import { keyPairFromSecret } from "../crypto/keyPairFromSecret";
import { AsyncLock } from "../utils/lock";

const instance = localforage.createInstance({ name: 'tactical' });

export class Storage {

    static async reset() {
        await instance.clear();
    }

    static async exist(): Promise<boolean> {
        let res = await instance.getItem<string>('tactical-key');
        return res !== null;
    }

    static async load(secret: Buffer): Promise<Storage | null> {

        // Load from localforage and check if the secret is correct
        let kp = await keyPairFromSecret(secret);
        let tk = await instance.getItem<string>('tactical-key');
        let dk = await instance.getItem<string>('tactical-data');
        if (tk === null || dk === null) {
            throw new Error('Storage not found');
        }
        if (!Buffer.from(tk, 'base64').equals(kp.publicKey)) {
            return null;
        }
        let decrypted = JSON.parse((await decryptForKey(kp.secretKey, Buffer.from(dk, 'base64'))).toString());

        // Create storage
        return new Storage(kp.publicKey, decrypted, true);
    }

    static async create(secret: Buffer): Promise<Storage> {
        let kp = await keyPairFromSecret(secret);
        return new Storage(kp.publicKey, {}, false);
    }

    #publicKey: Buffer;
    #data: { [key: string]: string | number | boolean };
    #attached: boolean;
    #lock = new AsyncLock();


    private constructor(publicKey: Buffer, data: { [key: string]: string | number | boolean }, attached: boolean) {
        this.#publicKey = publicKey;
        this.#attached = attached;
        this.#data = { ...data };
    }

    set(key: string, value: string | number | boolean | null) {
        if (value === null) {
            delete this.#data[key];
        } else {
            this.#data[key] = value;
        }
        this.#store();
    }

    get(key: string) {
        let r = this.#data[key];
        if (r !== undefined) {
            return r;
        } else {
            return null;
        }
    }

    async attach() {
        await this.#lock.inLock(async () => {
            await instance.clear();
            await instance.setItem('tactical-key', this.#publicKey.toString('base64'));
            await instance.setItem('tactical-data', (await encryptForKey(this.#publicKey, Buffer.from(JSON.stringify(this.#data)))).toString('base64'));
            this.#attached = true;
        });
    }

    async detach() {
        await this.#lock.inLock(async () => {
            this.#attached = false;
        });
    }

    async #store() {
        await this.#lock.inLock(async () => {
            if (this.#attached) {
                await instance.setItem('tactical-data', (await encryptForKey(this.#publicKey, Buffer.from(JSON.stringify(this.#data)))).toString('base64'));
            }
        });
    }
}