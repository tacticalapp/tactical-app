import * as React from 'react';
import { Image, View } from 'react-native';
import { Text } from '../components/Themed';
import logo from '../assets/logo.svg';

export const Home = React.memo(() => {
    return (
        <View style={{ flexGrow: 1, flexDirection: 'column', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={{ uri: logo }} style={{ width: 84, height: 84, marginBottom: 32 }} />
            <Text style={{ fontSize: 24, opacity: 0.8, fontWeight: '500' }}>Log in to Tactical</Text>
        </View>
    );
});