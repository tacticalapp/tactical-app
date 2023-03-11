import * as React from 'react';
import { TextInput, View } from 'react-native';
import { Button } from '../components/Button';

export const Login = React.memo(() => {
    const [username, setUsername] = React.useState('');
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
            />
            <Button title="Next" onClick={() => { }} />
        </View>
    )
});