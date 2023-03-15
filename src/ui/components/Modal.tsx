import * as React from 'react';
import { css, cx } from '@linaria/core';
import { AnimatePresence, motion } from 'framer-motion';
import { randomBytes } from '../../crypto/randomBytes';
import { Maybe } from '../../utils/type';
import { View } from 'react-native';
import { Button } from './Button';
import { Text } from './Themed';

type ModalContextType = {
    current: string | null,
    close: (id?: Maybe<string> | Array<string>) => void,
    show: (c: React.ReactNode, parent?: Maybe<string>) => string
};

const ModalContext = React.createContext<ModalContextType | null>(null);

export function useModal() {
    const context = React.useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}

type ModalItem = {
    key: string,
    node: React.ReactNode,
    parent: string | null
}

function removeModalById(src: ModalItem[], key: string): ModalItem[] {

    // Remove item
    let res: ModalItem[] = [];
    let child: string[] = [];
    for (let i = 0; i < src.length; i++) {
        if (src[i].key !== key) {
            res.push(src[i]);
        } else {
            if (src[i].parent === key) {
                child.push(src[i].key);
            }
        }
    }

    // Remove child
    for (let ch of child) {
        res = removeModalById(res, ch);
    }

    return res;
}

function removeModals(src: ModalItem[], id?: Maybe<string> | Array<string>): ModalItem[] {
    if (src.length > 0) {
        if (typeof id === 'string') {
            return removeModalById(src, id);
        } else if (Array.isArray(id)) {
            for (let i of id) {
                src = removeModalById(src, i);
            }
            return src;
        } else {
            return removeModalById(src, src[src.length - 1].key);
        }
    }
    return src;
}

const ModalProviderRoot = React.memo((props: { children: React.ReactNode }) => {
    const [modals, setModals] = React.useState<ModalItem[]>([]);
    const close = React.useCallback((id?: Maybe<string> | Array<string>) => {
        setModals((a) => { return removeModals(a, id); });
    }, []);
    const show = React.useCallback((node: React.ReactNode, p?: Maybe<string>) => {
        let key = randomBytes(16).toString('hex');
        let parent = p ? p : null;
        setModals((a) => [...a, { key, node, parent }]);
        return key;
    }, []);
    const current = React.useMemo<string | null>(() => {
        return null;
    }, []);
    const ctx = React.useMemo(() => ({ close, show, current }), [close, show, current]);
    return (
        <ModalContext.Provider value={ctx}>
            <>
                {props.children}
                <AnimatePresence>
                    {modals.map((v, k) => <ModalProviderChild ctx={ctx} parent={v.key} key={k}>{v.node}</ModalProviderChild>)}
                </AnimatePresence>
            </>
        </ModalContext.Provider>
    )
});

const ModalProviderChild = React.memo((props: { parent: string, ctx: ModalContextType, children: React.ReactNode }) => {
    const close = React.useCallback((id?: Maybe<string> | Array<string>) => {
        props.ctx.close(props.parent || id);
    }, []);
    const show = React.useCallback((node: React.ReactNode, p?: Maybe<string>) => {
        return props.ctx.show(node, props.parent || p);
    }, []);
    const current = React.useMemo<string | null>(() => {
        return props.parent;
    }, []);
    const ctx = React.useMemo(() => ({ close, show, current }), [close, show, current]);
    return (
        <ModalContext.Provider value={ctx}>
            {props.children}
        </ModalContext.Provider>
    )
});

export const ModalProvider = React.memo((props: { children: React.ReactNode }) => {
    return (<ModalProviderRoot>{props.children}</ModalProviderRoot>);
});

//
// UI
//

const modalBackdropStyle = css`
    position: absolute;
    display: flex;
    width: 100vw;
    height: 100vh;
    background-color: var(--theme-modal-bg);
    justify-content: center;
    align-items: center;
`;

const modalStyle = css`
    display: flex;
    flex-direction: column;
    background-color: var(--theme-bg);
    border-width: 1px;
    border-color: white;
    border-style: solid;
    padding: 24px;
    border-radius: 8px;
    min-width: 400px;
`;

export const Modal = React.memo((props: {
    children: React.ReactNode,
    backdropClassName?: string,
    className?: string,
    title?: string
}) => {
    const modal = useModal();
    return (
        <motion.div
            className={cx(modalBackdropStyle, props.backdropClassName)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className={cx(modalStyle, props.className)}>
                <View style={{ alignSelf: 'stretch', flexDirection: 'row' }}>
                    <Text style={{ flexGrow: 1, flexBasis: 0 }}>{props.title}</Text>
                    <Button title="Close" onClick={() => modal.close()} />
                </View>
                <View style={{ alignSelf: 'stretch' }}>
                    {props.children}
                </View>
            </div>
        </motion.div>
    );
});