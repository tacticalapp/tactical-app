import * as React from 'react';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { Header } from '../../components/Header';

export const SearchFragment = React.memo(() => {
    return (
        <>
            <Header title="Explorer" />
            <Content>
                {/* <Button title="Remove" onClick={() => app.wallets.unregisterWallet(address)} /> */}
            </Content>
        </>
    );
});