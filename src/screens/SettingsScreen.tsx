// react imports
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

// project imports
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import SettingsColorPicker from '../components/SettingsColorPicker';

// screen
export default function SettingsScreen() {
    // hooks
    const scheme = useColorScheme();

    // theme
    const theme = useTheme(scheme);
    const style = StyleSheet.create({ ...useStyles(theme) })

    // attributes
    const [ pendingChanges, setPendingChanges ] = useState(false);

    // methods
    const saveAsync = async () => {
        setPendingChanges(false);
        // await saveSettings(Workout.kStorageKey, workout);
    };

    // const update = () => {
    //     setPendingChanges(true);
    //     // forceUpdate((_prev) => !_prev);
    // }

    // jsx
    return (
        <View style = { [ style.containerPrimary ] }>
            <View style = { [ style.containerSecondary ] }>
                <View style = { [ style.row ] }>
                    <Text style = { [ style.text, style.normal, style.bold, style.left, style.flex1 ] } numberOfLines = { 1 }>
                        Settings
                    </Text>
                    <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, (!pendingChanges ?  style.disabled : {}), style.border, style.outline ] }
                        disabled = { !pendingChanges }
                        onPress = { () => { saveAsync(); }}
                    >
                        <MaterialIcons name = 'save' size = { theme.sizes.sm }/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style = { [ style.containerSecondary, style.flex1 ] }>
                <View style = { [ style.containerTertiary ] }>
                    <View style = { [ style.row ] }>
                        <Text style = { [ style.text, style.normal, style.bold, style.left, style.flex1 ] } numberOfLines = { 1 }>
                            Colors
                        </Text>
                    </View>
                    <View style = { [ style.secondary, style.border ] }>
                        <SettingsColorPicker name='Primary' initialColor = { theme.colors.primary } />
                        <SettingsColorPicker name='Secondary' initialColor = { theme.colors.secondary } />
                        <SettingsColorPicker name='Tertiary' initialColor = { theme.colors.tertiary } />
                        <SettingsColorPicker name='Button' initialColor = { theme.colors.quaternary } />
                        <SettingsColorPicker name='Text' initialColor = { theme.colors.text } />
                        <SettingsColorPicker name='Text Backgound' initialColor = { theme.colors.input } />
                    </View>
                </View>
            </View>
        </View>
    );
}
