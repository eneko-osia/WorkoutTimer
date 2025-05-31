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

    const { blocks } = route.params;
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [currentSubIndex, setCurrentSubIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timer = useRef<NodeJS.Timeout>(null);

    const currentBlock = blocks[currentBlockIndex];
    const currentSub = currentBlock.subBlocks[currentSubIndex];

    // Initialize timeLeft when sub changes
    useEffect(() => {
        setTimeLeft(currentSub.duration);
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

        const block = blocks[currentBlockIndex];
        const isLastSub = currentSubIndex === block.subBlocks.length - 1;
        const isLastSet = currentSetIndex === block.sets - 1;
        const isLastBlock = currentBlockIndex === blocks.length - 1;

        if (!isLastSub) {
            setCurrentSubIndex((i) => i + 1);
        } else if (!isLastSet) {
            setCurrentSubIndex(0);
            setCurrentSetIndex((s) => s + 1);
        } else if (!isLastBlock) {
            setCurrentBlockIndex((b) => b + 1);
            setCurrentSetIndex(0);
            setCurrentSubIndex(0);
        } else {
            setIsRunning(false); // Workout finished
        }
    };

    return (
        <View style={style.container}>
        {isRunning ? (
            <>
            <Text style={style.titleText}>Block {currentBlockIndex + 1}</Text>
            <Text style={style.titleText}>Set {currentSetIndex + 1} / {currentBlock.sets}</Text>
            <Text style={style.titleText}>{currentSub.label}</Text>
            <Text style={style.titleText}>{formatDuration(timeLeft)}</Text>
            </>
        ) : (
            <Text style={style.titleText}>Workout Complete!</Text>
        )}
        </View>
    );
}

const style = StyleSheet.create({
    ...useStyles(theme)
})
