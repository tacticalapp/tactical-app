import TonConnect, { CHAIN, UserRejectsError } from '@tonconnect/sdk';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Address, comment } from 'ton-core';
import { TonConnectStorage } from '../../../connectors/tonconnect/TonConnectStorage';
import { WalletConfig } from '../../../storage/Wallets';
import { isMainnet } from '../../../utils/chain';
import { backoff } from '../../../utils/time';
import { Maybe } from '../../../utils/type';
import { Button } from '../../components/Button';
import { useModal } from '../../components/Modal';
import { Text } from '../../components/Themed';

export const TransferExecuteConnect = React.memo((props: {
    wallet: WalletConfig,
    from: Address,
    to: Address,
    amount: bigint,
    stateInit?: Maybe<Buffer>,
    payload?: Maybe<{
        kind: 'text',
        text: string,
    } | {
        kind: 'boc',
        data: Buffer,
    }>
}) => {

    const modal = useModal();
    const [state, setState] = React.useState<{
        kind: 'connecting'
    } | {
        kind: 'need-reconnect'
    } | {
        kind: 'canceled',
    } | {
        kind: 'done',
    }>({ kind: 'connecting' });

    // Request to ton-connect
    React.useEffect(() => {
        if (props.wallet.kind !== 'ton-connect') {
            throw new Error('Invalid wallet kind');
        }
        const wallet = props.wallet;
        let exited = false;

        // Try to request transaction
        backoff(async () => {
            if (exited) {
                return;
            }

            // Load store and client
            const storage = TonConnectStorage.load(wallet.storage);
            const client = new TonConnect({ storage });
            await client.restoreConnection(); if (exited) { return; }
            if (!client.connected) {
                setState({ kind: 'need-reconnect' });
                return;
            }

            // Request transaction
            let payload: string | undefined = undefined;
            if (props.payload && props.payload.kind === 'boc') {
                payload = props.payload.data.toString('base64');
            } else if (props.payload && props.payload.kind === 'text') {
                payload = comment(props.payload.text).toBoc({ idx: false }).toString('base64');
            }
            try {
                await client.sendTransaction({
                    validUntil: (Date.now() / 1000) + 60,
                    network: isMainnet ? CHAIN.MAINNET : CHAIN.TESTNET,
                    from: props.from.toRawString(),
                    messages: [{
                        address: props.to.toRawString(),
                        amount: props.amount.toString(),
                        stateInit: props.stateInit ? props.stateInit.toString('base64') : undefined,
                        payload
                    }]
                });
            } catch (e) {
                if (e instanceof UserRejectsError) {
                    if (!exited) {
                        setState({ kind: 'canceled' });
                    }
                    return;
                }
                throw e;
            }

            // Complete
            if (!exited) {
                setState({ kind: 'done' });
            }
        });

        return () => {
            exited = true;
        };
    }, []);

    if (state.kind === 'connecting') {
        return (
            <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#fff" />
                <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 12 }}>
                    Please, confirm transaction in Tonkeeper
                </Text>
            </View>
        );
    }

    if (state.kind === 'need-reconnect') {
        return (
            <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 12 }}>
                    It seems that wallet was disconnected from Tactical. Please, reconnect it and try again.
                </Text>
                <Button title="Cancel" onClick={() => modal.close()} />
            </View>
        );
    }

    if (state.kind === 'canceled') {
        return (
            <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 12 }}>
                    It seems that wallet was disconnected from Tactical. Please, reconnect it and try again.
                </Text>
                <Button title="Cancel" onClick={() => modal.close()} />
            </View>
        );
    }

    return (
        <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 12 }}>
                Transaction was successfully sent to the network.
            </Text>
            <Button title="Close" onClick={() => modal.close()} />
        </View>
    );
});