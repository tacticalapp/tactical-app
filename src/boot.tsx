import * as React from 'react';
import { View } from 'react-native';
import { App } from './App';
import { Logo } from './assets/logo';
import { Auth } from './auth/Auth';
import { Unlock } from './auth/Unlock';
import { Storage } from './storage/Storage';
import { delay } from './utils/time';

const SplashScreen = () => (
    <View style={{ flexGrow: 1, flexBasis: 0, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center' }}>
        <Logo width={84} height={84} />
    </View>
);

export const Boot = React.memo(() => {

    let [state, setState] = React.useState<{ mode: 'loading' } | { mode: 'auth' } | { mode: 'unlock', storage: Storage } | { mode: 'app', storage: Storage }>({ mode: 'loading' });
    let onReady = React.useCallback((storage: Storage) => { setState({ mode: 'app', storage }); }, []);
    let onReset = React.useCallback(() => { setState({ mode: 'auth' }); }, []);

    // Loading
    React.useEffect(() => {
        let exited = false;
        (async () => {

            await delay(1000);

            // Load storage
            let storage = await Storage.load();

            // Set storage
            if (!exited) {
                if (!storage) {
                    setState({ mode: 'auth' });
                } else {
                    setState({ mode: 'unlock', storage });
                }
            }
        })();
        return () => {
            exited = true;
        }
    }, []);

    // Content
    let content: React.ReactNode = null;
    if (state.mode === 'auth') {
        content = <Auth onReady={onReady} />;
    } else if (state.mode === 'unlock') {
        content = <Unlock storage={state.storage} onReady={onReady} />;
    } else if (state.mode === 'app') {
        content = <App storage={state.storage} onReset={onReset} />;
    } else {
        content = <SplashScreen />;
    }
    return (
        <View style={{ width: '100vw', height: '100vh', backgroundColor: '#111111', flexDirection: 'column' }}>
            {content}
        </View>
    )
});