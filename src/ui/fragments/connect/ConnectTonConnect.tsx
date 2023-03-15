import * as React from 'react';
import TonConnect, { IStorage } from '@tonconnect/sdk';
import { View } from 'react-native';
import { QRCode } from '../../components/qr/QRCode';
import { randomBytes } from '../../../crypto/randomBytes';
import { Text } from '../../components/Themed';
import { Deferred } from '../../components/Deferred';

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
    const storage = React.useMemo(() => new Storage(), []);
    const seed = React.useMemo(() => {
        return randomBytes(32).toString('hex')
    }, []);
    const connector = React.useMemo(() => {
        let res = new TonConnect({ storage, manifestUrl: 'https://tacticalapp.org/ton-manifest.json' });
        res.onStatusChange((status) => {
            console.log(status);
            console.log(storage.data);
        }, (e) => {
            console.log(e);
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
            <Text style={{ fontSize: 18, marginBottom: 18 }}>Scan this QR Code</Text>
            <Deferred>
                <QRCode data={link} size={300} />
            </Deferred>
        </View>
    );
});