import * as React from 'react';

export const Deferred = React.memo((props: { enable?: boolean, children?: any }) => {
    const [render, setRender] = React.useState(typeof props.enable === 'boolean' ? !props.enable : false);
    React.useEffect(() => {
        let ended = false;
        setTimeout(() => {
            if (!ended) {
                setRender(true);
            }
        }, 30);
        return () => {
            ended = true;
        }
    }, []);
    if (!render) {
        return null;
    } else {
        return (
            <>
                {props.children}
            </>
        )
    }
});