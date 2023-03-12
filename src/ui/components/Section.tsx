import * as React from 'react';
import { View } from 'react-native';

export const Section = React.memo((props: { children?: any }) => {
    return (
        <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            {props.children}
        </View>
    )
});