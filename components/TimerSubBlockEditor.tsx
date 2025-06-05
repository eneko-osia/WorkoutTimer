// react imports
import React, { useRef } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// project imports
import { formatDuration } from '../utils/format';
import { TimerBlock, TimerSubBlock, Workout } from '../types/workout';
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';

// type definitions
type Props = {
    workout: Workout,
    block: TimerBlock;
    subBlock: TimerSubBlock;
    onChange: () => void;
};

// component
export default function TimerSubBlockEditor({ workout, block, subBlock, onChange }: Props) {
    // hooks
    const scheme = useColorScheme();

    // theme
    const theme = useTheme(scheme);
    const style = StyleSheet.create({
        ...useStyles(theme),
        fixWidth: { width: theme.spacing.xxl },
    })

    // attributes
    const timer = useRef<NodeJS.Timeout>(null);

    // methods
    const decreaseDuration = (blockId: number, subBlock: TimerSubBlock, timeout: number = 250) => {
        subBlock.duration = Math.max(Workout.kMinDuration, subBlock.duration - 1)
        timer.current = setTimeout(() => { decreaseDuration(blockId, subBlock, Math.max(1, timeout - 10)) }, timeout);
        onChange();
    };

    const increaseDuration = (blockId: number, subBlock: TimerSubBlock, timeout: number = 250) => {
        subBlock.duration = Math.min(Workout.kMaxDuration, subBlock.duration + 1)
        timer.current = setTimeout(() => { increaseDuration(blockId, subBlock, Math.max(1, timeout - 10)) }, timeout);
        onChange();
    };

    const stopTimer = () => {
        clearTimeout(timer.current!);
        timer.current = null;
    }

    // jsx
    return (
        <>
            <View style = { [ style.secondary ] }>
                <TextInput style = { [ style.text, style.input, style.normal, style.left, style.padding, style.border, style.outline ] }
                    value = { subBlock.label }
                    maxLength = { 64 }
                    onChangeText = {(text) => { subBlock.label = text; onChange(); } }
                />
            </View>
            <View style = { [ style.secondary, style.row, style.marginTop ] }>
                <TouchableOpacity style = { [ style.quaternary, style.button, (subBlock.duration <= Workout.kMinDuration ?  style.disabled : {}), style.padding, style.border, style.outline ] }
                    disabled = { subBlock.duration <= Workout.kMinDuration }
                    onPressIn = { () => { decreaseDuration(block.id, subBlock); } }
                    onPressOut = { () => { stopTimer(); } }
                >
                    <MaterialIcons name = 'remove' size = { theme.iconSize.sm }/>
                </TouchableOpacity>
                <Text style = { [ style.text, style.center, style.normal, style.bold, style.fixWidth, style.marginHorizontal ] }>
                    { formatDuration(subBlock.duration) }
                </Text>
                <TouchableOpacity style = { [ style.quaternary, style.button, (subBlock.duration >= Workout.kMaxDuration ?  style.disabled : {}), style.padding, style.border, style.outline ] }
                    disabled = { subBlock.duration >= Workout.kMaxDuration }
                    onPressIn = { () => { increaseDuration(block.id, subBlock); } }
                    onPressOut = { () => { stopTimer(); } }
                >
                    <MaterialIcons name = 'add' size = { theme.iconSize.sm }/>
                </TouchableOpacity>
            </View>
        </>
    );
}
