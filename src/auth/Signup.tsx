import { useAnimationControls } from 'framer-motion';
import * as React from 'react';
import { Alert, TextInput, View } from 'react-native';
import { motion } from 'framer-motion';
import { client } from '../api/client';
import { Button } from '../components/Button';
import { Text } from '../components/Themed';
import { useCommand } from '../components/useCommand';
import { decryptForKey } from '../crypto/decryptForKey';
import { derive } from '../crypto/derive';
import { generateSecretKey } from '../crypto/generateSecretKey';
import { normalizePassword } from '../crypto/primitives/normalizePassword';
import { publicKeyFromSecret } from '../crypto/publicKeyFromSecret';
import { signPackage } from '../crypto/signPackage';
import { checkUsername } from '../utils/checkUsername';
import { solveHashChallenge } from '../utils/solveHashChallenge';
import { shake } from '../utils/shake';
import { backoff } from '../utils/time';
import { encryptForKey } from '../crypto/encryptForKey';
import { randomBytes } from '../crypto/randomBytes';
import { deriveStorage } from '../crypto/deriveStorage';
import { Storage } from '../storage/Storage';

export const Signup = React.memo((props: { onCancel: () => void }) => {

    const secretKey = React.useMemo(() => generateSecretKey(), []);
    const usernameControls = useAnimationControls();
    const [username, setUsername] = React.useState('');
    const passwordControls = useAnimationControls();
    const [password, setPassword] = React.useState('');
    const password2Controls = useAnimationControls();
    const [password2, setPassword2] = React.useState('');
    const [error, setError] = React.useState<{ kind: 'username' | 'password', message: string } | null>(null);

    let command = React.useCallback(async () => {

        //
        // Clearing error
        //

        setError(null);

        //
        // Client checks
        //

        if (!checkUsername(username)) {
            shake(usernameControls);
            setError({ kind: 'username', message: 'Invalid username' });
            return;
        }

        if (normalizePassword(password).length < 8) {
            shake(passwordControls);
            setError({ kind: 'password', message: 'Password must be at least 8 characters' });
            return;
        }

        if (password !== password2) {
            shake(password2Controls);
            setError({ kind: 'password', message: 'Passwords do not match' });
            return;
        }

        //
        // Check username availability and validity
        //

        let usernameStatus = await backoff(async () => {
            return await client.checkUsername(username);
        });
        // NOTE: We are ignoring available flag since it is 
        //       implicitly checked by the signup request later
        if (!usernameStatus.valid) {
            shake(usernameControls);
            setError({ kind: 'username', message: 'Invalid username' });
            return;
        }

        //
        // Derive Keys
        //

        let authSecret = await derive({ username, password, secretKey, usage: 'auth' });
        let authPublic = await publicKeyFromSecret(authSecret);
        let encryptSecret = await derive({ username, password, secretKey, usage: 'encryption' });
        let encryptPublic = await publicKeyFromSecret(encryptSecret);
        let storageSecret = await deriveStorage(password);

        //
        // Create account secret
        //

        let accountSecret = Buffer.concat([Buffer.from([0]), randomBytes(32)]); // Concat 0 to mark secret version
        let packageData = await encryptForKey(encryptPublic, accountSecret);
        let packageSignature = await signPackage(packageData, authSecret);

        //
        // Solving challenge
        //

        let signupData = await backoff(async () => {

            //
            // Solve challenge
            //

            const challenge = await backoff(async () => {
                let pendingChallenge = await client.requestChallenge();
                if (pendingChallenge.kind !== 'hash') {
                    return null;
                }
                let solution = await solveHashChallenge(pendingChallenge.params);
                await client.solve(pendingChallenge.id, solution);
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
            // Perform signup
            //

            let res = await client.signup(authPublic, packageData, packageSignature, username, challenge.id, signedChallenge);
            if (!res.ok) {
                if (res.error === 'invalid_challenge') {
                    throw Error('Invalid challenge'); // Try again
                } else if (res.error === 'account_already_exists') {
                    shake(usernameControls);
                    setError({ kind: 'username', message: 'This username already used' });
                    return null;
                } else {
                    throw Error('Unknown error');
                }
            }

            //
            // Decrypt and verify response
            //

            let token = (await decryptForKey(authSecret, Buffer.from(res.response.token, 'base64'))).toString();
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
        if (!signupData) {
            return;
        }

        //
        // Create a storage
        //

        console.warn('token:' + signupData.token);
        console.warn('secret:' + signupData.accountSecret.toString('base64'));
        let storage = await Storage.create(accountSecret);

    }, [username, password, password2]);
    let [executing, execute] = useCommand(command);

    return (
        <View style={{ flexGrow: 1, width: 336, justifyContent: 'center', alignItems: 'stretch' }}>
            <Text style={{ fontSize: 18, opacity: 0.8, fontWeight: '400', marginTop: 16, textAlign: 'center', marginBottom: 16 }}>
                Create a new account in Tactical
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 4, textAlign: 'center' }}>
                ⚡️ Username
            </Text>
            <Text style={{ fontSize: 14, opacity: 0.8, marginBottom: 16, textAlign: 'center' }}>
                Used to find you and <Text style={{ fontWeight: '800' }}>can't</Text> be changed.
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
                        marginBottom: 8,
                        flexShrink: 0
                    }}
                    keyboardType="email-address"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    placeholder="@username"
                    value={username}
                    onChangeText={setUsername}
                    editable={!executing}
                />
            </motion.div>
            <Text style={{ height: 18, fontSize: 14, color: 'rgb(240, 178, 83)' }}>
                {(error && error.kind === 'username') ? ('⚠️ ' + error.message) : ''}
            </Text>
            <View style={{ height: 8 }} />

            <Text style={{ fontSize: 18, marginBottom: 4, marginTop: 8, textAlign: 'center' }}>
                ✍️ Password<br />
            </Text>
            <Text style={{ fontSize: 14, opacity: 0.8, marginBottom: 16, textAlign: 'center' }}>
                This password <Text style={{ fontWeight: '800' }}>can't</Text> be recovered or reset.
            </Text>
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
            <motion.div animate={password2Controls}>
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
                    secureTextEntry={true}
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    placeholder="Re-type Password"
                    value={password2}
                    onChangeText={setPassword2}
                    editable={!executing}
                />
            </motion.div>
            <Text style={{ height: 18, fontSize: 14, color: 'rgb(240, 178, 83)' }}>
                {(error && error.kind === 'password') ? ('⚠️ ' + error.message) : ''}
            </Text>
            <View style={{ height: 24 }} />
            <Button title="Create" onClick={execute} />
            <View style={{ height: 8 }} />
            <Button title="Back" kind="ghost" onClick={props.onCancel} />
        </View>
    );
});