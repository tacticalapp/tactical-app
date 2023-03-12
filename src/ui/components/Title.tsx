import * as React from 'react';
import { Text } from './Themed';

export const Title = React.memo((props: { title: string }) => {
    return (<Text style={{ fontWeight: '500', fontSize: 18, lineHeight: 28, marginBottom: 12 }}>{props.title}</Text>)
});