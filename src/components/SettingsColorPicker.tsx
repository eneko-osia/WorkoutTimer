// react imports
import React, { useState } from 'react';
import {
    StyleSheet,
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
    name: string
    initialColor: string,
};

// component
export default function SettingsColorPicker({name, initialColor} : Props) {
    // hooks
    const scheme = useColorScheme();

    // theme
    const theme = useTheme(scheme);
    const style = StyleSheet.create({ 
        ...useStyles(theme),
        preview: {
            width: '100%',
            height: '100%',
        },
     })

    // attributes
    const [ color, setColor ]                       = useState(initialColor);
    const [ showColorPicker, setShowColorPicker ]   = useState(false);

    // jsx
    return (
        <>
            <View style = { [ style.row, style.padding ] }>
                <Text style = { [ style.text, style.normal, style.left, style.flex1 ] } numberOfLines = { 1 }>
                    {name}
                </Text>
                <View style = { [ {backgroundColor: color }, style.preview, style.marginLeft, style.border, style.outlineThick, style.flex1 ] } />
                <TouchableOpacity style = { [ style.quaternary, style.button, style.marginLeft, style.padding, style.border, style.outline ] }
                    onPress = { () => { setShowColorPicker(!showColorPicker); } }
                >
                    <MaterialIcons name = 'format-color-fill' size = { theme.sizes.sm }/>
                </TouchableOpacity>
            </View>
            {showColorPicker ? (
                <View style = { [ style.marginTop ] } >
                    <ColorPicker onChangeJS = { (colors) => { setColor(colors.rgba); }} value = { initialColor } >
                        <Panel5 style = { [ style.border ] } />
                    </ColorPicker>
                </View>
            ) : (
                <></>
            )}
        </>
    );
}
