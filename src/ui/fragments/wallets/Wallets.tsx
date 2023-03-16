import * as React from 'react';
import { Image, View } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../storage/App';
import { Button } from '../../components/Button';
import { Content } from '../../components/Content';
import { Header } from '../../components/Header';
import { useModal } from '../../components/Modal';
import { ConnectModal } from '../connect/ConnectModal';
import iconWallets from '../../../assets/sidebar_wallets.svg';
import { Text } from '../../components/Themed';

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
            <Header title="Wallets" right={<Button title="Connect" onClick={doAddNewWallet} />} />
            <Content>
                {Object.keys(wallets).length === 0 && (
                    <View style={{ flexGrow: 1, flexBasis: 0, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={{ uri: iconWallets }} style={{ width: 48, height: 48, opacity: 0.5 }} />
                        <Text style={{ width: 300, textAlign: 'center', fontWeight: '600', fontSize: 16, lineHeight: 24, marginTop: 14, opacity: 0.5 }}>
                            Connect you existing TON Wallet by pressing "Connect"
                        </Text>
                    </View>
                )}
                {Object.keys(wallets).map((address) => (
                    <Button title={address} onClick={() => navigate(`/wallets/${address}`)} />
                ))}
            </Content>
        </>
    );
});