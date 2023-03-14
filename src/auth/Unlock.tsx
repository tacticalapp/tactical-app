import * as React from 'react';
import { TextInput, View } from 'react-native';
import { Storage } from '../storage/Storage';
import { motion, useAnimationControls } from 'framer-motion';
import { css } from '@linaria/core';
import { Logo } from '../assets/logo';
import { Text } from '../ui/components/Themed';
import { Button } from '../ui/components/Button';
import { useCommand } from '../ui/components/useCommand';
import { deriveStorage } from '../crypto/deriveStorage';
import { shake } from '../utils/shake';
import { minDelay } from '../utils/time';
import { normalizePassword } from '../crypto/normalizePassword';
import { App } from '../storage/App';

export const Unlock = React.memo((props: { onReady: (app: App) => void, onReset: () => void }) => {

    const passwordControls = useAnimationControls();
    const [password, setPassword] = React.useState('');
    const doReset = React.useCallback(async () => {
        await Storage.reset();
        props.onReset();
    }, [props.onReset]);
    const [resetting, resetCommand] = useCommand(doReset);
    const doUnlock = React.useCallback(async () => {

        //
        // Normalize
        //

        let normalizedPasssword = normalizePassword(password);
        if (normalizedPasssword.length < 8) {
            shake(passwordControls);
            return;
        }

        //
        // Unlock
        //

        let storage = await minDelay(500, async () => {
            let derived = await deriveStorage(normalizedPasssword);
            return await Storage.load(derived);
        });
        if (!storage) {
            shake(passwordControls);
            return;
        }

        //
        // Simplify development
        //

        if (import.meta.env.DEV) {
            localStorage.setItem('__dev__password__', normalizedPasssword);
        }

        //
        // Done
        //

        props.onReady(await App.create(storage));

    }, [props.onReady, password]);
    const [unlocking, unlockCommand] = useCommand(doUnlock);

    return (
        <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <View style={{ width: 336, height: 300, alignSelf: 'center', alignItems: 'center' }}>
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
                    <Text style={{ fontSize: 18, opacity: 0.8, fontWeight: '400', marginTop: 16 }}>Please, unlock your account</Text>
                    <View style={{ flexGrow: 1, width: 336, justifyContent: 'center', alignItems: 'stretch', gap: 16 }}>
                        <motion.div animate={passwordControls}>
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
                                    marginBottom: 8,
                                    flexShrink: 0
                                }}
                                placeholder="Password"
                                keyboardType="email-address"
                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                secureTextEntry={true}
                                value={password}
                                onChangeText={setPassword}
                                onSubmitEditing={unlockCommand}
                                autoFocus={true}
                                blurOnSubmit={false}
                            />
                        </motion.div>
                        <Button title="Unlock" loading={unlocking} onClick={unlockCommand} />
                        <Button kind="ghost" title="Log out" onClick={resetCommand} />
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
    )
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