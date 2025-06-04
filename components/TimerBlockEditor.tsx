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
import { MaterialIcons } from '@expo/vector-icons';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

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
        workout.addSubBlock(blockId, {
            label: 'New Block',
            duration: 10
        });
        onChange();
    };

    const deleteSubBlock = (blockId: number, subBlockId: number) => {
        workout.deleteSubBlock(blockId, subBlockId);
        onChange();
    };

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
                <Text style = { [ style.text, style.normal, style.left, style.marginRight, style.flex1 ] } numberOfLines = { 1 }>
                    Sets
                </Text>
                <TouchableOpacity style = { [ style.quaternary, style.marginVertical, style.padding, style.button, (block.sets <= Workout.kMinSets ?  style.disabled : {}), style.border, style.outline ] }
                    disabled = { block.sets <= Workout.kMinSets }
                    onPressIn = { () => { decreaseSets(block); } }
                    onPressOut = { () => { stopTimer(); } }
                >
                    <MaterialIcons name = 'remove' size = { theme.iconSize.sm }/>
                </TouchableOpacity>
                <Text style = { [ style.text, style.normal, style.center, style.fixWidth ] }>
                    { block.sets }
                </Text>
                <TouchableOpacity style = { [ style.quaternary, style.marginVertical, style.padding, style.button, (block.sets >= Workout.kMaxSets ?  style.disabled : {}), style.border, style.outline ] }
                    disabled = { block.sets >= Workout.kMaxSets }
                    onPressIn = { () => { increaseSets(block); } }
                    onPressOut = { () => { stopTimer(); } }
                >
                    <MaterialIcons name = 'add' size = { theme.iconSize.sm }/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style = { [ style.quaternary, style.padding, style.button, style.border, style.outline ] }
                onPress = {() => createSubBlock(block.id)}
            >
                <MaterialIcons name = 'add' size = { theme.iconSize.sm }/>
            </TouchableOpacity>
            <DraggableFlatList
                data = { block.subBlocks }
                keyExtractor = { item => item.id.toString() }
                onDragEnd = { ({ data }) => { block.subBlocks = data; onChange(); } }
                scrollEnabled = { false }
                renderItem = {({ item: subBlock, drag, isActive }: RenderItemParams<TimerSubBlock>) => (
                    <View style = { [ style.secondary, style.marginTop, style.padding, style.border, style.outline ] } key = { subBlock.id }>
                        <TimerSubBlockEditor
                            workout = { workout }
                            block = { block }
                            subBlock = { subBlock }
                            onChange = { onChange }
                        />
                        <View style = { [ style.secondary, style.marginTop, style.row ] }>
                            <TouchableOpacity style = { [ style.quaternary, style.padding, style.button, (block.subBlocks.length <= 1 ?  style.disabled : {}), style.border, style.outline, style.flex1 ] }
                                disabled = { block.subBlocks.length <= 1 }
                                onPress = { () => { removeSubBlock(block.id, subBlock); } }
                            >
                                <MaterialIcons name = 'delete' size = { theme.iconSize.sm }/>
                            </TouchableOpacity>
                            <TouchableOpacity style = { [ style.padding ] }
                                disabled = { isActive }
                                onPressOut = { drag }
                            >
                                <MaterialIcons name = 'reorder' size = { theme.iconSize.sm }/>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </>
    );
}
