import * as React from 'react';
import { View } from 'react-native';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { Header } from '../../components/Header';
import { Modal, useModal } from '../../components/Modal';

const AddWalletModal = React.memo(() => {
    const modal = useModal();
    return (
        <Modal>
            <Button title="Close" onClick={modal.close} />
        </Modal>
    )
});

export const Wallets = React.memo(() => {

    const modal = useModal();
    const doAddNewWallet = React.useCallback(() => {
        modal.show(<AddWalletModal />);
        // 
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