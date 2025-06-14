// react imports
import React, { useRef } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import MaterialIcons from '@react-native-vector-icons/material-icons';

// project imports
import { TimerBlock, TimerSubBlock, Workout } from '../types/workout';
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';
import TimerSubBlockEditor from './TimerSubBlockEditor';

// type definitions
type Props = {
    workout: Workout,
    block: TimerBlock;
    onChange: () => void;
};

// component
export default function TimerBlockEditor({ workout, block, onChange }: Props) {
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
    const createSubBlock = (blockId: number) => {
        workout.createSubBlock(blockId, 'New Block');
        onChange();
    };

    const deleteSubBlock = (blockId: number, subBlockId: number) => {
        workout.deleteSubBlock(blockId, subBlockId);
        onChange();
    };

    const moveSubBlock = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) { return; }
        const [ item ] = block.subBlocks.splice(fromIndex, 1);
        block.subBlocks.splice(toIndex, 0, item);
        onChange();
    }

    const removeSubBlock = (blockId: number, subBlock: TimerSubBlock) => {
        if (Platform.OS === 'web') {
            deleteSubBlock(blockId, subBlock.id);
        }
        else {
            Alert.alert(
            'Delete Timer Block',
            `Are you sure you want to delete timer sub block "${subBlock.label}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => { deleteSubBlock(blockId, subBlock.id); } }
            ]);
        }
    }

    const decreaseSets = (block: TimerBlock, timeout: number = 250) => {
        block.sets = Math.max(Workout.kMinSets, block.sets - 1)
        timer.current = setTimeout(() => { decreaseSets(block, Math.max(1, timeout - 10)) }, timeout);
        onChange();
    };

    const increaseSets = (block: TimerBlock, timeout: number = 250) => {
        block.sets = Math.min(Workout.kMaxSets, block.sets + 1)
        timer.current = setTimeout(() => { increaseSets(block, Math.max(1, timeout - 10)) }, timeout);
        onChange();
    };

    const stopTimer = () => {
        clearTimeout(timer.current!);
        timer.current = null;
    }

    // jsx
    return (
        <>
            <View style = { [ style.tertiary, style.marginHorizontal, style.row ] }>
                <Text style = { [ style.text, style.normal, style.bold, style.left, style.marginRight, style.flex1 ] } numberOfLines = { 1 }>
                    Sets
                </Text>
                <TouchableOpacity style = { [ style.quaternary, style.marginVertical, style.padding, style.button, (block.sets <= Workout.kMinSets ?  style.disabled : {}), style.border, style.outline ] }
                    disabled = { block.sets <= Workout.kMinSets }
                    onPressIn = { () => { decreaseSets(block); } }
                    onPressOut = { () => { stopTimer(); } }
                >
                    <MaterialIcons name = 'remove' size = { theme.sizes.sm }/>
                </TouchableOpacity>
                <Text style = { [ style.text, style.normal, style.bold, style.center, style.fixWidth ] }>
                    { block.sets }
                </Text>
                <TouchableOpacity style = { [ style.quaternary, style.marginVertical, style.padding, style.button, (block.sets >= Workout.kMaxSets ?  style.disabled : {}), style.border, style.outline ] }
                    disabled = { block.sets >= Workout.kMaxSets }
                    onPressIn = { () => { increaseSets(block); } }
                    onPressOut = { () => { stopTimer(); } }
                >
                    <MaterialIcons name = 'add' size = { theme.sizes.sm }/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style = { [ style.quaternary, style.padding, style.button, style.border, style.outline ] }
                onPress = {() => createSubBlock(block.id)}
            >
                <MaterialIcons name = 'add' size = { theme.sizes.sm }/>
            </TouchableOpacity>
            <Animated.FlatList
                data = { block.subBlocks }
                keyExtractor = { (item) => item.id.toString() }
                scrollEnabled = { false }
                itemLayoutAnimation = { LinearTransition }
                renderItem = {({ item, index }) => (
                    <View style = { [ style.secondary, style.row, style.marginVertical, style.padding, style.border, style.outline ] } key = { item.id }>
                        <View style = { [ style.secondary, style.flex1 ] }>
                            <TimerSubBlockEditor
                                workout = { workout }
                                block = { block }
                                subBlock = { item }
                                onChange = { onChange }
                            />
                        </View>
                        <View style = { [ style.line, style.marginHorizontal ] } />
                        <View style = { [ style.secondary ] }>
                            <TouchableOpacity style = { [ style.quaternary, style.paddingHorizontal, style.button, (index == 0 ?  style.disabled : {}), style.border, style.outline ] }
                                disabled = { index == 0 }
                                onPress = { () => { moveSubBlock(index, Math.max(0, index - 1)); } }
                            >
                                <MaterialIcons name = 'arrow-upward' size = { theme.sizes.sm }/>
                            </TouchableOpacity>
                            <TouchableOpacity style = { [ style.quaternary, style.marginTop, style.padding, style.button, (block.subBlocks.length <= 1 ?  style.disabled : {}), style.border, style.outline ] }
                                disabled = { block.subBlocks.length <= 1 }
                                onPress = { () => { removeSubBlock(block.id, item); } }
                            >
                                <MaterialIcons name = 'delete' size = { theme.sizes.sm }/>
                            </TouchableOpacity>
                            <TouchableOpacity style = { [ style.quaternary, style.marginTop, style.paddingHorizontal, (index == (block.subBlocks.length - 1) ?  style.disabled : {}), style.button, style.border, style.outline ] }
                                disabled = { index == (block.subBlocks.length - 1) }
                                onPress = { () => { moveSubBlock(index, Math.min((block.subBlocks.length - 1), index + 1)); } }
                            >
                                <MaterialIcons name = 'arrow-downward' size = { theme.sizes.sm }/>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </>
    );
}
