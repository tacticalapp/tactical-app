import { useQuery } from "react-query";
import { Address } from "ton-core";
import { resolveContracts, ResolvedContract } from "../../resolvers/resolveContract";
import { isMainnet } from "../../utils/chain";
import { getTonClient } from "./getTonClient";

export function useAddressInformation(address: Address) {
    return (useQuery(['address', address.toString({ testOnly: !isMainnet })], async () => {
        const client = await getTonClient();
        const block = await client.getLastBlock();
        const account = await client.getAccount(block.last.seqno, address);
        let resolved: ResolvedContract | null = null;
        if (account.account.state.type === 'active' && account.account.state.code && account.account.state.data) {
            resolved = await resolveContracts(block.last.seqno, address, client);
        }
        return { account, resolved };
    }, { retry: true, refetchInterval: 5000, refetchOnMount: true })).data;
}