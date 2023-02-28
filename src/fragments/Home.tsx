import * as React from 'react';
import { Image, TextInput, View } from 'react-native';
import { Text } from '../components/Themed';
import logo from '../assets/logo.svg';
import { motion } from 'framer-motion';
import { css } from '@linaria/core';

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
                <View style={{ marginTop: 32 }}>
                    <TextInput
                        style={{
                            width: 336,
                            height: 46,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'rgba(255, 255, 255, 0.6)',
                            borderRadius: 4
                        }}
                        keyboardType="email-address"
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        placeholder="@username"
                    />
                </View>
            </View>
        </motion.div>
    );
});