import * as React from 'react';
import { TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Logo } from '../assets/logo';
import { plafrorm } from '../utils/platform';
import { AppDraggable } from './components/AppDraggable';
import { Text } from './components/Themed';
import { Dev } from './fragments/dev/Dev';
import { NotFound } from './fragments/NotFound';
import { Settings } from './fragments/settings/Settings';
import { Wallets } from './fragments/wallets/Wallets';

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
        <TouchableHighlight
            style={{
                height: 48,
                backgroundColor: '#1C1C1C',
                borderRadius: 10,
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingHorizontal: 16,
                marginVertical: 4
            }}
            onPress={() => navigate(props.path)}
        >
            <Text style={{ fontSize: 18 }}>{props.title}</Text>
        </TouchableHighlight>
    )
});

export const Home = React.memo(() => {
    return (
        <View style={{ flexGrow: 1, flexDirection: 'row', alignItems: 'stretch' }}>
            <View style={{ width: 240, flexDirection: 'column', alignItems: 'stretch', paddingHorizontal: 16, backgroundColor: plafrorm === 'macos' ? 'transparent' : '#000' }}>
                {plafrorm !== 'web' && (
                    <View style={{ height: 48 }} />
                )}
                {plafrorm === 'web' && (
                    <View style={{ height: 72, alignItems: 'flex-start', paddingLeft: 8, paddingTop: 8, justifyContent: 'center' }}>
                        <Logo width={145} height={38} />
                    </View>
                )}
                <NavigationItem title="Wallets" path="/wallets" />
                <NavigationItem title="Settings" path="/settings" />
                <NavigationItem title="Development" path="/dev" />
            </View>
            <View style={{ flexGrow: 1, flexBasis: 0, flexDirection: 'column', alignItems: 'stretch', backgroundColor: 'var(--theme-bg)' }}>
                <Routes>
                    <Route path="/" element={<HomePlacehodler />} />
                    <Route path="/wallets" element={<Wallets />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/dev" element={<Dev />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </View>
            <AppDraggable />
        </View>
    );
});