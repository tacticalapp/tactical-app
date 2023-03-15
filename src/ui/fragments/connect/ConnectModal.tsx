import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Button } from '../../components/Button';
import { Modal, useModal } from '../../components/Modal';
import { Stack, useStack } from '../../components/Stack';
import { Text } from '../../components/Themed';
import { useDevice } from './useDevice';

const ConnectLedger = React.memo(() => {
    const device = useDevice();
    const modal = useModal();

    if (device.kind === 'waiting') {
        return (
            <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        )
    }

    if (device.kind === 'error') {
        return (
            <View style={{ height: 400, width: 400, gap: 16, alignItems: 'center', justifyContent: 'center' }}>
                {device.error === 'unknown' && <Text>Unknown error. Please, try again.</Text>}
                {device.error === 'user-cancelled' && <Text>Operation canceled. Please, try again.</Text>}
                <Button title="Cancel" onClick={() => modal.close()} />
            </View>
        )
    }

    return null;
});

const ConnectTonConnect = React.memo(() => {
    return null;
});

const ConnectModalInit = React.memo(() => {
    const stack = useStack();
    return (
        <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 300, gap: 16 }}>
                <Button title="Ton Connect" onClick={() => stack.push(<ConnectTonConnect />)} />
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
