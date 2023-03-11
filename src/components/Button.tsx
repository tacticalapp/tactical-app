import { css, cx } from '@linaria/core';
import * as React from 'react';

const styleNormal = css`
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #f4f4f4;
    color: #111111;
    cursor: pointer;
    transition: border-color 0.25s;

    &:hover {
        background-color: #d1d1d1;
    }
`;

const styleGhost = css`
    border: 0px;
    background-color: transparent;
    color: #dedddd;
    &:hover {
        color: #fff;
        background-color: transparent;
    }
`;

export const Button = React.memo((props: { kind?: 'normal' | 'ghost', title: string, loading?: boolean, onClick: () => void }) => {
    let kind = props.kind || 'normal';
    return (
        <button className={cx(styleNormal, kind === 'ghost' && styleGhost)} onClick={props.onClick}>
            {props.title}
        </button>
    );
});