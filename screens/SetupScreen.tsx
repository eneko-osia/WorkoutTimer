// react imports
import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

// project imports
import { formatDuration } from '../utils/format';
import { RootStackParamList } from '../navigation/types';
import { saveWorkout } from '../utils/storage';
import { TimerBlock, TimerSubBlock, Workout } from '../types/workout';
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';

// type definitions
type SetupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setup'>;
type SetupScreenRouteProp = RouteProp<RootStackParamList, 'Setup'>;

// screen
export default function SetupScreen() {
    // hooks
    const navigation = useNavigation<SetupScreenNavigationProp>();
    const route = useRoute<SetupScreenRouteProp>();
    const scheme = useColorScheme();

    // theme
    const theme = useTheme(scheme);
    const style = StyleSheet.create({
        ...useStyles(theme),
        fixWidth: { width: theme.spacing.xxl }
    })

    // attributes
    const [ , forceUpdate ] = useState(false);
    const { workout }       = route.params;
    const timer             = useRef<NodeJS.Timeout>(null);

    // methods
    const createBlock = () => {
        createSubBlock(
            workout.addBlock({
                sets: 1,
                subBlocks: []
            })
        );
    };

    const createSubBlock = (blockId: number) => {
        workout.addSubBlock(blockId, {
            label: 'New Block',
            duration: 10
        });
        update();
    };

    const deleteBlock = (blockId: number) => {
        workout.deleteBlock(blockId)
        update();
    };

    const deleteSubBlock = (blockId: number, subBlockId: number) => {
        workout.deleteSubBlock(blockId, subBlockId);
        update();
    };

    const decreaseDuration = (blockId: number, subBlock: TimerSubBlock, timeout: number = 250) => {
        subBlock.duration = Math.max(Workout.kMinDuration, subBlock.duration - 1)
        timer.current = setTimeout(() => { decreaseDuration(blockId, subBlock, Math.max(1, timeout - 10)) }, timeout);
        update();
    };

    const increaseDuration = (blockId: number, subBlock: TimerSubBlock, timeout: number = 250) => {
        subBlock.duration = Math.min(Workout.kMaxDuration, subBlock.duration + 1)
        timer.current = setTimeout(() => { increaseDuration(blockId, subBlock, Math.max(1, timeout - 10)) }, timeout);
        update();
    };

    const saveAsync = async () => {
        await saveWorkout(Workout.kStorageKey, workout);
    };

    const stopTimer = () => {
        clearTimeout(timer.current!);
        timer.current = null;
    }

    const update = () => {
        forceUpdate((prev) => !prev);
    }

    // jsx
    return (
        <View style = { [ style.primary, style.margin, style.padding, style.border, style.outline, style.flex1 ] }>
            <View style = { [ style.secondary, style.marginTop, style.marginHorizontal, style.padding, style.border, style.outline ] }>
                <View style = { [ style.secondary, style.row ] }>
                    <TextInput style = { [ style.text, style.normal, style.left, style.flex1 ] }
                        value = { workout.name }
                        maxLength = { 64 }
                        onChangeText = { (text) => { workout.name = text; update(); } }
                    />
                    <TouchableOpacity style = { [ style.quaternary, style.padding, style.button, style.border, style.outline ] }
                        onPress = { () => { saveAsync(); }}
                    >
                        <MaterialIcons name = 'save' size = { theme.iconSize.sm }/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style = { [ style.quaternary, style.marginTop, style.padding, style.button, (workout.blocks.length === 0 ?  style.disabled : {}), style.border, style.outline ] }
                    disabled = { workout.blocks.length === 0 }
                    onPress = { () => { navigation.navigate('Timer', { workout }); }}
                >
                    <MaterialIcons name = 'play-arrow' size = { theme.iconSize.sm }/>
                </TouchableOpacity>
                <TouchableOpacity style = { [ style.quaternary, style.marginTop, style.padding, style.button, style.border, style.outline ] }
                    onPress = { () => createBlock() }
                >
                    <MaterialIcons name = 'add-circle' size = { theme.iconSize.sm }/>
                </TouchableOpacity>
            </View>
            {workout.blocks.length === 0 ? (
                <></>
            ) : (
                <View style = { [ style.secondary, style.margin, style.padding, style.border, style.outline, style.flex1 ] }>
                    <DraggableFlatList
                        data = { workout.blocks }
                        keyExtractor = { item => item.id.toString() }
                        onDragEnd = { ({ data }) => { workout.blocks = data; update(); } }
                        scrollEnabled = { true }
                        renderItem = {({ item: block, drag, isActive }: RenderItemParams<TimerBlock>) => (
                            <TouchableOpacity onLongPress = { drag } disabled = { isActive }>
                                <View style = { [ style.tertiary, style.marginTop, style.padding, style.border, style.outline ] } key = { block.id }>
                                    <View style = { [ style.tertiary, style.marginHorizontal, style.row ] }>
                                        <Text style = { [ style.text, style.normal, style.left, style.marginRight, style.flex1 ] } numberOfLines = { 1 }>
                                            Sets
                                        </Text>
                                        <TouchableOpacity style = { [ style.quaternary, style.marginVertical, style.padding, style.button, (block.sets <= Workout.kMinSets ?  style.disabled : {}), style.border, style.outline ] }
                                            disabled = { block.sets <= Workout.kMinSets }
                                            onPress = { () => { block.sets = Math.max(Workout.kMinSets, block.sets - 1); update(); } }
                                        >
                                            <MaterialIcons name = 'remove' size = { theme.iconSize.sm }/>
                                        </TouchableOpacity>
                                        <Text style = { [ style.text, style.normal, style.center, style.fixWidth ] }>
                                            { block.sets }
                                        </Text>
                                        <TouchableOpacity style = { [ style.quaternary, style.marginVertical, style.padding, style.button, (block.sets >= Workout.kMaxSets ?  style.disabled : {}), style.border, style.outline ] }
                                            disabled = { block.sets >= Workout.kMaxSets }
                                            onPress = { () => { block.sets = Math.min(Workout.kMaxSets, block.sets + 1); update(); } }
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
                                        onDragEnd = { ({ data }) => { block.subBlocks = data; update(); } }
                                        scrollEnabled = { false }
                                        renderItem = {({ item: subBlock, drag, isActive }: RenderItemParams<TimerSubBlock>) => (
                                            <TouchableOpacity onLongPress = { drag } disabled = { isActive }>
                                                <View style = { [ style.secondary, style.marginTop, style.padding, style.border, style.outline ] } key = { subBlock.id }>
                                                    <View style = { [ style.secondary, style.row ] }>
                                                        <TextInput style = { [ style.text, style.normal, style.left, style.marginRight, style.flex1  ] }
                                                            value = { subBlock.label }
                                                            maxLength = { 64 }
                                                            onChangeText = {(text) => { subBlock.label = text; update(); } }
                                                        />
                                                        <TouchableOpacity style = { [ style.quaternary, style.marginVertical, style.padding, style.button, (subBlock.duration <= Workout.kMinDuration ?  style.disabled : {}), style.border, style.outline ] }
                                                            disabled = { subBlock.duration <= Workout.kMinDuration }
                                                            onPressIn = { () => { decreaseDuration(block.id, subBlock); } }
                                                            onPressOut = { () => { stopTimer(); } }
                                                        >
                                                            <MaterialIcons name = 'remove' size = { theme.iconSize.sm }/>
                                                        </TouchableOpacity>
                                                        <Text style = { [ style.text, style.normal, style.center, style.fixWidth ] }>
                                                            { formatDuration(subBlock.duration) }
                                                        </Text>
                                                        <TouchableOpacity style = { [ style.quaternary, style.marginVertical, style.padding, style.button, (subBlock.duration >= Workout.kMaxDuration ?  style.disabled : {}), style.border, style.outline ] }
                                                            disabled = { subBlock.duration >= Workout.kMaxDuration }
                                                            onPressIn = { () => { increaseDuration(block.id, subBlock); } }
                                                            onPressOut = { () => { stopTimer(); } }
                                                        >
                                                            <MaterialIcons name = 'add' size = { theme.iconSize.sm }/>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <TouchableOpacity style = { [ style.quaternary, style.padding, style.button, (block.subBlocks.length <= 1 ?  style.disabled : {}), style.border, style.outline ] }
                                                        disabled = { block.subBlocks.length <= 1 }
                                                        onPress = { () => { deleteSubBlock(block.id, subBlock.id); } }
                                                    >
                                                        <MaterialIcons name = 'delete' size = { theme.iconSize.sm }/>
                                                    </TouchableOpacity>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    />
                                    <TouchableOpacity style = { [ style.quaternary, style.marginTop, style.padding, style.button, (workout.blocks.length <= 1 ?  style.disabled : {}), style.border, style.outline ] }
                                        disabled = { workout.blocks.length <= 1 }
                                        onPress = { () => { deleteBlock(block.id); } }
                                    >
                                        <MaterialIcons name = 'remove-circle' size = { theme.iconSize.sm }/>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
}
