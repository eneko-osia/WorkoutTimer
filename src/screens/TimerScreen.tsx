// react imports
import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
// import { AudioPlayer, useAudioPlayer } from 'expo-audio';
import { RouteProp, useRoute } from '@react-navigation/native';
import IdleTimerManager from 'react-native-idle-timer';

// project imports
import { formatDuration } from '../utils/format';
import { RootStackParamList } from '../navigation/types';
import { TimerBlock, TimerSubBlock } from '../types/workout';
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';

// type definitions
type TimerScreenRouteProp = RouteProp<RootStackParamList, 'Timer'>;

// screen
export default function TimerScreen() {
    // hooks
    const route     = useRoute<TimerScreenRouteProp>();
    const scheme    = useColorScheme();

    // theme
    const theme = useTheme(scheme);
    const style = StyleSheet.create({
        ...useStyles(theme),
        middle: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    })

    // attributes
    const [ block,          setBlock]           = useState<TimerBlock>();
    const [ elapsedTime,    setElapsedTime ]    = useState(0);
    const [ isRunning,      setIsRunning ]      = useState(true);
    const [ sets,           setSets ]           = useState(0);
    const [ subBlock,       setSubBlock]        = useState<TimerSubBlock>();
    const [ timeLeft,       setTimeLeft ]       = useState(0);
    const { workout }                           = route.params;
    // const beepLongSound                         = useAudioPlayer(require('../assets/sounds/beep_long.wav'));
    // const beepSound                             = useAudioPlayer(require('../assets/sounds/beep.wav'));
    const timer                                 = useRef<NodeJS.Timeout | null>(null);

    // effects
    useEffect(() => {
        const setState = (blockIndex: number, subBlockIndex: number, set: number) => {
            const block = workout.blocks[blockIndex];
            const subBlock = block.subBlocks[subBlockIndex];
            setBlock(block);
            setSubBlock(subBlock);
            setSets(set);
            setTimeLeft(subBlock.duration);
        }

        IdleTimerManager.setIdleTimerDisabled(true);

        let blockIndex = 0;
        let subBlockIndex = 0;
        let set = 1;

        let lastBeepSound = 0;
        let start = Date.now();
        let totalElapsed = 0;
        setState(blockIndex, subBlockIndex, set);

        timer.current = setInterval(() => {
            const block = workout.blocks[blockIndex];
            const subBlock = block.subBlocks[subBlockIndex];

            const millisecondElapsed = Math.max(0, Date.now() - start);
            const secondsElapsed = Math.floor(millisecondElapsed / 1000);
            const millisecondLeft = Math.max(0, (subBlock.duration * 1000) - millisecondElapsed);
            const secondsLeft = Math.ceil(millisecondLeft / 1000);

            setElapsedTime(totalElapsed + secondsElapsed);
            setTimeLeft(secondsLeft);

            // play beep sound effect only in the last 3 seconds
            if ((secondsLeft >= 1 && secondsLeft <= 3) && (lastBeepSound != secondsLeft)) {
                lastBeepSound = secondsLeft;
                // playSound(beepSound);
            }

            // time block has finished
            if (millisecondLeft == 0) {
                // playSound(beepLongSound);
                const next = findNextBlock(blockIndex, subBlockIndex, set);
                if (next) {
                    blockIndex = next.blockIndex;
                    subBlockIndex = next.subBlockIndex;
                    set = next.set;

                    lastBeepSound = 0;
                    start = Date.now();
                    totalElapsed = totalElapsed + secondsElapsed;
                    setState(blockIndex, subBlockIndex, set);
                } else {
                    setIsRunning(false);
                    clearTimeout(timer.current!);
                }
            }
        }, 100);

        return () => {
            setIsRunning(false);
            clearTimeout(timer.current!);
            IdleTimerManager.setIdleTimerDisabled(false);
        }
    }, []);

    // methods

    const findNextBlock = (blockIndex: number = 0, subBlockIndex: number = -1, set: number = 1) => {
        const block = workout.blocks[blockIndex];
        if ((subBlockIndex + 1) < block.subBlocks.length) {
            return { blockIndex: blockIndex, subBlockIndex: (subBlockIndex + 1), set: set };
        } else if ((set + 1) <= block.sets) {
            return { blockIndex: blockIndex, subBlockIndex: 0, set: (set + 1) };
        } else if ((blockIndex + 1) < workout.blocks.length) {
            return { blockIndex: (blockIndex + 1), subBlockIndex: 0, set: 1 };
        }
        return null;
    }

    // const playSound = (player: AudioPlayer) => {
    //     player.seekTo(0);
    //     player.play();
    // };

    // jsx
    return (
        <View style = { [ style.containerPrimary ] }>
            <View style = { [ style.containerSecondary ] }>
                <View style = { [ style.secondary, style.row ] }>
                    <Text style = { [ style.text, style.normal, style.bold, style.left, style.flex1 ] } numberOfLines = { 1 }>
                        { workout.name }
                    </Text>
                    <Text style = { [ style.text, style.normal, style.bold, style.right ] } numberOfLines = { 1 }>
                        { formatDuration(elapsedTime) + ' / ' + formatDuration(workout.totalDuration) }
                    </Text>
                </View>
            </View>
            {!isRunning ? (
                <View style = { [ style.secondary, style.margin, style.padding, style.border, style.outlineThick, style.flex1 ] }>
                    <View style = { [ style.tertiary, style.padding, style.middle, style.border, style.outlineThick, style.flex1 ] }>
                        <Text style = { [ style.text, style.xlarge, style.bold, style.center] }>
                            Workout{'\n'}Completed
                        </Text>
                    </View>
                </View>
            ) : (
                <View style = { [ style.secondary, style.margin, style.padding, style.border, style.outlineThick, style.flex1 ] }>
                    <View style = { [ style.tertiary, style.padding, style.border, style.outlineThick ] }>
                        <Text style = { [ style.text, style.large, style.center ] } numberOfLines = { 1 }>
                            Set {sets} / {block?.sets}
                        </Text>
                    </View>
                    <View style = { [ { backgroundColor: subBlock?.color }, style.marginTop, style.padding, style.middle, style.border, style.outlineThick, style.flex1 ] }>
                        <Text style = { [ style.text, style.xlarge, style.bold, style.center ] } numberOfLines = { 1 }>
                            { formatDuration(timeLeft) }
                        </Text>
                    </View>
                    <View style = { [ style.tertiary, style.marginTop, style.padding, style.border, style.outlineThick ] }>
                        <Text style = { [ style.text, style.large, style.center ] } numberOfLines = { 1 }>
                            { subBlock?.label }
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}
