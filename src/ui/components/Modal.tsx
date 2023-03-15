import * as React from 'react';
import { View } from 'react-native';
import { randomBytes } from '../../crypto/randomBytes';

type ModalContextType = { close: () => void, show: (c: React.ReactNode) => void };

const ModalContext = React.createContext<ModalContextType | null>(null);

export function useModal() {
    const context = React.useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}

export const ModalProvider = React.memo((props: { children: React.ReactNode }) => {
    const [modals, setModals] = React.useState<{ key: string, node: React.ReactNode }[]>([]);
    const close = React.useCallback(() => {
        setModals((a) => a.slice(0, -1));
    }, []);
    const show = React.useCallback((node: React.ReactNode) => {
        setModals((a) => [...a, { key: randomBytes(16).toString('hex'), node }]);
    }, []);
    const ctx = React.useMemo(() => ({ close, show }), [close, show]);
    return (
        <ModalContext.Provider value={ctx}>
            <>
                {props.children}
                {modals.map((v, k) => <React.Fragment key={k}>{v.node}</React.Fragment>)}
            </>
        </ModalContext.Provider>
    )
});

//
// UI
//

export const Modal = React.memo((props: { children: React.ReactNode }) => {
    return (
        <View
            style={{
                position: 'absolute',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'var(--theme-modal-bg)',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 8 }}>
                {props.children}
            </View>
        </View>
    );
});