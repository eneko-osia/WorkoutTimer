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

// component
export default function SettingsColorPicker() {
    // hooks
    const scheme = useColorScheme();

    // theme
    const theme = useTheme(scheme);
    const style = StyleSheet.create({ ...useStyles(theme) })

    // attributes
    const [ color, setColor ]                   = useState('rgb(0, 0, 0)');
    const [showColorPicker, setShowColorPicker] = useState(false);

    // jsx
    return (
        <>
            <View style = { [ style.row ] }>
                <Text style = { [ style.text, style.normal, style.bold, style.left, style.flex1 ] } numberOfLines = { 1 }>
                    Primary
                </Text>
                <View style = { [ {backgroundColor: color }, style.flex1 ] }>

                </View>
                <TouchableOpacity style = { [ style.quaternary, style.button, style.padding, style.border, style.outline ] }
                    onPress = { () => { setShowColorPicker(!showColorPicker); } }
                >
                    <MaterialIcons name = 'format-color-fill' size = { theme.sizes.sm }/>
                </TouchableOpacity>
            </View>
            {showColorPicker ? (
                <View style = { [ style.marginTop ] } >
                    <ColorPicker onChangeJS = { (colors) => { setColor(colors.rgba); }}>
                        <Panel5 style = { [ style.border ] } />
                    </ColorPicker>
                </View>
            ) : (
                <></>
            )}
        </>
    );
}
