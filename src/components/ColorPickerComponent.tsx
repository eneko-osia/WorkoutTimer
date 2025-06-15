// react imports
import React from 'react';
import {
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import ColorPicker, { Panel5 } from 'reanimated-color-picker';

// project imports
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';

// type definitions
type Props = {
    visible: boolean;
    onColorChange: (color: string) => void;
};

// component
export default function ColorPickerComponent({ visible, onColorChange }: Props) {
    // hooks
    const scheme = useColorScheme();

    // theme
    const theme = useTheme(scheme);
    const style = StyleSheet.create({ ...useStyles(theme) })

    // jsx
    return (
        visible ? (
            <View style = { [ style.marginTop ] } >
                 <ColorPicker onChangeJS = { (colors) => { onColorChange(colors.rgba); } }>
                    <Panel5 style = { [ style.border ] } />
                </ColorPicker>
            </View>
        ) : (
            <></>
        )
    );
}
