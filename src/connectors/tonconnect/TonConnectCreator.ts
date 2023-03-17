import { CHAIN, TonConnect } from "@tonconnect/sdk";
import { Address } from "ton-core";
import { randomBytes } from "../../crypto/randomBytes";
import { isMainnet } from "../../utils/chain";
import { TonConnectStorage } from "./TonConnectStorage";

export class TonConnectCreator {
    #seed: string;
    #storage: TonConnectStorage;
    #connect: TonConnect;
    #completed: boolean;
    #unsubscribe: () => void;
    onSuccess?: (wallet: {
        address: Address,
        storage: string,
        device: {
            platform: string,
            appName: string
        }
    }) => void;
    onFail?: (error: Error) => void;

    constructor() {
        this.#seed = randomBytes(32).toString('hex');
        this.#storage = new TonConnectStorage();
        this.#connect = new TonConnect({ storage: this.#storage, manifestUrl: 'https://tacticalapp.org/ton-manifest.json' });
        this.#completed = false;
        this.#unsubscribe = this.#connect.onStatusChange((status) => {

            if (status && !this.#completed) {
                this.#completed = true;
                this.#unsubscribe();

                // Check provider
                if (status.provider !== 'http') {
                    if (this.onFail) {
                        this.onFail(new Error('Unexpected injected provider'));
                    }
                    return;
                }

                // Check network
                if (isMainnet !== (status.account.chain === CHAIN.MAINNET)) {
                    if (this.onFail) {
                        this.onFail(new Error(`Connected wallet is from ${status.account.chain === CHAIN.MAINNET ? 'Mainnet' : 'Testnet'}, but ${isMainnet ? 'Mainnet' : 'Testnet'} is required. Please, try again with another wallet.`));
                    }
                    return;
                }


                // Success
                if (this.onSuccess) {
                    let address = Address.parseRaw(status.account.address);
                    this.onSuccess({
                        address,
                        device: {
                            platform: status.device.platform,
                            appName: status.device.appName
                        },
                        storage: this.#storage.serialize()
                    });
                }
            }
        }, (error) => {
            if (!this.#completed) {
                this.#completed = true;
                this.#unsubscribe();
                if (this.onFail) {
                    this.onFail(error);
                }
            }
        });
    }

    createLink() {
        return this.#connect.connect({
            universalLink: 'https://app.tonkeeper.com/ton-connect',
            bridgeUrl: 'https://bridge.tonapi.io/bridge',
        }, { tonProof: this.#seed });
    }

    close() {
        if (!this.#completed) {
            this.#completed = true;
            this.#unsubscribe();
        }
    }
}