import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WalletContractV4 } from 'ton';
import { Address, Cell, SendMode } from 'ton-core';
import { TonPayloadFormat, TonTransport } from 'ton-ledger';
import { useLedgerAction } from '../../../connectors/ledger/useLedgerAction';
import { getTonClient } from '../../../connectors/ton/getTonClient';
import { WalletConfig } from '../../../storage/Wallets';
import { isMainnet } from '../../../utils/chain';
import { backoff, delay } from '../../../utils/time';
import { Maybe } from '../../../utils/type';
import { Button } from '../../components/Button';
import { useModal } from '../../components/Modal';
import { Text } from '../../components/Themed';

const Stage1Component = React.memo((props: {
    from: Address,
    to: Address,
    onResult: (
        block: number,
        time: number,
        seqno: number,
        fromDeployed: boolean,
        toDeployed: boolean
    ) => void
}) => {

    React.useEffect(() => {
        let exited = false;
        backoff(async () => {
            let client = await getTonClient(); if (exited) { return; }
            let block = await client.getLastBlock(); if (exited) { return; }
            let accountFrom = await client.getAccountLite(block.last.seqno, props.from); if (exited) { return; }
            let accountTo = await client.getAccountLite(block.last.seqno, props.to); if (exited) { return; }
            let seqno = 0;
            if (accountFrom.account.state.type === 'active') {
                seqno = (await client.runMethod(block.last.seqno, props.from, 'seqno')).reader.readNumber(); if (exited) { return; }
            }
            props.onResult(block.last.seqno, block.now, seqno, accountFrom.account.state.type === 'active', accountTo.account.state.type === 'active');
        });
        return () => {
            exited = true;
        };
    }, [props.from, props.to]);

    return (
        <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color="#fff" />
            <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 12 }}>
                Prepearing transaction for signing...
            </Text>
        </View>
    );
});

const Stage2Component = React.memo((props: {
    wallet: WalletConfig,
    from: Address,
    to: Address,
    block: number,
    seqno: number,
    time: number,
    amount: bigint,
    fromDeployed: boolean,
    toDeployed: boolean,
    stateInit?: Maybe<Buffer>,
    payload?: Maybe<{
        kind: 'text',
        text: string,
    } | {
        kind: 'boc',
        data: Buffer,
    }>
    onResult: (signedMessage: Cell, publicKey: Buffer, seqno: number) => void
}) => {

    const modal = useModal();
    const actionCallback = React.useCallback(async (transport: TonTransport) => {
        if (props.wallet.kind !== 'ledger') {
            throw new Error('Invalid wallet kind');
        }

        // Check address
        let address = await transport.getAddress(props.wallet.path, { testOnly: !isMainnet, bounceable: true });
        if (address.address !== props.from.toString({ testOnly: !isMainnet, bounceable: true })) {
            throw new Error('Invalid wallet address');
        }
        if (address.publicKey.toString('base64') !== props.wallet.publicKey) {
            throw new Error('Invalid wallet public key');
        }

        // Request signature
        let payload: TonPayloadFormat | undefined;
        if (props.payload && props.payload.kind === 'text') {
            payload = {
                type: 'comment',
                text: props.payload.text,
            };
        }
        if (props.payload && props.payload.kind === 'boc') {
            payload = {
                type: 'unsafe',
                message: Cell.fromBoc(props.payload.data)[0],
            };
        }
        let res = await transport.signTransaction(props.wallet.path, {
            seqno: props.seqno,
            timeout: props.time + 60, // 1 minute in seconds
            to: props.to,
            amount: props.amount,
            sendMode: SendMode.IGNORE_ERRORS || SendMode.PAY_GAS_SEPARATELY,
            bounce: props.toDeployed && !props.stateInit,
            payload,
        });

        // Next
        props.onResult(res, address.publicKey, props.seqno);
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
                <Text style={{ marginBottom: 12 }}>Unknown error. Please, try again.</Text>
                <Button title="Cancel" onClick={() => modal.close()} />
            </View>
        );
    }

    if (action.kind === 'canceled') {
        return (
            <View style={{ height: 400, width: 400, gap: 16, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ marginBottom: 12 }}>Operation canceled. Please, try again.</Text>
                <Button title="Cancel" onClick={() => modal.close()} />
            </View>
        );
    }

    return (
        <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color="#fff" />
            <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 12 }}>
                Awaiting confirmation on Ledger device...
            </Text>
        </View>
    );
});

const Stage3Component = React.memo((props: { seqno: number, publicKey: Buffer, signedMessage: Cell, onDone: () => void }) => {

    React.useEffect(() => {
        let exited = false;
        backoff(async () => {
            if (exited) { return; }

            // Open contract
            let client = await getTonClient(); if (exited) { return; }
            let source = WalletContractV4.create({ workchain: 0, publicKey: props.publicKey });
            let contract = client.open(source);

            // Send message
            await contract.send(props.signedMessage);

            // Await transaction
            await backoff(async () => {
                while (!exited) {
                    let s = await contract.getSeqno();
                    if (s > props.seqno) {
                        return;
                    }
                    await delay(1000);
                }
            });

            // Close
            if (!exited) {
                props.onDone();
            }
        });
        return () => {
            exited = true;
        }
    }, []);

    return (
        <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color="#fff" />
            <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 12 }}>
                Sending transaction...
            </Text>
        </View>
    );
});

export const TransferExecuteLedger = React.memo((props: {
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
    const [stage, setStage] = React.useState<{
        stage: 'first'
    } | {
        stage: 'second',
        time: number,
        block: number,
        seqno: number,
        fromDeployed: boolean,
        toDeployed: boolean
    } | {
        stage: 'third',
        signedMessage: Cell,
        publicKey: Buffer,
        seqno: number
    } | {
        stage: 'done',
    }>({ stage: 'first' });

    if (stage.stage === 'first') {
        return (
            <Stage1Component
                from={props.from}
                to={props.to}
                onResult={(block, time, seqno, fromDeployed, toDeployed) => {
                    setStage({ stage: 'second', block, seqno, time, fromDeployed, toDeployed });
                }}
            />
        );
    }

    if (stage.stage === 'second') {
        return (
            <Stage2Component
                wallet={props.wallet}
                from={props.from}
                to={props.to}
                amount={props.amount}
                block={stage.block}
                time={stage.time}
                seqno={stage.seqno}
                fromDeployed={stage.fromDeployed}
                toDeployed={stage.toDeployed}
                payload={props.payload}
                onResult={(signedMessage, publicKey, seqno) => {
                    setStage({ stage: 'third', signedMessage, publicKey, seqno });
                }}
            />
        );
    }

    if (stage.stage === 'third') {
        return (
            <Stage3Component
                seqno={stage.seqno}
                publicKey={stage.publicKey}
                signedMessage={stage.signedMessage}
                onDone={() => {
                    setStage({ stage: 'done' });
                }}
            />
        );
    }

    return (
        <View style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 12 }}>
                Transaction successfuly executed!
            </Text>
            <Button title="Close" onClick={() => modal.close(modal.current)} />
        </View>
    );
});