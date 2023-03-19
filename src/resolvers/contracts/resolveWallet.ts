import { WalletContractV1R1 } from "ton";
import { ResolveContext } from "../resolveContract"

export type WalletContract = {
    type: 'wallet',
    version: string
}

export async function resolveWallet(ctx: ResolveContext): Promise<WalletContract | null> {
    let hash = ctx.code.hash().toString('hex');
    if (hash === 'a0cfc2c48aee16a271f2cfc0b7382d81756cecb1017d077faaab3bb602f6868c') {
        return {
            type: 'wallet',
            version: 'v1r1'
        }
    }
    if (hash === 'd4902fcc9fad74698fa8e353220a68da0dcf72e32bcb2eb9ee04217c17d3062c') {
        return {
            type: 'wallet',
            version: 'v1r2'
        }
    }
    if (hash === '587cc789eff1c84f46ec3797e45fc809a14ff5ae24f1e0c7a6a99cc9dc9061ff') {
        return {
            type: 'wallet',
            version: 'v1r3'
        }
    }
    if (hash === '5c9a5e68c108e18721a07c42f9956bfb39ad77ec6d624b60c576ec88eee65329') {
        return {
            type: 'wallet',
            version: 'v2r1'
        }
    }
    if (hash === 'fe9530d3243853083ef2ef0b4c2908c0abf6fa1c31ea243aacaa5bf8c7d753f1') {
        return {
            type: 'wallet',
            version: 'v2r2'
        }
    }
    if (hash === 'b61041a58a7980b946e8fb9e198e3c904d24799ffa36574ea4251c41a566f581') {
        return {
            type: 'wallet',
            version: 'v3r1'
        }
    }
    if (hash === '84dafa449f98a6987789ba232358072bc0f76dc4524002a5d0918b9a75d2d599') {
        return {
            type: 'wallet',
            version: 'v3r2'
        }
    }
    if (hash === 'feb5ff6820e2ff0d9483e7e0d62c817d846789fb4ae580c878866d959dabd5c0') {
        return {
            type: 'wallet',
            version: 'v4'
        }
    }

    return null;
}