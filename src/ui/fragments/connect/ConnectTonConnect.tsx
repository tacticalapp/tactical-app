import * as React from 'react';
import TonConnect, { IStorage } from '@tonconnect/sdk';
import { View } from 'react-native';
import { QRCode } from '../../components/qr/QRCode';

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
    const storage = React.useMemo<IStorage>(() => new Storage(), []);
    const connector = React.useMemo(() => {
        return new TonConnect({ storage });
    }, []);
    const link = React.useMemo(() => {
        return connector.connect({
            universalLink: 'https://app.tonkeeper.com/ton-connect',
            bridgeUrl: 'https://bridge.tonapi.io/bridge',
        });
    }, [connector]);
    console.log(link);

    return (
        <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
            <QRCode data={link} size={300} />
        </View>
    );
});