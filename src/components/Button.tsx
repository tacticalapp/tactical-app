import { css } from '@linaria/core';
import * as React from 'react';

const styleNormal = css`
    border-radius: 4px;
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

export const Button = React.memo((props: { title: string, loading?:boolean, onClick: () => void }) => {
    return (
        <button className={styleNormal} onClick={props.onClick}>
            {props.title}
        </button>
    );
});