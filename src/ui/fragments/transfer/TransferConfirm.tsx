import * as React from 'react';
import { View } from 'react-native';
import { Address, fromNano } from 'ton-core';
import { useApp } from '../../../storage/App';
import { WalletConfig } from '../../../storage/Wallets';
import { isMainnet } from '../../../utils/chain';
import { Maybe } from '../../../utils/type';
import { AddressComponent } from '../../components/AddressComponent';
import { Button } from '../../components/Button';
import { Section } from '../../components/Section';
import { useStack } from '../../components/Stack';
import { Text } from '../../components/Themed';
import { Title } from '../../components/Title';
import { TransferExecuteConnect } from './TransferExecuteConnect';
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

    const app = useApp();
    const contacts = app.contacts.use();
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
        if (props.wallet.kind === 'ton-connect') {
            stack.push(<TransferExecuteConnect
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
                    <Title title={'Trasnfer from'} />
                    <Text style={{ marginBottom: 8 }}>{props.name}</Text>
                    <AddressComponent address={props.from} maxLength={40} />
                </Section>
                <Section>
                    <Title title={'Transfer to'} />
                    {contacts[props.to.toString({ testOnly: !isMainnet })]
                        ? (<Text style={{ marginBottom: 8 }}>{contacts[props.to.toString({ testOnly: !isMainnet })].name}</Text>)
                        : null
                    }
                    <AddressComponent address={props.to} maxLength={40} />
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