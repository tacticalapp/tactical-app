import * as React from 'react';
import { View } from 'react-native';
import { Address } from 'ton-core';
import { WalletConfig } from '../../../storage/Wallets';
import { isMainnet } from '../../../utils/chain';
import { AddressComponent } from '../../components/AddressComponent';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Section } from '../../components/Section';
import { Stack, useStack } from '../../components/Stack';
import { TextInput } from '../../components/TextInput';
import { Text } from '../../components/Themed';
import { Title } from '../../components/Title';

const ConnectModalInit = React.memo((props: { from: Address, name: string, wallet: WalletConfig }) => {
    const stack = useStack();
    return (
        <View style={{ height: 400, width: 400, alignItems: 'flex-start', justifyContent: 'center' }}>
            <View style={{ width: 400, gap: 16, marginBottom: 32 }}>
                <Section>
                    <Title title={props.name} />
                    <AddressComponent address={props.from} maxLength={40} />
                </Section>
                <Section>
                    <Title title="Send To" />
                    <TextInput style={{ alignSelf: 'stretch' }} placeholder="Destination address" />
                </Section>
                <Section>
                    <Title title="Comment" />
                    <TextInput style={{ alignSelf: 'stretch' }} placeholder="(optional)" />
                </Section>
                <Section>
                    <Title title="Amount" />
                    <TextInput style={{ alignSelf: 'stretch' }} placeholder="amount in TONs" />
                </Section>
            </View>
            <Button title="Continue" onClick={() => { }} />
        </View>
    )
});

export const TransferModal = React.memo((props: { from: Address, name: string, wallet: WalletConfig }) => {
    return (
        <Modal title="Transfer">
            <View style={{ height: 400, width: 400, overflow: 'hidden' }}>
                <Stack initial={<ConnectModalInit from={props.from} name={props.name} wallet={props.wallet} />} />
            </View>
        </Modal>
    );
});