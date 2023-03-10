import * as React from 'react';
import { TextInput, View } from 'react-native';
import { TacticalClient } from '../../api/TacticalClient';
import { Button } from '../../components/Button';
import { useCommand } from '../../components/useCommand';
import { solveHashChallenge } from '../../utils/solveHashChallenge';

export function Signup() {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    let command = React.useCallback(async () => {
        let client = new TacticalClient('https://tactical-server.herokuapp.com');

        // Solving challenge
        console.warn('solving challenge...');
        let challenge = await client.requestChallenge();
        if (challenge.kind !== 'hash') {
            console.warn('challenge is not a hash');
            return;
        }
        
        // Calculation
        let solved = await solveHashChallenge(challenge.params);
        
        console.warn(solved);
        console.warn(username, password);
    }, [username, password]);
    let [executing, execute] = useCommand(command);

    return (
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
                    marginBottom: 16
                }}
                secureTextEntry={true}
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                editable={!executing}
            />
            <Button title="Create" onClick={execute} />
        </View>
    );
}