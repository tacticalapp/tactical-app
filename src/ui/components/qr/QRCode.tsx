import * as React from 'react';
import { View } from 'react-native';
import { createQRMatrix } from './QRMatrix';

export const QRCode = React.memo((props: { data: string, size: number }) => {
    const matrix = createQRMatrix(props.data, 'quartile');
    const dotSize = Math.floor((props.size - 8 * 2) / matrix.size);
    const padding = Math.floor((props.size - dotSize * matrix.size) / 2);

    // Create locators
    let locators: any[] = [];
    for (let [x, y] of [[0, 0], [0, matrix.size - 7], [matrix.size - 7, 0]]) {
        locators.push(
            <rect x={x} y={y} width="7" height="7" fill="black" />
        );
        locators.push(
            <rect x={x + 1} y={y + 1} width="5" height="5" fill="white" />
        );
        locators.push(
            <rect x={x + 2} y={y + 2} width="3" height="3" fill="black" />
        );
    }

    // Create parts
    let parts: string[] = [];
    for (let x = 0; x < matrix.size; x++) {
        for (let y = 0; y < matrix.size; y++) {
            let dot = matrix.getNeighbors(x, y);
            if (dot.current) {
                parts.push(`M ${x} ${y} l 1 0 0 1 -1 0 Z`);
            }
        }
    }

    return (
        <View style={{ width: props.size, height: props.size, backgroundColor: 'white', padding: padding, flexWrap: 'wrap', borderRadius: 8 }}>
            <svg
                version="1.1"
                viewBox={`0 0 ${matrix.size} ${matrix.size}`}
                width={`${dotSize * matrix.size}px`}
                height={`${dotSize * matrix.size}px`}
            >
                <path d={parts.join(' ')} fill={'#000'} />
                {locators}
            </svg>
        </View>
    );
});