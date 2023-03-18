import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useParams } from 'react-router-dom';
import { Address, fromNano } from 'ton-core';
import { useAddressInformation } from '../../../connectors/ton/useAddressInformation';
import { useApp } from '../../../storage/App';
import { AddressComponent } from '../../components/AddressComponent';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { Header } from '../../components/Header';
import { useModal } from '../../components/Modal';
import { Section } from '../../components/Section';
import { Title } from '../../components/Title';
import { EditModal } from '../edit/EditModal';
import { TransferModal } from '../transfer/TransferModal';

export const AddressFragment = React.memo(() => {

    const app = useApp();
    const modal = useModal();
    const address = useParams<{ address: string }>().address!;
    const parsedAddress = Address.parse(address);
    const data = useAddressInformation(parsedAddress);
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

    // Resolve right button
    let right: any = undefined;
    if (isWallet) {
        right = (
            <View style={{ gap: 8, flexDirection: 'row' }}>
                <Button title="Transfer" kind="green" onClick={() => modal.show(<TransferModal from={parsedAddress} name={name} wallet={wallet.config} />)} />
                <Button title="Edit" onClick={() => modal.show(<EditModal address={parsedAddress} />)} />
            </View>
        );
    }

    return (
        <>
            <Header title={name} right={right} />
            <Content>
                <Section>
                    <Title title="Address" />
                    <AddressComponent address={address} />
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