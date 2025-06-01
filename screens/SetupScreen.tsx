// react imports
import React, { useRef, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// project imports
import { formatDuration } from '../utils/format';
import { generateId } from '../utils/id';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../styles/theme';
import { TimerBlock, TimerSubBlock, Workout } from '../types/workout';
import { useStyles } from '../styles/common';

// type definitions
type SetupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setup'>;

// screen
export default function SetupScreen() {
    // attributes
    const navigation = useNavigation<SetupScreenNavigationProp>();
    const [workout] = useState<Workout>(new Workout({ id: generateId(), name: 'My Workout' }));
    const timer = useRef<NodeJS.Timeout>(null);
    const [, forceUpdate] = useState(false);

    // methods
    const createBlock = () => {
        createSubBlock(workout.addBlock({
            sets: 1,
            subBlocks: []
        }));
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

    const update = () => {
        forceUpdate((prev) => !prev);
    }

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

    const stopTimer = () => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    }

    return (
        <ScrollView style = {style.container}>
            <TextInput style = {style.titleText} value = {workout.name}/>
            <TouchableOpacity
                style = {(workout.blocks.length > 0) ?  style.button : style.buttonDisabled}
                disabled = {workout.blocks.length === 0}
                onPress = {() => navigation.navigate('Timer', {workout})}
            >
                <Text style = {style.buttonText}>Start Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {style.button} onPress = {() => createBlock()}>
                <Text style = {style.buttonText}>+ Add Block</Text>
            </TouchableOpacity>
            {workout.blocks.map((block) => (
                <View style = {style.blockContainer} key = {block.id}>
                    <Text style = {style.titleText}>Sets</Text>
                    <View style = {style.rowContainer}>
                        <TouchableOpacity
                            style = {(block.sets > Workout.kMinSets) ? style.button : style.buttonDisabled}
                            disabled = {block.sets <= Workout.kMinSets}
                            onPress = {() => { block.sets = Math.max(Workout.kMinSets, block.sets - 1); update(); }}
                        >
                            <Text style = {style.buttonText}>-</Text>
                        </TouchableOpacity>
                        <Text style = {style.setsText}>{block.sets}</Text>
                        <TouchableOpacity
                            style = {(block.sets < Workout.kMaxSets) ? style.button : style.buttonDisabled}
                            disabled = {block.sets >= Workout.kMaxSets}
                            onPress = {() => { block.sets = Math.min(Workout.kMaxSets, block.sets + 1); update(); }}
                        >
                            <Text style = {style.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style = {style.button} onPress = {() => createSubBlock(block.id)}>
                        <Text style = {style.buttonText}>+</Text>
                    </TouchableOpacity>
                    {block.subBlocks.map((subBlock) => (
                        <View style = {style.subBlockContainer} key = {subBlock.id}>
                            <TextInput style = { style.titleText }
                                value = { subBlock.label }
                                onChangeText = {(text) => { subBlock.label = text; update(); }}
                            />
                            <View style = {style.rowContainer}>
                                <TouchableOpacity
                                    style = {(subBlock.duration > Workout.kMinDuration) ? style.button : style.buttonDisabled}
                                    disabled = {subBlock.duration <= Workout.kMinDuration}
                                    onPressIn = {() => decreaseDuration(block.id, subBlock)}
                                    onPressOut = {() => stopTimer()}
                                >
                                    <Text style = {style.buttonText}>-</Text>
                                </TouchableOpacity>
                                <Text style = {style.durationText}>{ formatDuration(subBlock.duration) }</Text>
                                <TouchableOpacity
                                    style = {(subBlock.duration < Workout.kMaxDuration) ? style.button : style.buttonDisabled}
                                    disabled = {subBlock.duration >= Workout.kMaxDuration}
                                    onPressIn = {() => increaseDuration(block.id, subBlock)}
                                    onPressOut = {() => stopTimer()}
                                >
                                    <Text style = {style.buttonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style = {(block.subBlocks.length > 1) ? style.button : style.buttonDisabled}
                                disabled = {block.subBlocks.length <= 1}
                                onPress = {() => deleteSubBlock(block.id, subBlock.id)}
                            >
                                <Text style = {style.buttonText}>-</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity
                        style = {(workout.blocks.length > 1) ? style.button : style.buttonDisabled}
                        disabled = {workout.blocks.length <= 1}
                        onPress = {() => deleteBlock(block.id)}
                    >
                        <Text style = {style.buttonText}>-</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
}

const style = StyleSheet.create({
    ...useStyles(theme),
    blockContainer: {
        ...useStyles(theme).container,
        backgroundColor: theme.colors.success,
    },
    subBlockContainer: {
        ...useStyles(theme).container,
        backgroundColor: theme.colors.danger,
    },
    durationText: {
        ...useStyles(theme).titleText,
        fontSize: theme.fontSizes.sm,
        marginHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        textAlign: 'center',
        width: theme.spacing.xl
    },
    setsText: {
        ...useStyles(theme).titleText,
        fontSize: theme.fontSizes.sm,
        marginHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        textAlign: 'center',
        width: theme.spacing.xl,
    },
})
