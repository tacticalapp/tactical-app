import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../../storage/App';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { Header } from '../../components/Header';

export const AddressFragment = React.memo(() => {
    const app = useApp();
    const address = useParams<{ address: string }>().address!;
    return (
        <>
            <Header title="Wallet" />
            <Content>
                <Button title="Remove" onClick={() => app.wallets.unregisterWallet(address)} />
            </Content>
        </>
    );
});