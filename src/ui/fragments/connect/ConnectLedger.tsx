import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Button } from '../../components/Button';
import { useModal } from '../../components/Modal';
import { Text } from '../../components/Themed';
import { useLedgerAction } from '../../../connectors/ledger/useLedgerAction';
import { TonTransport } from 'ton-ledger';
import { isMainnet } from '../../../utils/chain';
import { useApp } from '../../../storage/App';
import { getLedgerPath } from '../../../connectors/ledger/getLedgerPath';

export const ConnectLedger = React.memo(() => {

    const modal = useModal();
    const app = useApp();
    const actionCallback = React.useCallback(async (transport: TonTransport) => {

        // Search for non-added account
        let index = 0;
        while (true) {

            // Get address
            const path = getLedgerPath(isMainnet ? 'mainnet' : 'testnet', 0, index);
            let address = await transport.getAddress(path, { testOnly: !isMainnet, bounceable: true });

            // Register wallet
            if (!app.wallets.hasWallet(address.address)) {
                app.wallets.registerWallet(address.address, 'Ledger Wallet #' + (index + 1), {
                    kind: 'ledger',
                    path,
                    publicKey: address.publicKey.toString('base64')
                });
                break;
            }

            // Next
            index++;
        }

        // Hide modal
        modal.close();

    }, []);
    const action = useLedgerAction(actionCallback);

    if (action.kind === 'await-device') {
        return (
            <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#fff" />
                <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 12 }}>
                    Please, connect and unlock Ledger device.
                </Text>
            </View>
        );
    }

    if (action.kind === 'await-app') {
        return (
            <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#fff" />
                <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 12 }}>
                    Please, open allow opening TON app.
                </Text>
            </View>
        );
    }

    if (action.kind === 'failed') {
        return (
            <View style={{ height: 400, width: 400, gap: 16, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Unknown error. Please, try again.</Text>
                <Button title="Cancel" onClick={() => modal.close()} />
            </View>
        );
    }

    if (action.kind === 'canceled') {
        return (
            <View style={{ height: 400, width: 400, gap: 16, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Operation canceled. Please, try again.</Text>
                <Button title="Cancel" onClick={() => modal.close()} />
            </View>
        );
    }

    return (
        <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color="#fff" />
            <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 12 }}>
                Searching for an account...
            </Text>
        </View>
    );
});