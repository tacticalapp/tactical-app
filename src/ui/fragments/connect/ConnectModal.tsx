import * as React from 'react';
import { View } from 'react-native';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Stack, useStack } from '../../components/Stack';
import { ConnectLedger } from './ConnectLedger';
import { ConnectTonConnect } from './ConnectTonConnect';

const ConnectModalInit = React.memo(() => {
    const stack = useStack();
    return (
        <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 300, gap: 16 }}>
                <Button title="Tonkeeper" onClick={() => stack.push(<ConnectTonConnect />)} />
                <Button title="Ledger" onClick={() => stack.push(<ConnectLedger />)} />
            </View>
        </View>
    )
});

export const ConnectModal = React.memo(() => {
    return (
        <Modal title="Add Wallet">
            <View style={{ height: 400, width: 400, overflow: 'hidden' }}>
                <Stack initial={<ConnectModalInit />} />
            </View>
        </Modal>
    )
});
