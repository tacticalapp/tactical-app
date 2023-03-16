import * as React from 'react';
import { View } from 'react-native';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../../assets/logo';
import { SidebarButton } from '../components/SidebarButton';
import iconWallets from '../../assets/sidebar_wallets.svg';
import iconSettings from '../../assets/sidebar_settings.svg';
import iconDev from '../../assets/sidebar_dev.svg';

const NavigationItem = React.memo((props: { icon: string, title: string, path: string }) => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <SidebarButton
            icon={props.icon}
            title={props.title}
            active={location.pathname.startsWith(props.path)}
            onClick={() => navigate(props.path)}
        />
    )
});

const Items = React.memo(() => {
    return (
        <View style={{ gap: 4, flexGrow: 1 }}>
            <NavigationItem icon={iconWallets} title="Wallets" path="/wallets" />
            <NavigationItem icon={iconSettings} title="Settings" path="/settings" />
            <NavigationItem icon={iconDev} title="Development" path="/dev" />
        </View>
    );
});

export const Sidebar = React.memo(() => {
    return (
        <View style={{ width: 240, flexDirection: 'column', alignItems: 'stretch', paddingHorizontal: 16, backgroundColor: '#000' }}>
            <View style={{ height: 48 }} />
            <Items />
            <View style={{ height: 72, alignItems: 'flex-start', justifyContent: 'center', opacity: 0.5 }}>
                <Logo width={145} height={38} />
            </View>
        </View>
    );
});