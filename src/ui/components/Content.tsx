import * as React from 'react';
import { ScrollView, View } from 'react-native';

export const Content = React.memo((props: { children: React.ReactNode }) => {
    return (

        <ScrollView
            style={{
                flexDirection: 'column',
                flexGrow: 1,
                flexBasis: 0,
                paddingHorizontal: 16,
                paddingVertical: 16,
            }}
            contentContainerStyle={{
                alignItems: 'flex-start',
                maxWidth: 600,
                gap: 36
            }}
        >
            {props.children}
        </ScrollView>
    );
});