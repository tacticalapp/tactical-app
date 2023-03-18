import { css, cx } from '@linaria/core';
import * as React from 'react';
import { ActivityIndicator } from 'react-native';

const styleNormal = css`
    position: relative;
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.1em 0.9em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #f4f4f4;
    color: #111111;
    cursor: pointer;
    transition: border-color 0.25s;
    height: 32px;
    min-width: 64px;

    &:hover:not([disabled]) {
        background-color: #d1d1d1;
    }
`;

const styleLarge = css`
    padding: 0.6em 1.2em;
    height: 42px;
`;

const styleGhost = css`
    border: 0px;
    background-color: transparent;
    color: #dedddd;
    &:hover:not([disabled]) {
        color: #fff;
        background-color: transparent;
    }
`;

const styleGreen = css`
    background-color: #cef4a9;
    &:hover:not([disabled]) {
        background-color: #abd087;
    }
`;

const hiddenStyle = css`
    opacity: 0;
`;

const loaderStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Button = React.memo((props: {
    kind?: 'normal' | 'ghost' | 'green',
    size?: 'normal' | 'large',
    title: string,
    loading?: boolean,
    onClick: () => void
}) => {
    let kind = props.kind || 'normal';
    let callback = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        props.onClick();
    }, [props.onClick])
    return (
        <button className={cx(styleNormal, kind === 'ghost' && styleGhost, kind === 'green' && styleGreen, props.size === 'large' && styleLarge)} onClick={callback} disabled={props.loading === true}>
            <span className={cx(props.loading && hiddenStyle)}>{props.title}</span>
            {props.loading && <div className={loaderStyle}><ActivityIndicator color={kind === 'ghost' ? '#dedddd' : '#111111'} /></div>}
        </button>
    );
});