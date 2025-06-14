// react imports
import React from 'react';
import {
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
// import ColorPicker from 'react-native-wheel-color-picker';

// project imports
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';

// type definitions
type Props = {
    color: string;
    visible: boolean;
    onColorChange: (color: string) => void;
};

// component
export default function ColorPickerComponent({ color, visible, onColorChange }: Props) {
    // hooks
    const scheme = useColorScheme();

    // theme
    const theme = useTheme(scheme);
    const style = StyleSheet.create({ ...useStyles(theme) })

    // jsx
    return (
        visible ? (
            <View style = { [ style.padding, style.border ] } >
                {/* <ColorPicker
                    color = { color }
                    row = { false }
                    sliderSize = { theme.sizes.sm }
                    swatches = { false }
                    thumbSize = { theme.sizes.sm }
                    onColorChangeComplete = { onColorChange }
                /> */}
            </View>
        ) : (
            <></>
        )
    );
}
