import * as React from 'react';
import { View } from 'react-native';
import { Route, Routes } from 'react-router-dom';
import { AppDraggable } from './components/AppDraggable';
import { Text } from './components/Themed';
import { Dev } from './fragments/dev/Dev';
import { NotFound } from './fragments/NotFound';
import { Settings } from './fragments/settings/Settings';
import { AddressFragment } from './fragments/explorer/AddressFragment';
import { Wallets } from './fragments/wallets/Wallets';
import { Sidebar } from './fragments/Sidebar';
import { SearchFragment } from './fragments/explorer/SearchFragment';

const HomePlacehodler = React.memo(() => {
    return (
        <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ opacity: 0.3, fontSize: 16 }}>Pick app to start working</Text>
        </View>
    );
});

export const Home = React.memo(() => {
    return (
        <View style={{ flexGrow: 1, flexDirection: 'row', alignItems: 'stretch' }}>
            <Sidebar />
            <View style={{ width: 1, alignSelf: 'stretch', backgroundColor: 'var(--theme-div)' }} />
            <View style={{ flexGrow: 1, flexBasis: 0, flexDirection: 'column', alignItems: 'stretch', backgroundColor: 'var(--theme-bg)' }}>
                <Routes>
                    <Route path="/" element={<HomePlacehodler />} />
                    <Route path="/wallets" element={<Wallets />} />
                    <Route path="/explorer/:address" element={<AddressFragment />} />
                    <Route path="/explorer" element={<SearchFragment />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/dev" element={<Dev />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </View>
            <AppDraggable />
        </View>
    );
});