import * as React from 'react';
import { TextInput, View } from 'react-native';
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

export const Signup = React.memo((props: { onCancel: () => void }) => {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [password2, setPassword2] = React.useState('');

    let command = React.useCallback(async () => {

        if (!checkUsername(username)) {
            return;
        }

        if (normalizePassword(password).length < 8) {
            return;
        }

        if (password !== password2) {
            return;
        }

        // Solving challenge
        console.warn('solving challenge...');
        let challenge = await client.requestChallenge();
        if (challenge.kind !== 'hash') {
            console.warn('challenge is not a hash');
            return;
        }
        let solution = await solveHashChallenge(challenge.params);
        await client.solve(challenge.id, solution);

        // Creating account
        let secretKey = generateSecretKey();
        let authSecret = await derive({
            username,
            password: 'hello world!',
            secretKey,
            usage: 'auth'
        });
        let authPublic = await publicKeyFromSecret(authSecret);
        let packageData = Buffer.from('sample package');
        let packageSignature = await signPackage(packageData, authSecret);
        let encryptedToken = Buffer.from((await client.signup(authPublic, packageData, packageSignature, username, challenge.id)).token, 'base64');

        // Decrypt token
        let token = (await decryptForKey(authSecret, encryptedToken)).toString();
        console.warn('token:' + token);

    }, [username, password]);
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
                keyboardType="email-address"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                placeholder="@username"
                value={username}
                onChangeText={setUsername}
                editable={!executing}
            />

            <Text style={{ fontSize: 18, marginBottom: 4, marginTop: 16, textAlign: 'center' }}>
                ✍️ Password<br />
            </Text>
            <Text style={{ fontSize: 14, opacity: 0.8, marginBottom: 16, textAlign: 'center' }}>
                This password <Text style={{ fontWeight: '800' }}>can't</Text> be recovered or reset.
            </Text>
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
                    marginBottom: 48,
                    flexShrink: 0
                }}
                secureTextEntry={true}
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                placeholder="Re-type Password"
                value={password2}
                onChangeText={setPassword2}
                editable={!executing}
            />
            <Button title="Create" onClick={execute} />
            <View style={{ height: 8 }} />
            <Button title="Back" kind="ghost" onClick={props.onCancel} />
        </View>
    );
});