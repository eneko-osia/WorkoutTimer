// react imports
import React, { useCallback, useState } from 'react';
import {
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import ColorPicker, { Panel5 } from 'reanimated-color-picker';
import MaterialIcons from '@react-native-vector-icons/material-icons';

// project imports
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';

// type definitions
type Props = {
    name: string,
    defaultColor: string,
    initialColor: string,
    onChange: (color: string) => void,
};

// component
export default function SettingsColorPicker({name, defaultColor, initialColor, onChange} : Props) {
    // hooks
    const scheme = useColorScheme();

    // theme
    const theme = useTheme(scheme);
    const style = useStyles(theme);

    // attributes
    const [ color, setColor ]                       = useState(initialColor);
    const [ showColorPicker, setShowColorPicker ]   = useState(false);

    // methods
    const updateColor = useCallback((_color: string) => {
        setColor(_color);
        onChange(_color);
    }, [ onChange ]);

    // jsx
    return (
        <>
            <View style = { [ style.row, style.padding ] }>
                <Text style = { [ style.text, style.normal, style.left, style.flex1 ] } numberOfLines = { 1 }>
                    {name}
                </Text>
                <View style = { [ {backgroundColor: color }, style.preview, style.marginLeft, style.border, style.outlineThick, style.flex1 ] } />
                <TouchableOpacity style = { [ style.quaternary, style.button, style.marginLeft, style.padding, style.border, style.outline ] }
                    onPress = { () => updateColor(defaultColor) }
                >
                    <MaterialIcons name = 'format-color-reset' size = { theme.sizes.sm }/>
                </TouchableOpacity>
                <TouchableOpacity style = { [ style.quaternary, style.button, style.marginLeft, style.padding, style.border, style.outline ] }
                    onPress = { () => { setShowColorPicker(!showColorPicker); } }
                >
                    <MaterialIcons name = 'format-color-fill' size = { theme.sizes.sm }/>
                </TouchableOpacity>
            </View>
            {showColorPicker && (
                <View style = { [ style.marginTop ] } >
                    <ColorPicker onChangeJS = { (colors) => updateColor(colors.rgba) } value = { initialColor } >
                        <Panel5 style = { [ style.border ] } />
                    </ColorPicker>
                </View>
            )}
        </>
    );
}
