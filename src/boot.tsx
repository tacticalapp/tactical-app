import * as React from 'react';
import { View } from 'react-native';
import { Root } from './ui/Root';
import { Logo } from './assets/logo';
import { Auth } from './auth/Auth';
import { Unlock } from './auth/Unlock';
import { deriveStorage } from './crypto/deriveStorage';
import { Storage } from './storage/Storage';
import { delay } from './utils/time';
import { App } from './storage/App';
import { AppDraggable } from './ui/components/AppDraggable';

const SplashScreen = () => (
    <>
        <View style={{ flexGrow: 1, flexBasis: 0, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center' }}>
            <Logo width={145} height={38} />
        </View>
        <AppDraggable />
    </>
);

export const Boot = React.memo(() => {

    let [state, setState] = React.useState<{ mode: 'loading' } | { mode: 'auth' } | { mode: 'unlock' } | { mode: 'app', app: App }>({ mode: 'loading' });
    let onReady = React.useCallback((app: App) => { setState({ mode: 'app', app }); }, []);
    let onReset = React.useCallback(() => { setState({ mode: 'auth' }); }, []);
    React.useEffect(() => {
        return () => {
            if (state.mode === 'app') {
                state.app.destroy();
            }
        };
    }, [state]);

    // Loading
    React.useEffect(() => {
        let exited = false;
        (async () => {

            // TODO: Load all required fonts
            await delay(1000);

            // Check if storage exist
            let storageExist = await Storage.exist();

            // Set storage

            if (!storageExist) {
                if (!exited) {
                    setState({ mode: 'auth' });
                }
            } else {
                if (import.meta.env.DEV) {
                    let pass = localStorage.getItem('__dev__password__');
                    if (pass) {
                        let loaded = await Storage.load(await deriveStorage(pass));
                        if (loaded) {
                            if (!exited) {
                                let app = await App.create(loaded);
                                if (!exited) {
                                    setState({ mode: 'app', app: app });
                                }
                            }
                            return;
                        }
                    }
                }

                if (!exited) {
                    setState({ mode: 'unlock' });
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
        content = <Unlock onReady={onReady} onReset={onReset} />;
    } else if (state.mode === 'app') {
        content = <Root app={state.app} onReset={onReset} />;
    } else {
        content = <SplashScreen />;
    }
    return (
        <>
            <View style={{ width: '100vw', height: '100vh', backgroundColor: '#111111', flexDirection: 'column' }}>
                {content}
            </View>
        </>
    )
});