import * as React from 'react';
import { View } from 'react-native';
import { Address } from 'ton-core';
import { useApp } from '../../../storage/App';
import { isMainnet } from '../../../utils/chain';
import { AddressComponent } from '../../components/AddressComponent';
import { Button } from '../../components/Button';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Modal, useModal } from '../../components/Modal';
import { Section } from '../../components/Section';
import { TextInput } from '../../components/TextInput';
import { Title } from '../../components/Title';

export const EditModal = React.memo((props: { address: Address }) => {
    const app = useApp();
    const modal = useModal();
    const address = props.address.toString({ testOnly: !isMainnet });
    const wallet = app.wallets.use()[address];
    const contact = app.contacts.use()[address];
    let initialName = '';
    if (wallet) {
        initialName = wallet.name;
    } else if (contact) {
        initialName = contact.name;
    }
    let [name, setName] = React.useState(initialName);
    const doSave = () => {
        if (app.wallets.hasWallet(address)) {
            app.wallets.renameWallet(address, name);
        } else {
            app.contacts.updateContact(address, name);
        }
        modal.close();
    };
    const doDisconnect = () => {
        modal.show(<ConfirmModal
            title="Disconnect wallet?"
            message="Are you sure you want to disconnect this wallet from the app? This will NOT destroy your wallet."
            action="Disconnect"
            onConfirm={(yes) => {
                if (yes) {
                    app.wallets.unregisterWallet(address);
                }
            }}
        />);
    };

    return (
        <Modal title="Edit Address">
            <View style={{ width: 400, overflow: 'hidden', gap: 32, marginTop: 32, marginBottom: 48 }}>
                <Section>
                    <Title title="Address" />
                    <AddressComponent address={address} maxLength={40} />
                </Section>
                <Section>
                    <Title title="Name" />
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        style={{ alignSelf: 'stretch' }}
                        placeholder="Optional name"
                    />
                </Section>
                {wallet && (
                    <Section>
                        <Title title="Disconnect" />
                        <span>Remove wallet from the app. This will NOT destroy your wallet.</span>
                        <View style={{ height: 12 }} />
                        <Button title="Disconnect" kind="red" onClick={doDisconnect} />
                    </Section>
                )}
            </View>
            <Section>
                <Button title="Save" onClick={doSave} />
            </Section>
        </Modal>
    );
});