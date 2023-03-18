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
import { css } from '@linaria/core';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { isMainnet } from './utils/chain';

const SplashScreen = () => (
    <>
        <View style={{ flexGrow: 1, flexBasis: 0, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--theme-bg)' }}>
            <Logo width={145} height={38} />
        </View>
        <AppDraggable />
    </>
);

const root = css`
    display: flex;
    width: 100vw;
    height: 100vh;
    flex-direction: column;
`;

const testnetBorder = css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-width: 4px;
    border-color: #ba601f;
    border-style: solid;
    border-radius: 10px;
    pointer-events: none;
    z-index: 1000;
    opacity: 0.9;
`;

const page = css`
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    background-color: var(--theme-bg);
    z-index: 10;
    /* background-color: red; */
`;

const appPage = css`
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    /* background-color: red; */
`;

async function loadFont(name: string, path: string) {
    console.log('loading font ' + path);
    var font = new FontFace(name, `url(${path})`);
    await font.load();
    console.log('font loaded');
}

async function loadFonts() {
    await loadFont('MartianMono', '/fonts/MartianMono-Bold.ttf');
    await loadFont('MartianMono', '/fonts/MartianMono-ExtraBold.ttf');
    await loadFont('MartianMono', '/fonts/MartianMono-ExtraLight.ttf');
    await loadFont('MartianMono', '/fonts/MartianMono-Light.ttf');
    await loadFont('MartianMono', '/fonts/MartianMono-Medium.ttf');
    await loadFont('MartianMono', '/fonts/MartianMono-Regular.ttf');
    await loadFont('MartianMono', '/fonts/MartianMono-SemiBold.ttf');
    await loadFont('MartianMono', '/fonts/MartianMono-Thin.ttf');
}

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

            // Load all requirements for the app
            let [_1, _2, storageExist] = await Promise.all([
                delay(1000),
                loadFonts(),
                Storage.exist()
            ]);;


            // Execute
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
        content = (<Auth onReady={onReady} />);
    } else if (state.mode === 'unlock') {
        content = (<Unlock onReady={onReady} onReset={onReset} />);
    } else if (state.mode === 'app') {
        content = (<Root app={state.app} onReset={onReset} />);
    } else {
        content = (<SplashScreen />);
    }
    return (
        <>
            <div className={root}>
                <AnimatePresence initial={false}>
                    {state.mode === 'app'
                        ? (
                            <div
                                key="app"
                                className={appPage}>
                                {content}
                            </div>
                        )
                        : (
                            <motion.div
                                key="boot"
                                className={page}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] } }}
                            >
                                {content}
                            </motion.div>
                        )}
                </AnimatePresence>
                {!isMainnet && (<div className={testnetBorder} />)}
            </div>
        </>
    )
});