import * as React from 'react';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { Header } from '../../components/Header';
import { useModal } from '../../components/Modal';
import { ConnectModal } from '../connect/ConnectModal';

export const Wallets = React.memo(() => {

    const modal = useModal();
    const doAddNewWallet = React.useCallback(() => {
        modal.show(<ConnectModal />);
    }, []);

    return (
        <>
            <Header title="Wallets" />
            <Content>
                <Button title="Add new" onClick={doAddNewWallet} />
            </Content>
        </>
    );
});