import * as React from 'react';
import { View } from 'react-native';
import { Header } from '../../components/Header';

export const Settings = React.memo(() => {
    return (
        <>
            <Header title="Settings" />
            <View style={{ width: 100, height: 100, backgroundColor: 'blue' }}>

            </View>
        </>
    );
});