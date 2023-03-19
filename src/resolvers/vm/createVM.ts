import { Blockchain, RemoteBlockchainStorage } from "@ton-community/sandbox";
import { Cell, TonClient4 } from "ton";

export async function createVM(block: number, client: TonClient4) {
    const config = await client.getConfig(block);
    return await Blockchain.create({
        config: Cell.fromBase64(config.config.cell),
        storage: new RemoteBlockchainStorage(client, block)
    });
}