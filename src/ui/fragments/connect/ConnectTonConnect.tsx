import * as React from 'react';
import TonConnect, { IStorage } from '@tonconnect/sdk';
import { ActivityIndicator, View } from 'react-native';
import { QRCode } from '../../components/qr/QRCode';
import { randomBytes } from '../../../crypto/randomBytes';
import { Text } from '../../components/Themed';
import { Deferred } from '../../components/Deferred';
import { useApp } from '../../../storage/App';
import { useModal } from '../../components/Modal';
import { Address } from 'ton-core';
import { Button } from '../../components/Button';

class Storage implements IStorage {
    data = new Map<string, string>();

    async getItem(key: string): Promise<string | null> {
        let res = this.data.get(key);
        if (res === undefined) {
            return null;
        } else {
            return res;
        }
    }

    async setItem(key: string, value: string): Promise<void> {
        this.data.set(key, value);
    }

    async removeItem(key: string): Promise<void> {
        this.data.delete(key);
    }
}

export const ConnectTonConnect = React.memo(() => {

    const modal = useModal();
    const app = useApp();
    const [error, setError] = React.useState<string | null>(null);
    const storage = React.useMemo(() => new Storage(), []);
    const seed = React.useMemo(() => {
        return randomBytes(32).toString('hex')
    }, []);
    const connector = React.useMemo(() => {
        let res = new TonConnect({ storage, manifestUrl: 'https://tacticalapp.org/ton-manifest.json' });
        let completed = false;
        res.onStatusChange((status) => {
            if (status && !completed) {
                completed = true;

                // Register wallet
                app.wallets.registerWallet(Address.parseRaw(status.account.address).toString(), 'Tonkeeper #1', {
                    kind: 'ton-connect',
                    storage: JSON.stringify(storage.data)
                });

                // Close modal
                modal.close();
            }
        }, (e) => {
            if (!completed) {
                completed = true;
                console.log(e);
                setError(e.message);
            }
        });
        return res;
    }, []);
    const link = React.useMemo(() => {
        return connector.connect({
            universalLink: 'https://app.tonkeeper.com/ton-connect',
            bridgeUrl: 'https://bridge.tonapi.io/bridge',
        }, { tonProof: seed });
    }, [connector]);

    return (
        <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
            {error && (
                <View style={{ height: 400, width: 400, gap: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Operation canceled. Please, try again.</Text>
                    <Button title="Cancel" onClick={() => modal.close()} />
                </View>
            )}
            {!error && (
                <>
                    <Text style={{ fontSize: 18, marginBottom: 18 }}>Scan this QR Code</Text>
                    <Deferred>
                        <QRCode data={link} size={300} />
                    </Deferred>
                </>
            )}
        </View>
    );
});