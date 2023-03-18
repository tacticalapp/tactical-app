import * as React from 'react';
import { View } from 'react-native';
import { useAnimationControls, motion } from 'framer-motion';
import { Address, toNano } from 'ton-core';
import { WalletConfig } from '../../../storage/Wallets';
import { AddressComponent } from '../../components/AddressComponent';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Section } from '../../components/Section';
import { Stack, useStack } from '../../components/Stack';
import { TextInput } from '../../components/TextInput';
import { Title } from '../../components/Title';
import { shake } from '../../../utils/shake';
import { TransferConfirm } from './TransferConfirm';

const TransferModalInit = React.memo((props: { from: Address, name: string, wallet: WalletConfig }) => {
    const stack = useStack();
    const [to, setTo] = React.useState('');
    const [comment, setComment] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const sendToControls = useAnimationControls();
    const commentControls = useAnimationControls();
    const amountControls = useAnimationControls();
    const doNext = React.useCallback(() => {

        // Load address
        let address: Address;
        try {
            address = Address.parse(to);
        } catch (e) {
            shake(sendToControls);
            return;
        }

        // Load comment
        let commentText: string | null = comment.trim();
        if (commentText === '') {
            commentText = null;
        }

        // Load amount
        let amountValue: bigint;
        try {
            if (amount.trim() === '') {
                throw new Error('Empty amount');
            }
            amountValue = toNano(amount.trim());
        } catch (e) {
            console.warn(e);
            shake(amountControls);
            return;
        }

        // Navigate to next step
        stack.push(<TransferConfirm
            wallet={props.wallet}
            from={props.from}
            name={props.name}
            to={address}
            amount={amountValue}
            payload={commentText ? {
                kind: 'text',
                text: commentText,
            } : null}
        />);
    }, [to, comment, amount, props.wallet, props.from]);
    return (
        <View style={{ height: 400, width: 400, alignItems: 'flex-start', justifyContent: 'center' }}>
            <View style={{ width: 400, gap: 16, marginBottom: 32 }}>
                <Section>
                    <Title title={props.name} />
                    <AddressComponent address={props.from} maxLength={40} />
                </Section>
                <Section>
                    <Title title="Send to" />
                    <motion.div animate={sendToControls}>
                        <TextInput style={{ width: 300 }} placeholder="Destination address" value={to} onChangeText={setTo} />
                    </motion.div>
                </Section>
                <Section>
                    <Title title="Amount" />
                    <motion.div animate={amountControls}>
                        <TextInput style={{ width: 300 }} placeholder="amount in TONs" value={amount} onChangeText={setAmount} />
                    </motion.div>
                </Section>
                <Section>
                    <Title title="Comment" />
                    <motion.div animate={commentControls}>
                        <TextInput
                            style={{ width: 300 }}
                            placeholder="(optional)"
                            value={comment}
                            onChangeText={setComment}
                        />
                    </motion.div>
                </Section>
            </View>
            <Button title="Continue" onClick={doNext} />
        </View>
    )
});

export const TransferModal = React.memo((props: { from: Address, name: string, wallet: WalletConfig }) => {
    return (
        <Modal title="Transfer">
            <View style={{ height: 400, width: 400, overflow: 'hidden' }}>
                <Stack initial={<TransferModalInit from={props.from} name={props.name} wallet={props.wallet} />} />
            </View>
        </Modal>
    );
});