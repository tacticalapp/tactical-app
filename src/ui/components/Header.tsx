import * as React from 'react';
import { View } from 'react-native';
import { Text } from './Themed';

export const Header = React.memo((props: { title: string, right?: any }) => {
    return (
        <View style={{ flexDirection: 'column', alignItems: 'stretch', alignSelf: 'stretch' }}>
            <View
                style={{
                    height: 110,
                    backgroundColor: 'var(--theme-bg)',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingTop: 42,
                    paddingHorizontal: 20
                }}
            >
                <Text style={{
                    fontSize: 42,
                    lineHeight: 48,
                    fontWeight: '500',
                    flexGrow: 1,
                    flexBasis: 0
                }} numberOfLines={1} >{props.title}</Text>
                {props.right && (
                    <View>
                        {props.right}
                    </View>
                )}
                {!props.right && (
                    <View style={{ width: 32 }} />
                )}
            </View>
            <View style={{ height: 1, backgroundColor: 'var(--theme-div)' }} />
        </View>
    )
});