import * as React from 'react';
import { View } from 'react-native';

export const NotFound = React.memo(() => {
    return (
        <View style={{ flexDirection: 'column', flexGrow: 1, alignSelf: 'center' }}>
            <h1>404 - Not Found!</h1>
        </View>
    );
});