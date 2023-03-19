import { Address, Dictionary, DictionaryValue } from "ton-core";
import { bigintToBuffer } from "../../utils/bigIntToBuffer";
import { isMainnet } from "../../utils/chain";
import { ResolveContext } from "../resolveContract";

export type NominatorsContract = {
    type: 'ton-nominators',
    state: 'idle' | 'sent_stake' | 'validating',
    nominatorsCount: number,
    stakeSent: bigint,
    validatorAmount: bigint,
    validatorAddress: Address
    validatorRewardShare: number,
    maximumValidatorsCount: number,
    minValidatorStake: bigint,
    minNominatorStake: bigint,
    nominators: { [key: string]: { balance: bigint, pendingDeposit: bigint, pendingWithdraw: bigint } }
};

const NominatorValue: DictionaryValue<{ balance: bigint, pendingDeposit: bigint }> = {
    serialize(src, builder) {
        builder.storeCoins(src.balance);
        builder.storeCoins(src.pendingDeposit);
    },
    parse(src) {
        return {
            balance: src.loadCoins(),
            pendingDeposit: src.loadCoins()
        };
    },
}

const WithdrawValue: DictionaryValue<{ pendingWithdraw: bigint }> = {
    serialize(src, builder) {
        builder.storeCoins(src.pendingWithdraw);
    },
    parse(src) {
        return {
            pendingWithdraw: src.loadCoins(),
        };
    },
}

export async function resolveNominators(ctx: ResolveContext): Promise<NominatorsContract | null> {

    // Nominators hash
    if (!ctx.code.hash().equals(Buffer.from('mj7BS8CY9rRAZMMFIiyuooAPF92oXuaoGYpwle3hDc8=', 'base64'))) {
        return null;
    }

    // Load data
    let results = await ctx.vm.runGetMethod(ctx.contract.address, 'get_pool_data', []);
    let reader = results.stackReader;
    let stateRaw = reader.readNumber();
    let state: 'idle' | 'sent_stake' | 'validating';
    if (stateRaw === 0) {
        state = 'idle';
    } else if (stateRaw === 1) {
        state = 'sent_stake';
    } else if (stateRaw === 2) {
        state = 'validating';
    } else {
        throw new Error('Invalid state');
    }
    let nominatorsCount = reader.readNumber();
    let stakeSent = reader.readBigNumber();
    let validatorAmount = reader.readBigNumber();
    let validatorAddress = new Address(-1, bigintToBuffer(reader.readBigNumber()));
    let validatorRewardShare = reader.readNumber() / 100;
    let maximumValidatorsCount = reader.readNumber();
    let minValidatorStake = reader.readBigNumber();
    let minNominatorStake = reader.readBigNumber();

    // Load monitors
    let nominatorsRaw = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), NominatorValue, reader.readCell());
    let withdrawRequestsRaw = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), WithdrawValue, reader.readCellOpt());
    let nominators: { [key: string]: { balance: bigint, pendingDeposit: bigint, pendingWithdraw: bigint } } = {};
    for (let [addr, v] of nominatorsRaw) {
        let address = new Address(0, bigintToBuffer(addr));
        let balance = v.balance;
        let pendingDeposit = v.pendingDeposit;
        nominators[address.toString({ testOnly: !isMainnet })] = {
            balance,
            pendingDeposit,
            pendingWithdraw: 0n
        };
    }
    for (let [addr, v] of withdrawRequestsRaw) {
        let address = new Address(0, bigintToBuffer(addr));
        nominators[address.toString({ testOnly: !isMainnet })].pendingWithdraw = v.pendingWithdraw;
    }

    return {
        type: 'ton-nominators',
        state,
        nominatorsCount,
        stakeSent,
        validatorAmount,
        validatorAddress,
        validatorRewardShare,
        maximumValidatorsCount,
        minValidatorStake,
        minNominatorStake,
        nominators
    };
}