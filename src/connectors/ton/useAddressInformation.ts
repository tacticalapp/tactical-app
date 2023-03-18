import { useQuery } from "react-query";
import { Address } from "ton-core";
import { isMainnet } from "../../utils/chain";
import { getTonClient } from "./getTonClient";

export function useAddressInformation(address: Address) {
    return (useQuery(['address', address.toString({ testOnly: !isMainnet })], async () => {
        const client = await getTonClient();
        const block = await client.getLastBlock();
        const account = await client.getAccount(block.last.seqno, address);
        return account;
    }, { retry: true, refetchInterval: 5000, refetchOnMount: true })).data;
}