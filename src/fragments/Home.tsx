import * as React from 'react';
import { Text, View } from 'react-native';

export const Home = React.memo(() => {
    return (
        <View style={{ flexGrow: 1, flexDirection: 'column', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white' }}>Hello</Text>
        </View>
    );
});