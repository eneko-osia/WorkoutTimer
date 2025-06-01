import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import { formatDuration } from '../utils/format';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../styles/theme';
import { useStyles } from '../styles/common';

type TimerScreenRouteProp = RouteProp<RootStackParamList, 'Timer'>;

export default function TimerScreen() {
    const route = useRoute<TimerScreenRouteProp>();

    const { workout } = route.params;
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [currentSubIndex, setCurrentSubIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const timer = useRef<NodeJS.Timeout>(null);

    const currentBlock = workout.blocks[currentBlockIndex];
    const currentSub = currentBlock?.subBlocks?.[currentSubIndex] ?? null;    // Initialize timeLeft when sub changes

    useEffect(() => {
        if (currentSub?.duration != null) {
            setTimeLeft(currentSub.duration);
        } else {
            console.warn('currentSub is undefined — skipping setTimeLeft');
        }
    }, [currentSubIndex, currentSetIndex, currentBlockIndex]);

    useEffect(() => {
        if (!isRunning) return;

        timer.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev > 1)
                    return prev - 1;
                handleAdvance();
                return 0;
            });
        }, 1000);

        return () => clearInterval(timer.current!);
    }, [isRunning, currentBlockIndex, currentSetIndex, currentSubIndex]);

    const handleAdvance = () => {
        clearInterval(timer.current!);
        goToNext()
    };

    function goToNext() {
        const block = workout.blocks[currentBlockIndex];
        const subBlocks = block?.subBlocks ?? [];

        if (currentSubIndex + 1 < subBlocks.length) {
            // Move to next sub-block in the same set
            setCurrentSubIndex(currentSubIndex + 1);
            setTimeLeft(subBlocks[currentSubIndex + 1].duration);
        } else if (currentSetIndex + 1 < block.sets) {
            // Loop back to first sub-block in next set
            setCurrentSubIndex(0);
            setCurrentSetIndex(currentSetIndex + 1);
            setTimeLeft(subBlocks[0].duration);
        } else {
            // Move to next block
            const next = findNextValidBlock(currentBlockIndex + 1);
            if (next) {
            setCurrentBlockIndex(next.blockIndex);
            setCurrentSubIndex(next.subIndex);
            setCurrentSetIndex(0);
            const newSub = workout.blocks[next.blockIndex].subBlocks[next.subIndex];
            setTimeLeft(newSub.duration);
            } else {
            // Workout complete
            setIsRunning(false);
            }
        }
    }

    function findNextValidBlock(startIndex: number) {
        for (let i = startIndex; i < workout.blocks.length; i++) {
            const block = workout.blocks[i];
            if (block.subBlocks && block.subBlocks.length > 0) {
                return { blockIndex: i, subIndex: 0 };
            }
        }
        return null; // No more valid blocks
    }

    useEffect(() => {
        const first = findNextValidBlock(0);
        if (first) {
            setCurrentBlockIndex(first.blockIndex);
            setCurrentSubIndex(first.subIndex);
            setCurrentSetIndex(0);
            setIsRunning(true);
            setTimeLeft(workout.blocks[first.blockIndex].subBlocks[first.subIndex].duration);
        } else {
            setIsRunning(false); // No valid blocks
        }
    }, []);

    return (
        <View style={style.container}>
            <Text style = {style.titleText}>Workout Name</Text>
            <View style={style.container}>
            {isRunning ? (
                currentSub ? (
                <>
                    <Text style = {style.titleText}>
                        Total Duration {formatDuration(workout.totalDuration)}
                    </Text>
                    <Text style = {style.titleText}>
                        Block {currentBlockIndex + 1} / {workout.blocks.length}
                    </Text>
                    <Text style = {style.titleText}>
                        Set {currentSetIndex + 1} / {currentBlock.sets}
                    </Text>
                    <Text style = {style.titleText}>{currentSub.label}</Text>
                    <Text style = {style.titleText}>{formatDuration(timeLeft)}</Text>
                </>
                ) : (
                    <Text style={style.titleText}>No sub-blocks in current block.</Text>
                )
            ) : (
                <Text style={style.titleText}>Workout Complete!</Text>
            )}
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    ...useStyles(theme)
})
