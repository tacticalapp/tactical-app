import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import DefeaultSelect, { Theme, defaultTheme } from 'react-select';
import { Maybe } from '../../utils/type';

const theme: Theme = {
    ...defaultTheme,
    colors: {
        ...defaultTheme.colors,

        primary: 'var(--theme-focus)', // Focus border and selected item
        // primary75: '#ff0000',
        primary50: '#161921', // Item press
        primary25: '#222222', // Item hover

        neutral0: '#303030', // Background
        // neutral5: '#ff0000',
        // neutral10: '#ff0000',
        neutral20: 'rgba(0, 0, 0, 0.8)', // Select borders
        // neutral30: 'rgba(0, 0, 0, 0.4)', // Hover borders
        // neutral40: '#ff0000', // Tick hover
        // neutral50: '#ff0000',
        neutral60: 'rgba(255,255,255,0.8)', // Tick down
        // neutral70: '#ff0000',
        neutral80: '#ffffff', // Item text
        // neutral90: '#272D32' // Item hover
    },
    borderRadius: 10,
    spacing: {
        ...defaultTheme.spacing,
        controlHeight: 46
    }
};

export const Select = React.memo((props: {
    style?: StyleProp<ViewStyle>,
    isSearchable?: Maybe<boolean>,
    isClearable?: Maybe<boolean>,
    isOpen?: Maybe<boolean>,
    value: string | null,
    options: { value: string, label: string }[],
    onChange: (value: string | null) => void
}) => {
    const isSearchable = props.isSearchable ?? true;
    const isClearable = props.isClearable ?? false;
    const isOpen = props.isOpen ?? undefined;
    return (
        <View style={[{ width: 300 }, props.style]}>
            <DefeaultSelect
                value={props.options.find((option) => option.value === props.value)}
                onChange={(option) => props.onChange(option ? option.value : null)}
                options={props.options}
                theme={theme}
                isSearchable={isSearchable}
                isClearable={isClearable}
                menuIsOpen={isOpen}
                menuPortalTarget={document.body}
            // isDisabled={true}
            />
        </View>
    );
});