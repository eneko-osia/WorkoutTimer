// react imports
import React from 'react';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ColorPicker from 'react-native-wheel-color-picker';

// project imports
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';

// type definitions
type Props = {
    color: string;
    visible: boolean;
    onClose: () => void;
    onColorChange: (color: string) => void;
};

// component
export default function ColorPickerModal({ color, visible, onClose, onColorChange }: Props) {
    // hooks
    const scheme = useColorScheme();

    // theme
    const theme = useTheme(scheme);
    const style = StyleSheet.create({ ...useStyles(theme) })

    // jsx
    return (
        <Modal visible = {visible} animationType = 'slide' transparent>
            <View style = { [ style.containerModal ] }>
                <View style = { [ style.modal ] }>
                    <TouchableOpacity style = { [ style.quaternary, style.marginVertical, style.padding, style.button, style.border, style.outline ] }
                        onPress = { () => { onClose(); } }
                    >
                        <MaterialIcons name = 'close' size = { theme.sizes.sm }/>
                    </TouchableOpacity>
                    <ColorPicker
                        color = { color }
                        thumbSize = { theme.sizes.xs }
                        sliderSize = { theme.sizes.xs }
                        noSnap = { true }
                        row = { false }
                        swatches = { false }
                        onColorChangeComplete = { onColorChange }
                    />
                </View>
            </View>
        </Modal>
    );
}
