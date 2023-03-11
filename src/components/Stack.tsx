import { css } from '@linaria/core';
import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { randomKey } from '../utils/randomKey';

const StackContext = React.createContext<{ pop: () => void, push: (node: React.ReactNode) => void } | null>(null);

export function useStack() {
    let ctx = React.useContext(StackContext);
    if (!ctx) {
        throw new Error('StackContext not found');
    }
    return ctx;
}

export const Stack = React.memo((props: { initial: React.ReactNode }) => {

    // Stack operations
    const [stack, setStack] = React.useState([{ key: randomKey(), node: props.initial }]);
    const push = React.useCallback((node: React.ReactNode) => {
        setStack((stack) => [...stack, { key: randomKey(), node }]);
    }, []);
    const pop = React.useCallback(() => {
        setStack((stack) => stack.length > 1 ? stack.slice(0, stack.length - 1) : stack);
    }, []);
    const ctxValue = React.useMemo(() => ({ pop, push }), [pop, push]);

    // Stack rendering
    return (
        <StackContext.Provider value={ctxValue}>
            <AnimatePresence>
                {stack.map((node, i) => (
                    <motion.div
                        key={node.key}
                        className={page}
                        initial={{ opacity: i !== 0 ? 0 : 1, translateX: i !== 0 ? 100 : 0 }}
                        animate={{ opacity: i === stack.length - 1 ? 1 : 0, translateX: i === stack.length - 1 ? 0 : -100 }}
                        exit={{ opacity: 0, translateX: 100 }}
                        style={{ pointerEvents: i === stack.length - 1 ? 'auto' : 'none' }}
                    >
                        {node.node}
                    </motion.div>
                ))}
            </AnimatePresence>
        </StackContext.Provider>
    );
});

const page = css`
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;