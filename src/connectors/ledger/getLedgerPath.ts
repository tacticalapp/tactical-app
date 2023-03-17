export function getLedgerPath(network: 'mainnet' | 'testnet', workchain: number, account: number) {
    let networkid = network === 'mainnet' ? 0 : 1;
    return [44, 607, networkid, workchain, account, 0];
}