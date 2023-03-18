import * as React from 'react';
import { ActivityIndicator } from 'react-native';
import { useParams } from 'react-router-dom';
import { Address, fromNano } from 'ton-core';
import { useAddressInformation } from '../../../connectors/ton/useAddressInformation';
import { useApp } from '../../../storage/App';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { Header } from '../../components/Header';
import { Section } from '../../components/Section';
import { Title } from '../../components/Title';

export const AddressFragment = React.memo(() => {

    const app = useApp();
    const address = useParams<{ address: string }>().address!;
    const data = useAddressInformation(Address.parse(address));
    const wallet = app.wallets.use()[address];
    const isWallet = !!wallet;
    const contacts = app.contacts.use()[0];
    let name: string;
    if (wallet) {
        name = wallet.name;
    } else if (contacts[address]) {
        name = contacts[address].name;
    } else {
        name = address
    }

    return (
        <>
            <Header title={name} right={isWallet ? <Button title="Disconnect" onClick={() => app.wallets.unregisterWallet(address)} /> : undefined} />
            <Content>
                <Section>
                    <Title title="Address" />
                    <span>{address}</span>
                </Section>
                {!data && (<ActivityIndicator color="#fff" />)}
                {data && (
                    <>
                        <Section>
                            <Title title="Balance" />
                            <span>{fromNano(data.account.balance.coins)} TON</span>
                        </Section>
                    </>
                )}
            </Content>
        </>
    );
});