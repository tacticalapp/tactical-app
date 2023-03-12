import * as React from 'react';
import { View } from 'react-native';
import { Header } from '../../components/Header';

export const Wallets = React.memo(() => {
    return (
        <>
            <Header title="Wallets" />
            <View style={{ width: 100, height: 100, backgroundColor: 'red' }}>

            </View>
        </>
    );
});