import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { generateId } from '../utils/id';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../styles/theme';
import { TimerBlock } from '../components/TimerBlock';
import { TimerBlockData } from '../types/timer';
import { useStyles } from '../styles/common';

type SetupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setup'>;

export default function SetupScreen() {
    const navigation = useNavigation<SetupScreenNavigationProp>();
    const [blocks, setBlocks] = useState<TimerBlockData[]>([]);

    const addBlock = () => {
        setBlocks([...blocks, {
            id: generateId(),
            sets: 1,
            subBlocks: [],
        }]);
    };

    const updateBlock = (blockId: string, updatedBlock: TimerBlockData) => {
        setBlocks((prev: TimerBlockData[]) => prev.map((b) => (b.id === blockId ? updatedBlock : b)));
    };

    const deleteBlock = (blockId: string) => {
        setBlocks((prev: TimerBlockData[]) => prev.filter((b) => b.id !== blockId));
    };

    return (
        <ScrollView style = {style.container}>
            <TextInput
                placeholder = 'Workout Name'
                style = {style.titleText}
                value = 'Workout Name'
            />
            <TouchableOpacity
                style = {(blocks.length > 0) ?  style.button : style.buttonDisabled}
                disabled = {blocks.length === 0}
                onPress = {() => navigation.navigate('Timer', {blocks})}
            >
                <Text style = {style.buttonText}>Start Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {style.button} onPress = {() => addBlock()}>
                <Text style = {style.buttonText}>+ Add Block</Text>
            </TouchableOpacity>
            {blocks.map((block) => (
                <TimerBlock
                    key = {block.id}
                    block = {block}
                    onUpdate = {(updated: TimerBlockData) => updateBlock(block.id, updated)}
                    onDelete = {() => deleteBlock(block.id)}
                />
            ))}
        </ScrollView>
    );
}

const style = StyleSheet.create({
    ...useStyles(theme)
})
