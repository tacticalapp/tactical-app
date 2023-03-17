import * as React from 'react';
import { IStorage } from '@tonconnect/sdk';
import { View } from 'react-native';
import { QRCode } from '../../components/qr/QRCode';
import { Text } from '../../components/Themed';
import { Deferred } from '../../components/Deferred';
import { useApp } from '../../../storage/App';
import { useModal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { TonConnectCreator } from '../../../connectors/tonconnect/TonConnectCreator';
import Balancer from 'react-wrap-balancer';
import { isMainnet } from '../../../utils/chain';

export const ConnectTonConnect = React.memo(() => {

    const modal = useModal();
    const app = useApp();
    const [error, setError] = React.useState<string | null>(null);
    const connector = React.useMemo(() => {
        let connector = new TonConnectCreator();

        // Handle success
        connector.onSuccess = (wallet) => {

            // Register wallet
            app.wallets.registerWallet(wallet.address.toString({ testOnly: !isMainnet }), 'Mobile Wallet #1', {
                kind: 'ton-connect',
                storage: wallet.storage,
                device: {
                    platform: wallet.device.platform,
                    appName: wallet.device.appName
                }
            });

            // Close modal
            modal.close();
        };

        // Handle fail
        connector.onFail = (e) => {
            console.log(e);
            setError(e.message);
        }

        let link = connector.createLink();
        return { connector, link };
    }, []);

    return (
        <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
            {error && (
                <View style={{ height: 400, width: 400, gap: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ width: 300, fontWeight: '500', fontSize: 16, lineHeight: 20, opacity: 0.9, textAlign: 'center' }}>
                        <Balancer>
                            {error}
                        </Balancer>
                    </Text>
                    <Button title="Cancel" onClick={() => modal.close()} />
                </View>
            )}
            {!error && (
                <>
                    <Text style={{ fontSize: 18, marginBottom: 18 }}>Scan this QR Code</Text>
                    <Deferred>
                        <QRCode data={connector.link} size={300} />
                    </Deferred>
                </>
            )}
        </View>
    );
});