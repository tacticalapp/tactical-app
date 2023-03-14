import * as React from 'react';
import { TextInput, View } from 'react-native';
import { Button } from '../ui/components/Button';
import { Text } from '../ui/components/Themed';
import Balancer from 'react-wrap-balancer';
import { useCommand } from '../ui/components/useCommand';
import { backoff } from '../utils/time';
import { normalizePassword } from '../crypto/normalizePassword';
import { checkUsername } from '../utils/checkUsername';
import { useAnimationControls } from 'framer-motion';
import { shake } from '../utils/shake';
import { normalizeSecretKey } from '../crypto/normalizeSecretKey';
import { derive } from '../crypto/derive';
import { deriveStorage } from '../crypto/deriveStorage';
import { tacticalClient } from '../api/client';
import { solveHashChallenge } from '../utils/solveHashChallenge';
import { signPackage } from '../crypto/signPackage';
import { decryptForKey } from '../crypto/decryptForKey';
import { motion } from 'framer-motion';
import { Storage } from '../storage/Storage';
import { normalizeUsername } from '../crypto/normalizeUsername';
import { App } from '../storage/App';

export const Login = React.memo((props: { onCancel: () => void, onReady: (app: App) => void }) => {

    const usernameControls = useAnimationControls();
    const [username, setUsername] = React.useState('');
    const passwordControls = useAnimationControls();
    const [password, setPassword] = React.useState('');
    const secretKeyControls = useAnimationControls();
    const [secretKey, setSecretKey] = React.useState('');
    const [error, setError] = React.useState<{ message: string } | null>(null);
    const doRestore = React.useCallback(async () => {
        setError(null);

        //
        // Normalize
        //

        const normalizedPassword = normalizePassword(password);
        const normalizedUsername = normalizeUsername(username);
        const normalizedSecretKey = normalizeSecretKey(secretKey);

        //
        // Client checks
        //

        if (!checkUsername(normalizedUsername)) {
            shake(usernameControls);
            setError({ message: 'Invalid username' });
            return;
        }

        if (normalizedPassword.length < 8) {
            shake(passwordControls);
            setError({ message: 'Password must be at least 8 characters' });
            return;
        }

        if (normalizedSecretKey.length !== 25) {
            shake(secretKeyControls);
            setError({ message: 'Invalid secret key format' });
            return;
        }

        //
        // Derive Keys
        //

        let authSecret = await derive({
            username: normalizedUsername,
            password: normalizedPassword,
            secretKey: normalizedSecretKey,
            usage: 'auth'
        });
        let encryptSecret = await derive({
            username: normalizedUsername,
            password: normalizedPassword,
            secretKey: normalizedSecretKey,
            usage: 'encryption'
        });
        let storageSecret = await deriveStorage(normalizedPassword);

        //
        // Authenticate
        //

        let loginData = await backoff(async () => {

            //
            // Solve challenge
            //

            const challenge = await backoff(async () => {
                let pendingChallenge = await tacticalClient.requestChallenge();
                if (pendingChallenge.kind !== 'hash') {
                    return null;
                }
                let solution = await solveHashChallenge(pendingChallenge.params);
                await tacticalClient.solve(pendingChallenge.id, solution);
                return pendingChallenge;
            });
            if (challenge === null) {
                alert('This version of Tactical is outdated. Please, update Tactical app.');
                return null;
            }

            //
            // Sign challenge
            //

            let signedChallenge = await signPackage(Buffer.from(challenge.id), authSecret);

            //
            // Perform login
            //

            let res = await backoff(() => tacticalClient.login(normalizedUsername, challenge.id, signedChallenge));
            if (!res.ok) {
                if (res.error === 'invalid_challenge') {
                    throw Error('Invalid challenge'); // Try again
                } else if (res.error === 'invalid_account') {
                    shake(usernameControls);
                    setError({ message: 'User with username @' + normalizedUsername + ' not found' });
                    return null;
                } else if (res.error === 'invalid_challenge_signature') {
                    shake(passwordControls);
                    shake(secretKeyControls);
                    setError({ message: 'Invalid secret key or password' });
                    return null;
                } else {
                    throw Error('Unknown error');
                }
            }

            // 
            // Decrypt and verify response
            //

            let token = (await decryptForKey(authSecret, Buffer.from(res.response.token, 'base64'))).toString('base64');
            let pkg = await decryptForKey(encryptSecret, Buffer.from(res.response.package, 'base64'));
            if (pkg[0] !== 0) {
                throw Error('Invalid package version');
            }
            if (pkg.length !== 33) {
                throw Error('Invalid package length');
            }
            let accountSecret = pkg.subarray(1);

            //
            // Result
            //

            return { accountSecret, token };
        });

        if (!loginData) {
            return;
        }

        //
        // Create a storage
        //

        let storage = await Storage.create(storageSecret);
        storage.set('account:username', normalizedUsername);
        storage.set('account:secret-key', normalizedSecretKey);
        storage.set('account:token', loginData.token);
        storage.set('account:secret', loginData.accountSecret.toString('base64'));
        await storage.attach();

        //
        // Simplify development
        //

        if (import.meta.env.DEV) {
            localStorage.setItem('__dev__password__', normalizedPassword);
        }

        //
        // Done
        //

        props.onReady(await App.create(storage));

    }, [username, password, secretKey]);
    const [executing, restoreCommand] = useCommand(doRestore);

    return (
        <View style={{ flexGrow: 1, width: 336, justifyContent: 'center', alignItems: 'stretch' }}>
            <Text style={{ fontSize: 18, marginBottom: 12, textAlign: 'center' }}>
                ⚡️ Restore your account
            </Text>
            <Text style={{ fontSize: 14, opacity: 0.8, marginBottom: 16, textAlign: 'center' }}>
                <Balancer>
                    Use secret key from your <Text style={{ fontWeight: '800' }}>emergency kit</Text>.
                </Balancer>
            </Text>
            <Text style={{ height: 18, marginBottom: 16, fontSize: 14, color: 'rgb(240, 178, 83)', textAlign: 'center' }}>
                {error ? '⚠️ ' + error.message : ''}
            </Text>
            <motion.div animate={usernameControls}>
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
                    editable={!executing}
                />
            </motion.div>
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
                        marginBottom: 16,
                        flexShrink: 0
                    }}
                    secureTextEntry={true}
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    editable={!executing}
                />
            </motion.div>
            <motion.div animate={secretKeyControls}>
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
                        flexShrink: 0
                    }}
                    secureTextEntry={false}
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    placeholder="Secret Key"
                    value={secretKey}
                    onChangeText={setSecretKey}
                    editable={!executing}
                />
            </motion.div>
            <Text style={{ fontSize: 14, opacity: 0.8, marginBottom: 36, marginTop: 36, textAlign: 'center' }}>
                <Balancer>
                    Lost keys? Your funds are <Text style={{ fontWeight: '800' }}>safe</Text>, but you will need to create <Text style={{ fontWeight: '800' }}>a new account</Text>.
                </Balancer>
            </Text>
            <Button title="Restore" loading={executing} onClick={restoreCommand} />
            <View style={{ height: 8 }} />
            <Button title="Back" kind="ghost" onClick={props.onCancel} />
        </View>
    )
});