import * as React from 'react';
import { TextInput as DefaultTextInput, TextInputProps } from 'react-native';

export const TextInput = React.memo((props: TextInputProps) => {
    const { style, ...rest } = props;
    return (
        <DefaultTextInput
            style={[{
                height: 46,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderWidth: 0,
                borderRadius: 10,
                backgroundColor: '#303030',
                flexShrink: 0
            }, style]}
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            {...rest}
        />
    );
});