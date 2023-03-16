import * as React from 'react';
import { Text } from './Themed';

export const Subtitle = React.memo((props: { children?: any }) => {
    return (<Text style={{ fontWeight: '400', fontSize: 14, lineHeight: 18, marginBottom: 8, opacity: 0.6 }}>{props.children}</Text>)
});