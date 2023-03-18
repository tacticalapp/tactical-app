import * as React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Address } from 'ton-core';
import { isMainnet } from '../../utils/chain';
import { Text } from './Themed';

export const AddressComponent = React.memo((props: { address: string | Address, maxLength?: number, style?: StyleProp<TextStyle> }) => {
    let address = Address.parse(Address.normalize(props.address)).toString({ testOnly: !isMainnet });
    if (props.maxLength !== undefined) {
        if (address.length > props.maxLength) {
            let l = props.maxLength - 3;
            let lenFirst = Math.max(Math.floor(l / 4), 4);
            let lenLast = l - lenFirst;
            address = address.substring(0, lenFirst) + '...' + address.substring(address.length - lenLast);
        }
    }
    return (
        <Text
            style={[{
                fontFamily: 'Martian Mono',
                fontWeight: '400',
                opacity: 0.7
            }, props.style]}
            numberOfLines={1}
            ellipsizeMode="middle"
        >
            {address}
        </Text>
    );
});