import * as React from 'react';
import { View } from 'react-native';
import { Text } from './Themed';

export const Header = React.memo((props: { title: string }) => {
    return (
        <View
            style={{
                height: 48,
                backgroundColor: '#191919',
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: 16
            }}
        >
            <Text style={{ fontSize: 16, fontWeight: '600', opacity: 0.7 }}>{props.title}</Text>
        </View>
    )
});