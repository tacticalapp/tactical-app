import * as React from 'react';
import { View } from 'react-native';
import { Address, fromNano } from 'ton-core';
import { WalletConfig } from '../../../storage/Wallets';
import { Maybe } from '../../../utils/type';
import { AddressComponent } from '../../components/AddressComponent';
import { Button } from '../../components/Button';
import { Section } from '../../components/Section';
import { useStack } from '../../components/Stack';
import { Title } from '../../components/Title';
import { TransferExecuteLedger } from './TransferExecuteLedger';

export const TransferConfirm = React.memo((props: {
    wallet: WalletConfig,
    name: string,
    from: Address,
    to: Address,
    amount: bigint,
    stateInit?: Maybe<Buffer>,
    payload?: Maybe<{
        kind: 'text',
        text: string,
    } | {
        kind: 'boc',
        data: Buffer,
    }>
}) => {

    const stack = useStack();
    const doNext = React.useCallback(() => {
        if (props.wallet.kind === 'ledger') {
            stack.push(<TransferExecuteLedger
                wallet={props.wallet}
                from={props.from}
                to={props.to}
                amount={props.amount}
                stateInit={props.stateInit}
                payload={props.payload}
            />);
        }
    }, []);

    return (
        <View style={{ height: 400, width: 400, alignItems: 'flex-start', justifyContent: 'center' }}>
            <View style={{ width: 400, gap: 16, marginBottom: 32 }}>
                <Section>
                    <Title title={props.name} />
                    <AddressComponent address={props.from} maxLength={40} />
                </Section>
                <Section>
                    <Title title="Amount" />
                    <span>{fromNano(props.amount)} TON</span>
                </Section>
                {props.payload && props.payload.kind === 'text' && (
                    <Section>
                        <Title title="Comment" />
                        <span>{props.payload.text}</span>
                    </Section>
                )}
                {props.payload && props.payload.kind === 'boc' && (
                    <Section>
                        <Title title="Payload" />
                        <span>{props.payload.data.toString('hex')}</span>
                    </Section>
                )}
            </View>
            <Button title="Confirm" onClick={doNext} />
        </View>
    );
});