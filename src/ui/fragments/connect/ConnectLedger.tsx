import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Button } from '../../components/Button';
import { useModal } from '../../components/Modal';
import { Text } from '../../components/Themed';
import { useDevice } from '../../../connectors/ledger/useDevice';

export const ConnectLedger = React.memo(() => {
    const device = useDevice();
    const modal = useModal();

    if (device.kind === 'waiting') {
        return (
            <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    if (device.kind === 'error') {
        return (
            <View style={{ height: 400, width: 400, gap: 16, alignItems: 'center', justifyContent: 'center' }}>
                {device.error === 'unknown' && <Text>Unknown error. Please, try again.</Text>}
                {device.error === 'user-cancelled' && <Text>Operation canceled. Please, try again.</Text>}
                <Button title="Cancel" onClick={() => modal.close()} />
            </View>
        );
    }

    return null;
});