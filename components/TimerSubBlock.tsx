import React, { useRef } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { formatDuration } from '../utils/format';
import { theme } from '../styles/theme';
import { TimerSubBlockData } from '../types/timer';
import { useStyles } from '../styles/common';

type Props = {
    subBlock: TimerSubBlockData;
    onUpdate: (subBlock: TimerSubBlockData) => void;
    onDelete: () => void;
};

export function TimerSubBlock({ subBlock, onUpdate, onDelete }: Props) {
    const kMinDuration: number = 1
    const kMaxDuration: number = 3600
    const timer = useRef<NodeJS.Timeout>(null);

    const decreaseDuration = (duration: number, timeout: number = 250) => {
        let newDuration = Math.max(kMinDuration, duration - 1)
        updateDuration(newDuration)
        timer.current = setTimeout(() => { decreaseDuration(newDuration, Math.max(1, timeout - 10)) }, timeout);
    };

    const increaseDuration = (duration: number, timeout: number = 250) => {
        let newDuration = Math.min(kMaxDuration, duration + 1)
        updateDuration(newDuration)
        timer.current = setTimeout(() => { increaseDuration(newDuration, Math.max(1, timeout - 10)) }, timeout);
    };

    const stopTimer = () => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    }

    const updateLabel = (label: string) => {
        onUpdate({ ...subBlock, label: label })
    }

    const updateDuration = (duration: number) => {
        onUpdate({ ...subBlock, duration: Math.max(1, duration) });
    };

    return (
        <View style = {style.container}>
            <TextInput style = { style.titleText }
                onChangeText = { (text) => updateLabel(text) }
                placeholder = "Label"
                value = { subBlock.label }
            />
            <View style = {style.rowContainer}>
                <TouchableOpacity
                    style = {(subBlock.duration > kMinDuration) ? style.button : style.buttonDisabled}
                    disabled = {subBlock.duration <= kMinDuration}
                    onPressIn = {() => decreaseDuration(subBlock.duration)}
                    onPressOut = {() => stopTimer()}
                >
                    <Text style = {style.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style = {style.durationText}>{ formatDuration(subBlock.duration) }</Text>
                <TouchableOpacity
                    style = {(subBlock.duration < kMaxDuration) ? style.button : style.buttonDisabled}
                    disabled = {subBlock.duration >= kMaxDuration}
                    onPressIn = {() => increaseDuration(subBlock.duration)}
                    onPressOut = {() => stopTimer()}
                >
                    <Text style = {style.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style = {style.button} onPress = {() => onDelete()}>
                <Text style = {style.buttonText}>-</Text>
            </TouchableOpacity>
        </View>
    );
};

const style = StyleSheet.create({
    ...useStyles(theme),
    container: {
        ...useStyles(theme).container,
        backgroundColor: theme.colors.success,
    },
    rowContainer: {
        ...useStyles(theme).rowContainer,
        backgroundColor: theme.colors.secondary,
    },
    durationText: {
        ...useStyles(theme).titleText,
        fontSize: theme.fontSizes.sm,
        marginHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        textAlign: 'center',
        width: theme.spacing.xl
    },
})
