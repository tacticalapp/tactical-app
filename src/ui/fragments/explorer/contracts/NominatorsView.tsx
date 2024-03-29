import * as React from 'react';
import { View } from 'react-native';
import { Address, fromNano, toNano } from 'ton-core';
import { NominatorsContract } from '../../../../resolvers/contracts/resolveNominators';
import { useApp } from '../../../../storage/App';
import { AddressComponent } from '../../../components/AddressComponent';
import { Button } from '../../../components/Button';
import { useModal } from '../../../components/Modal';
import { Section } from '../../../components/Section';
import { Title } from '../../../components/Title';
import { TransferModal } from '../../transfer/TransferModal';

export const NominatorsView = React.memo((props: { address: Address, src: NominatorsContract }) => {

    const modal = useModal();
    const doRequestDeposit = React.useCallback(() => {
        modal.show(<TransferModal to={props.address} comment="d" />);
    }, [props.address]);
    const doRequestWithdraw = React.useCallback(() => {
        modal.show(<TransferModal to={props.address} amount={toNano(1)} comment="w" />);
    }, [props.address]);

    const app = useApp();
    const wallets = app.wallets.use();
    const contacts = app.contacts.use();
    let own: { address: string, name: string, balance: bigint, pendingDeposit: bigint, pendingWithdraw: bigint }[] = [];
    let other: { address: string, name: string, balance: bigint, pendingDeposit: bigint, pendingWithdraw: bigint }[] = [];
    for (let n of Object.keys(props.src.nominators)) {
        let w = wallets[n];
        if (w) {
            own.push({
                address: n,
                name: w.name,
                balance: props.src.nominators[n].balance,
                pendingDeposit: props.src.nominators[n].pendingDeposit,
                pendingWithdraw: props.src.nominators[n].pendingWithdraw
            });
        } else {
            let name = n;
            if (contacts[n]) {
                name = contacts[n].name;
            }
            other.push({
                address: n,
                name,
                balance: props.src.nominators[n].balance,
                pendingDeposit: props.src.nominators[n].pendingDeposit,
                pendingWithdraw: props.src.nominators[n].pendingWithdraw
            });
        }
    }


    return (
        <>
            <Section>
                <Title title="Contract Type" />
                <span>TON Nominators</span>
            </Section>
            <Section>
                <Title title="Actions" />
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    <Button title="Deposit" kind="green" onClick={doRequestDeposit} />
                    <Button title="Withdraw" kind="red" onClick={doRequestWithdraw} />
                </View>
            </Section>
            <Section>
                <Title title="State" />
                <span>{props.src.state}</span>
            </Section>
            <Section>
                <Title title="LTV" />
                <span>{fromNano(props.src.tlv)} TON</span>
            </Section>
            {own.map((v) => (
                <Section key={v.address}>
                    <Title title={v.name} />
                    <span>
                        <span>{fromNano(v.balance)} TON</span><span> / </span>
                        <span>{fromNano(v.pendingDeposit)} TON</span><span> / </span>
                        <span>{fromNano(v.pendingWithdraw)} TON</span>
                    </span>
                </Section>
            ))}
            <Section>
                <Title title="Nominators count" />
                <span>{props.src.nominatorsCount.toString()}</span>
            </Section>
            <Section>
                <Title title="Stake sent to elector" />
                <span>{fromNano(props.src.stakeSent)} TON</span>
            </Section>
            <Section>
                <Title title="Validator Reward Share" />
                <span>{props.src.validatorRewardShare.toFixed(2)}%</span>
            </Section>
            <Section>
                <Title title="Maximium validators count" />
                <span>{props.src.maximumValidatorsCount}</span>
            </Section>
            <Section>
                <Title title="Minimum validator stake" />
                <span>{fromNano(props.src.minValidatorStake)} TON</span>
            </Section>
            <Section>
                <Title title="Minimum nominator stake" />
                <span>{fromNano(props.src.minNominatorStake)} TON</span>
            </Section>
            <Section>
                <Title title="Validator Stake" />
                <span>{fromNano(props.src.validatorAmount)} TON</span>
            </Section>
            <Section>
                <Title title="Validator" />
                <AddressComponent address={props.src.validatorAddress} />
            </Section>
            <Section>
                <Title title="Nominators" />
                {other.map((v) => (
                    <React.Fragment key={v.address}>
                        <AddressComponent address={v.address} />
                        <span>
                            <span>{fromNano(v.balance)} TON</span><span> / </span>
                            <span>{fromNano(v.pendingDeposit)} TON</span><span> / </span>
                            <span>{fromNano(v.pendingWithdraw)} TON</span>
                        </span>
                    </React.Fragment>
                ))}
            </Section>
        </>
    )
});