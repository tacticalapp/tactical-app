import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Text } from '../components/Themed';
import { NotFound } from './NotFound';
import { Settings } from './settings/Settings';
import { Wallets } from './wallets/Wallets';

const HomePlacehodler = React.memo(() => {
    return (
        <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ opacity: 0.3, fontSize: 16 }}>Pick app to start working</Text>
        </View>
    );
});

const NavigationItem = React.memo((props: { title: string, path: string }) => {
    const navigate = useNavigate();
    return (
        <TouchableOpacity style={{
            height: 50,
            backgroundColor: '#1C1C1C',
            borderRadius: 10,
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingHorizontal: 16,
            marginVertical: 8
        }} onPress={() => navigate(props.path)}>
            <Text style={{ fontSize: 18 }}>{props.title}</Text>
        </TouchableOpacity>
    )
});

export const Home = React.memo(() => {
    return (
        <View style={{ flexGrow: 1, flexDirection: 'row', alignItems: 'stretch' }}>
            <View style={{ width: 240, backgroundColor: '#000', flexDirection: 'column', alignItems: 'stretch', paddingHorizontal: 16, paddingTop: 48 }}>
                <NavigationItem title="Wallets" path="/wallets" />
                <NavigationItem title="Settings" path="/settings" />
            </View>
            <View style={{ flexGrow: 1, flexBasis: 0, flexDirection: 'column', alignItems: 'stretch' }}>
                <Routes>
                    <Route path="/" element={<HomePlacehodler />} />
                    <Route path="/wallets" element={<Wallets />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </View>
        </View>
    );
});