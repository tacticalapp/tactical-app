import * as React from 'react';
import { View } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../storage/App';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { Header } from '../../components/Header';
import { useModal } from '../../components/Modal';
import { ConnectModal } from '../connect/ConnectModal';

export const Wallets = React.memo(() => {

    const app = useApp();
    const wallets = app.wallets.use();
    const modal = useModal();
    const navigate = useNavigate();
    const doAddNewWallet = React.useCallback(() => {
        modal.show(<ConnectModal />);
    }, []);

    return (
        <>
            <Header title="Wallets" />
            <Content>
                <Button title="Add new" onClick={doAddNewWallet} />
                {Object.keys(wallets).map((address) => (
                    <Button title={address} onClick={() => navigate(`/wallets/${address}`)} />
                ))}
            </Content>
        </>
    );
});