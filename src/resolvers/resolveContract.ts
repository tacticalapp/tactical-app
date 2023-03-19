import { Address, Cell } from "ton-core";
import { createVM } from "./vm/createVM";
import { Blockchain, SmartContract } from "@ton-community/sandbox";
import { resolveNominators, NominatorsContract } from "./contracts/resolveNominators";
import { TonClient4 } from "ton";
import { resolveWallet, WalletContract } from "./contracts/resolveWallet";

export type ResolveContext = {
    vm: Blockchain;
    contract: SmartContract;
    code: Cell;
    data: Cell
}

//
// All nominators
//

export type ResolvedContract = NominatorsContract | WalletContract;
const resolvers: ((ctx: ResolveContext) => Promise<ResolvedContract | null>)[] = [
    resolveWallet,
    resolveNominators
];

export async function resolveContracts(block: number, address: Address, client: TonClient4) {
    let vm = await createVM(block, client);
    let contract = await vm.getContract(address);

    // Check if contract is active
    if (!contract.account.account
        || !contract.account.account.storage
        || contract.account.account.storage.state.type !== 'active'
        || !contract.account.account.storage.state.state.code
        || !contract.account.account.storage.state.state.data
    ) {
        return null;
    }

    // Resolve
    try {
        const ctx: ResolveContext = {
            vm,
            contract,
            code: contract.account.account.storage.state.state.code,
            data: contract.account.account.storage.state.state.data
        };
        for (let resolver of resolvers) {
            let result = await resolver(ctx);
            if (result) {
                return result;
            }
        }
        return null;
    } catch (e) {
        console.warn(e);
        return null;
    }
}