import * as React from 'react';
import { Text } from './Themed';

export const Title = React.memo((props: { title: string }) => {
    return (<Text style={{ fontWeight: '600', fontSize: 14, lineHeight: 17, marginBottom: 8 }}>{props.title}</Text>)
});