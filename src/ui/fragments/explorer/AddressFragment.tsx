import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../../storage/App';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { Header } from '../../components/Header';

export const AddressFragment = React.memo(() => {
    
    const app = useApp();
    const address = useParams<{ address: string }>().address!;
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
                <span>{address}</span>
            </Content>
        </>
    );
});