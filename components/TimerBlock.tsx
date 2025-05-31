import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { generateId } from '../utils/id';
import { theme } from '../styles/theme';
import { TimerBlockData, TimerSubBlockData } from '../types/timer';
import { TimerSubBlock } from '../components/TimerSubBlock';
import { useStyles } from '../styles/common';

type Props = {
    block: TimerBlockData;
    onUpdate: (block: TimerBlockData) => void;
    onDelete: () => void;
};

export function TimerBlock({block, onUpdate, onDelete}: Props) {
    const kMinSets: number = 1
    const kMaxSets: number = 99

    const addSubBlock = () => {
        onUpdate({ ...block, subBlocks: [...block.subBlocks, {
            id: generateId(),
            label: 'New Block',
            duration: 10,
        }]});
    };

    const deleteSubBlock = (id: string) => {
        onUpdate({...block, subBlocks: block.subBlocks.filter((sb) => sb.id !== id)});
    };

    const updateSets = (sets: number) => {
        onUpdate({...block, sets: Math.min(Math.max(kMinSets, sets), kMaxSets)});
    };

    const updateSubBlock = (id: string, updated: TimerSubBlockData) => {
        onUpdate({...block, subBlocks: block.subBlocks.map((sb) => (sb.id === id ? updated : sb))});
    };

    return (
        <View style = {style.container}>
            <Text style = {style.titleText}>Sets</Text>
            <View style = {style.rowContainer}>
                <TouchableOpacity
                    style = {(block.sets > kMinSets) ? style.button : style.buttonDisabled}
                    disabled = {block.sets <= kMinSets}
                    onPress = {() => updateSets(block.sets - 1)}
                >
                    <Text style = {style.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style = {style.setsText}>{block.sets}</Text>
                <TouchableOpacity
                    style = {(block.sets < kMaxSets) ? style.button : style.buttonDisabled}
                    disabled = {block.sets >= kMaxSets}
                    onPress = {() => updateSets(block.sets + 1)}
                >
                    <Text style = {style.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style = {style.button} onPress = {() => addSubBlock()}>
                <Text style = {style.buttonText}>+</Text>
            </TouchableOpacity>
            {block.subBlocks.map((subBlock) => (
                <TimerSubBlock
                    key = {subBlock.id}
                    subBlock = {subBlock}
                    onUpdate = {(updated) => updateSubBlock(subBlock.id, updated)}
                    onDelete = {() => deleteSubBlock(subBlock.id)}
                />
            ))}
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
        backgroundColor: theme.colors.danger,
    },
    rowContainer: {
        ...useStyles(theme).rowContainer,
        backgroundColor: theme.colors.secondary,
    },
    setsText: {
        ...useStyles(theme).titleText,
        fontSize: theme.fontSizes.sm,
        marginHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        textAlign: 'center',
        width: theme.spacing.xl
    },
})
