import * as React from 'react';
import { View } from 'react-native';

export const Content = React.memo((props: { children: React.ReactNode }) => {
    return (

        <View style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: 600,
            paddingHorizontal: 16,
            paddingVertical: 16,
            gap: 36
        }}>
            {props.children}
        </View>
    );
});