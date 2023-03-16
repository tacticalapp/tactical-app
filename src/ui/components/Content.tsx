import * as React from 'react';
import { ScrollView, View } from 'react-native';

export const Content = React.memo((props: { children: React.ReactNode }) => {
    return (

        <ScrollView
            style={{
                flexDirection: 'column',
                flexGrow: 1,
                flexBasis: 0,
                paddingHorizontal: 20,
                paddingVertical: 20,
            }}

            contentContainerStyle={{
                alignItems: 'flex-start',
                gap: 36,
                flexGrow: 1
            }}
        >
            {props.children}
        </ScrollView>
    );
});