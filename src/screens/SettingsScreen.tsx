// react imports
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

// project imports
import { Colors } from '../types/colors'
import { useDarkTheme, useDefaultTheme, useLightTheme, useTheme } from '../styles/theme';
import { loadSettings, saveSettings } from '../utils/storage';
import { Settings } from '../types/settings'
import { useStyles } from '../styles/common';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import SettingsColorPicker from '../components/SettingsColorPicker';

// screen
export default function SettingsScreen() {
    // hooks
    const scheme = useColorScheme();

    // theme
    const darkTheme     = useDarkTheme();
    const defaultTheme  = useDefaultTheme(scheme);
    const lightTheme    = useLightTheme();
    const theme         = useTheme(scheme);
    const style         = useStyles(theme);

    // attributes
    const [ , forceUpdate ]                     = useState(false);
    const [ pendingChanges, setPendingChanges ] = useState(false);
    const [ settings, setSettings ]             = useState<Settings | null>(null);
    const colorsRef                             = useRef<Colors | null>(null);

    // methods
    const saveAsync = useCallback (async () => {
        setPendingChanges(false);
        if (settings) {
            await saveSettings(Settings.kStorageKey, settings);
        }
    }, [ settings ]);

    const update = useCallback(() => {
        setPendingChanges(true);
        forceUpdate(_prev => !_prev);
    }, []);

    // effects
    useEffect(() => {
        const loadSettingsAsync = async () => {
            let _settings = await loadSettings(Settings.kStorageKey);
            if (!_settings) {
                _settings = new Settings({ dark: new Colors(darkTheme.colors), light: new Colors(lightTheme.colors) });
            }
            colorsRef.current = _settings.getColors(scheme);
            setSettings(_settings);
        }
        loadSettingsAsync();
    }, [ darkTheme, lightTheme, scheme ]);

    // jsx
    return (
        <View style = { [ style.containerPrimary ] }>
            <View style = { [ style.containerSecondary, style.marginTop ] }>
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
            <View style = { [ style.containerSecondary, style.marginVertical, style.flex1 ] }>
                <View style = { [ style.containerTertiary ] }>
                    <View style = { [ style.row ] }>
                        <Text style = { [ style.text, style.normal, style.bold, style.left, style.flex1 ] } numberOfLines = { 1 }>
                            Colors
                        </Text>
                    </View>
                    {colorsRef.current && (
                        <View style = { [ style.secondary, style.border ] }>
                            <SettingsColorPicker
                                name ='Primary'
                                defaultColor = { defaultTheme.colors.primary }
                                initialColor = { colorsRef.current.primary }
                                onChange = { (color: string) => { colorsRef.current!.primary = color; theme.colors.primary = color; update(); } }
                            />
                            <SettingsColorPicker
                                name ='Secondary'
                                defaultColor = { defaultTheme.colors.secondary }
                                initialColor = { colorsRef.current.secondary }
                                onChange = { (color: string) => { colorsRef.current!.secondary = color; theme.colors.secondary = color; update(); } }
                            />
                            <SettingsColorPicker
                                name ='Tertiary'
                                defaultColor = { defaultTheme.colors.tertiary }
                                initialColor = { colorsRef.current.tertiary }
                                onChange = { (color: string) => { colorsRef.current!.tertiary = color; theme.colors.tertiary = color; update(); } }
                            />
                            <SettingsColorPicker
                                name ='Button'
                                defaultColor = { defaultTheme.colors.quaternary }
                                initialColor = { colorsRef.current.quaternary }
                                onChange = { (color: string) => { colorsRef.current!.quaternary = color; theme.colors.quaternary = color; update(); } }
                            />
                            <SettingsColorPicker
                                name ='Text'
                                defaultColor = { defaultTheme.colors.text }
                                initialColor = { colorsRef.current.text }
                                onChange = { (color: string) => { colorsRef.current!.text = color; theme.colors.text = color; update(); } }
                            />
                            <SettingsColorPicker
                                name ='Text Backgound'
                                defaultColor = { defaultTheme.colors.input }
                                initialColor = { colorsRef.current.input }
                                onChange = { (color: string) => { colorsRef.current!.input = color; theme.colors.input = color; update(); } }
                            />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
