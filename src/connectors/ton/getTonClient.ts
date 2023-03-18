import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { TonClient4 } from "ton";
import { isMainnet } from "../../utils/chain";
import { AsyncLock } from "../../utils/lock";

const lock = new AsyncLock();
let client: TonClient4 | undefined;

export async function getTonClient() {
    return lock.inLock(async () => {
        if (client) {
            return client;
        }
        const endpoint = await getHttpV4Endpoint({
            network: isMainnet ? 'mainnet' : 'testnet',
        });
        console.warn(endpoint);
        client = new TonClient4({ endpoint });
        return client!;
    });
}