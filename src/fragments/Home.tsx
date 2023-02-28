import * as React from 'react';
import { View } from 'react-native';
import { Text } from '../components/Themed';

export const Home = React.memo(() => {
    return (
        <View style={{ flexGrow: 1, flexDirection: 'column', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 32, color: 'white' }}>Hello</Text>
        </View>
    );
});