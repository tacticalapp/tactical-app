import * as React from 'react';
import { View } from 'react-native';
import { motion } from 'framer-motion';
import { css } from '@linaria/core';
import { Storage } from '../storage/Storage';
import { Logo } from '../assets/logo';
import { Text } from '../components/Themed';
import { Button } from '../components/Button';
import { Login } from './Login';
import { Signup } from './Signup';
import { Stack, useStack } from '../components/Stack';

const StartPage = React.memo((props: { onReady: (storage: Storage) => void }) => {

    const stack = useStack();
    const onLogin = React.useCallback(() => {
        stack.push(<Login />)
    }, []);
    const onSignup = React.useCallback(() => {
        stack.push(<Signup onCancel={() => stack.pop()} onReady={props.onReady} />)
    }, []);

    return (
        <View style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flexDirection: 'column', height: 300, width: 336 }}>
                <motion.div
                    className={container}
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 2,
                        delay: 0.01,
                        ease: 'anticipate'
                    }}
                >
                    <Text style={{ fontSize: 18, opacity: 0.8, fontWeight: '400', marginTop: 16 }}>Professional tools for TON</Text>
                    <View style={{ flexGrow: 1, width: 336, justifyContent: 'center', alignItems: 'stretch', gap: 16 }}>
                        <Button title="Create account" onClick={onSignup} />
                        <Button title="Log In" onClick={onLogin} />
                        <Text style={{ fontSize: 14, opacity: 0.8, fontWeight: '400', textAlign: 'center' }}>🔐 We do not have an access <br /> to data in your Tactical account</Text>
                    </View>
                </motion.div>

                <motion.div
                    className={logoContainer}
                    initial={{ transform: `translateY(${(300 - 38) / 2}px)` }}
                    animate={{ transform: `translateY(0px)` }}
                    transition={{
                        duration: 1,
                        delay: 0,
                        ease: [0.4, 0.0, 0.2, 1]
                    }}
                >
                    <Logo width={145} height={38} />
                </motion.div>
            </View>
        </View>
    );
});

export const Auth = React.memo((props: { onReady: (storage: Storage) => void }) => {
    return (
        <View style={{ flexGrow: 1, justifyContent: 'center', flexDirection: 'column' }}>
            <View style={{ width: 336, height: 580, alignSelf: 'center', alignItems: 'center' }}>
                <Stack initial={<StartPage onReady={props.onReady} />} />
            </View>
        </View>
    );
});

const logoContainer = css`
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    align-items: center;
    justify-content: center;
`;

const container = css`
    display: flex;
    padding-top: 34px;
    height: 300px;
    align-self: center;
    flex-direction: column;
    align-items: center;
`;