import { css, cx } from '@linaria/core';
import * as React from 'react';
import { View } from 'react-native';

const button = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: transparent;
    border-width: 0px;
    border-radius: 10px;
    height: 48px;
    padding: 0px;
    margin: 0px;
    padding-left: 16px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.5);
    &:hover {
        background-color: rgba(255, 255, 255, 0.05);
    }
`;

const buttonActive = css`
    color: rgba(255, 255, 255, 1);
    background-color: rgba(255, 255, 255, 0.1);
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`

const buttonTitle = css`
    font-size: 16px;
    font-weight: 500;
`;

const buttonImage = css`
    width: 24px;
    height: 24px; 
    padding-right: 12px;
    opacity: 0.5;
`;
const buttonActiveImage = css`
    width: 24px;
    height: 24px; 
    padding-right: 12px;
    opacity: 1;
`;

export const SidebarButton = React.memo((props: { icon: any, title: string, active: boolean, onClick: () => void }) => {
    return (
        <button className={cx(button, props.active && buttonActive)} onClick={props.onClick}>
            <img className={cx(buttonImage, props.active && buttonActiveImage)} src={props.icon} />
            <span className={buttonTitle}>
                {props.title}
            </span>
        </button>
    );
});