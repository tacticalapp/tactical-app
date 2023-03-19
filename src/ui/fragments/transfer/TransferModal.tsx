import * as React from 'react';
import { View } from 'react-native';
import { useAnimationControls, motion } from 'framer-motion';
import { Address, fromNano, toNano } from 'ton-core';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Section } from '../../components/Section';
import { Stack, useStack } from '../../components/Stack';
import { TextInput } from '../../components/TextInput';
import { Title } from '../../components/Title';
import { shake } from '../../../utils/shake';
import { TransferConfirm } from './TransferConfirm';
import { Maybe } from '../../../utils/type';
import { isMainnet } from '../../../utils/chain';
import { useApp } from '../../../storage/App';

const TransferModalInit = React.memo((props: {
    from: Address | null,
    to: Address | null,
    amount?: bigint | null,
    comment?: string | null,
}) => {
    const app = useApp();
    const stack = useStack();
    const wallets = app.wallets.use();
    const [from, setFrom] = React.useState(props.from ? props.from.toString({ testOnly: !isMainnet }) : null);
    const [to, setTo] = React.useState(props.to ? props.to.toString({ testOnly: !isMainnet }) : '');
    const [comment, setComment] = React.useState(props.comment ? props.comment : '');
    const [amount, setAmount] = React.useState(props.amount ? fromNano(props.amount) : '');
    const sendFromControls = useAnimationControls();
    const sendToControls = useAnimationControls();
    const commentControls = useAnimationControls();
    const amountControls = useAnimationControls();
    const doNext = React.useCallback(() => {

        // Load from address
        if (!from) {
            shake(sendFromControls);
            return;
        }
        let fromAddress: Address;
        try {
            fromAddress = Address.parse(from);
        } catch (e) {
            shake(sendFromControls);
            return;
        }

        // Load wallet
        let wallet = app.wallets.get(fromAddress);
        if (!wallet) {
            shake(sendFromControls);
            setFrom(null);
            return;
        }

        // Load address
        let toAddress: Address;
        try {
            toAddress = Address.parse(to);
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
            name={wallet.name}
            wallet={wallet.config}
            from={fromAddress}
            to={toAddress}
            amount={amountValue}
            payload={commentText ? {
                kind: 'text',
                text: commentText,
            } : null}
        />);
    }, [from, to, comment, amount]);

    const walletOptions = React.useMemo(() => {
        return Object.keys(wallets).map((address) => ({
            label: wallets[address].name,
            value: address,
        }));
    }, [wallets]);

    return (
        <View style={{ height: 400, width: 400, alignItems: 'flex-start', justifyContent: 'center' }}>
            <View style={{ width: 400, gap: 16, marginBottom: 32 }}>
                <Section>
                    <Title title="Send From" />
                    <motion.div animate={sendFromControls}>
                        <Select
                            value={from}
                            onChange={setFrom}
                            options={walletOptions}
                        />
                    </motion.div>
                </Section>
                <Section>
                    <Title title="Send to" />
                    <motion.div animate={sendToControls}>
                        <TextInput style={{ width: 300 }} placeholder="Destination address" value={to} onChangeText={setTo} editable={!props.to} />
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

export const TransferModal = React.memo((props: { from?: Maybe<Address>, to?: Maybe<Address>, amount?: Maybe<bigint>, comment?: Maybe<string> }) => {
    return (
        <Modal title="Transfer">
            <View style={{ height: 400, width: 400, overflow: 'hidden' }}>
                <Stack initial={<TransferModalInit
                    from={props.from ? props.from : null}
                    to={props.to ? props.to : null}
                    amount={props.amount ? props.amount : null}
                    comment={props.comment ? props.comment : null}
                />} />
            </View>
        </Modal>
    );
});