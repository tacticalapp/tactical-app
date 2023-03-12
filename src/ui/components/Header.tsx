import * as React from 'react';
import { View } from 'react-native';
import { Text } from './Themed';

export const Header = React.memo((props: { title: string }) => {
    return (
        <View
            style={{
                height: 64,
                backgroundColor: '#191919',
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: 16
            }}
        >
            <Text style={{ fontSize: 18, lineHeight: 28, fontWeight: '500' }}>{props.title}</Text>
        </View>
    )
});