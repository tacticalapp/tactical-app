import * as React from 'react';
import { View } from 'react-native';
import { App } from './ui/App';
import { Logo } from './assets/logo';
import { Auth } from './auth/Auth';
import { Unlock } from './auth/Unlock';
import { deriveStorage } from './crypto/deriveStorage';
import { Storage } from './storage/Storage';
import { delay } from './utils/time';
import { css } from '@linaria/core';

const SplashScreen = () => (
    <View style={{ flexGrow: 1, flexBasis: 0, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center' }}>
        <Logo width={145} height={38} />
    </View>
);

const draggableStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    -webkit-app-region: drag;
    width: 100vw;
    height: 50px;
    z-index: 1000;
`;

const DraggableHeader = () => {
    return <div className={draggableStyle} />
};

export const Boot = React.memo(() => {

    let [state, setState] = React.useState<{ mode: 'loading' } | { mode: 'auth' } | { mode: 'unlock' } | { mode: 'app', storage: Storage }>({ mode: 'loading' });
    let onReady = React.useCallback((storage: Storage) => { setState({ mode: 'app', storage }); }, []);
    let onReset = React.useCallback(() => { setState({ mode: 'auth' }); }, []);

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
                                setState({ mode: 'app', storage: loaded });
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
        content = <App storage={state.storage} onReset={onReset} />;
    } else {
        content = <SplashScreen />;
    }
    return (
        <>
            <View style={{ width: '100vw', height: '100vh', backgroundColor: '#111111', flexDirection: 'column' }}>
                {content}
            </View>
            <DraggableHeader />
        </>
    )
});