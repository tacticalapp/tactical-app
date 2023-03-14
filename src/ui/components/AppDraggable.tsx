import { css } from "@linaria/core";

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

export const AppDraggable = () => {
    return <div className={draggableStyle} />
};