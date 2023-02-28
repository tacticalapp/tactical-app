import * as React from 'react';
import { Image, TextInput, View } from 'react-native';
import { Text } from '../components/Themed';
import logo from '../assets/logo.svg';
import { motion } from 'framer-motion';
import { css } from '@linaria/core';
import { Button } from '../components/Button';

const container = css`
    display: flex;
    flex-grow: 1;
    flex-basis: 0;
    flex-direction: column;
    align-self: stretch;
    align-items: center;
    justify-content: center;
`;

export const Home = React.memo(() => {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [mode, setMode] = React.useState<'init' | 'signup' | 'login'>('init');

    return (
        <motion.div
            className={container}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01]
            }}
        >
            <View style={{ width: 336, alignItems: 'center' }}>
                <Image source={{ uri: logo }} style={{ width: 84, height: 84 }} />
                <Text style={{ fontSize: 24, opacity: 0.8, fontWeight: '500', marginTop: 32 }}>Log in to Tactical</Text>
                {mode === 'init' && (
                    <View style={{ height: 240, width: 336, justifyContent: 'center', alignItems: 'stretch', gap: 16 }}>
                        <Button title="Log In" onClick={() => setMode('login')} />
                        <Button title="Create account" onClick={() => setMode('signup')} />
                    </View>
                )}
                {mode === 'login' && (
                    <View style={{ height: 240, width: 336, justifyContent: 'center', alignItems: 'stretch' }}>
                        <TextInput
                            style={{
                                width: 336,
                                height: 46,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderColor: 'rgba(255, 255, 255, 0.6)',
                                borderRadius: 4,
                                marginBottom: 16
                            }}
                            keyboardType="email-address"
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            placeholder="@username"
                            value={username}
                            onChangeText={setUsername}
                        />
                        <Button title="Next" onClick={() => setMode('login')} />
                    </View>
                )}
                {mode === 'signup' && (
                    <View style={{ height: 240, width: 336, justifyContent: 'center', alignItems: 'stretch' }}>
                        <TextInput
                            style={{
                                width: 336,
                                height: 46,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderColor: 'rgba(255, 255, 255, 0.6)',
                                borderRadius: 4,
                                marginBottom: 16
                            }}
                            keyboardType="email-address"
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            placeholder="@username"
                            value={username}
                            onChangeText={setUsername}
                        />
                        <TextInput
                            style={{
                                width: 336,
                                height: 46,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderColor: 'rgba(255, 255, 255, 0.6)',
                                borderRadius: 4,
                                marginBottom: 16
                            }}
                            secureTextEntry={true}
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                        />
                        <Button title="Next" onClick={() => setMode('login')} />
                    </View>
                )}
            </View>
        </motion.div>
    );
});