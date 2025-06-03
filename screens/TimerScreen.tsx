// react imports
import React, {
    RefObject,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Audio } from 'expo-av';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useKeepAwake } from 'expo-keep-awake';

// project imports
import { formatDuration } from '../utils/format';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../styles/theme';
import { useStyles } from '../styles/common';

// type definitions
type SoundRef = RefObject<Audio.Sound | null>;
type TimerScreenRouteProp = RouteProp<RootStackParamList, 'Timer'>;

// screen
export default function TimerScreen() {
    // hooks
    const beepLongSound = useRef<Audio.Sound | null>(null);
    const beepSound = useRef<Audio.Sound | null>(null);
    const route = useRoute<TimerScreenRouteProp>();
    useKeepAwake();

    // attributes
    const [ blockIndex, setBlockIndex ]         = useState(0);
    const [ elapsedTime, setElapsedTime ]       = useState(0);
    const [ isRunning, setIsRunning ]           = useState(true);
    const [ setsIndex, setSetsIndex ]           = useState(0);
    const [ subBlockIndex, setSubBlockIndex ]   = useState(0);
    const [ timeLeft, setTimeLeft ]             = useState(0);
    const { workout }                           = route.params;
    const block                                 = workout.blocks?.[blockIndex] ?? null;
    const subBlock                              = block?.subBlocks?.[subBlockIndex] ?? null;
    const timer                                 = useRef<NodeJS.Timeout>(null);

    // effects
    useEffect(() => {
        const first = findNextValidBlock(0);
        if (first) {
            setBlockIndex(first.blockIndex);
            setSubBlockIndex(first.subIndex);
            setSetsIndex(0);
            setIsRunning(true);
            setTimeLeft(workout.blocks[first.blockIndex].subBlocks[first.subIndex].duration);
        } else {
            setIsRunning(false); // No valid blocks
        }
    }, []);

    useEffect(() => {
        const loadSound = async (asset: number, soundRef: SoundRef) => {
            const { sound: loadedSound } = await Audio.Sound.createAsync(asset);
            soundRef.current = loadedSound;
        };
        loadSound(require('../assets/sounds/beep.wav'), beepSound);
        loadSound(require('../assets/sounds/beep_long.wav'), beepLongSound);

        return () => {
            beepLongSound.current?.unloadAsync();
            beepSound.current?.unloadAsync();
        };
    }, []);

    useEffect(() => {
        if (subBlock?.duration != null) {
            setTimeLeft(subBlock.duration);
        } else {
            console.warn('subBlock is undefined — skipping setTimeLeft');
        }
    }, [ blockIndex, subBlockIndex, setsIndex ]);

    useEffect(() => {
        if (!isRunning) { return; }

        timer.current = setInterval(() => {
            setElapsedTime((prev) => { return prev + 1});
            setTimeLeft((prev) => {
                if (prev > 1) { return prev - 1; }
                playSound(beepLongSound);
                handleAdvance();
                return 0;
            });
        }, 1000);

        return () => clearInterval(timer.current!);
    }, [ isRunning, blockIndex, subBlockIndex, setsIndex ]);

    useEffect(() => {
        if (timeLeft <= 3) {
            playSound(beepSound);
        }
    }, [ timeLeft ]);

    // methods
    const handleAdvance = () => {
        clearInterval(timer.current!);
        goToNext()
    };

    function goToNext() {
        const block = workout.blocks[blockIndex];
        const subBlocks = block?.subBlocks ?? [];

        if (subBlockIndex + 1 < subBlocks.length) {
            // Move to next sub-block in the same set
            setSubBlockIndex(subBlockIndex + 1);
            setTimeLeft(subBlocks[subBlockIndex + 1].duration);
        } else if (setsIndex + 1 < block.sets) {
            // Loop back to first sub-block in next set
            setSubBlockIndex(0);
            setSetsIndex(setsIndex + 1);
            setTimeLeft(subBlocks[0].duration);
        } else {
            // Move to next block
            const next = findNextValidBlock(blockIndex + 1);
            if (next) {
                setBlockIndex(next.blockIndex);
                setSubBlockIndex(next.subIndex);
                setSetsIndex(0);
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

    const playSound = async (soundRef: SoundRef) => {
        try {
            await soundRef.current?.setPositionAsync(0);
            await soundRef.current?.playAsync();
            // await sound.current?.replayAsync();
        } catch (err) {
            console.warn('Beep failed:', err);
        }
    };

    // jsx
    return (
        <View style = { [ style.primary, style.margin, style.padding, style.border, style.outline, style.flex1 ] }>
            <View style = { [ style.secondary, style.marginTop, style.marginHorizontal, style.padding, style.row, style.border, style.outline ] }>
                <Text style = { [ style.text, style.normal, style.left, style.flex1 ] } numberOfLines = { 1 }>
                    { workout.name }
                </Text>
                <Text style = { [ style.text, style.normal, style.right ] } numberOfLines = { 1 }>
                    { formatDuration(elapsedTime) + ' / ' + formatDuration(workout.totalDuration) }
                </Text>
            </View>
            {!isRunning ? (
                <View style = { [ style.secondary, style.margin, style.padding, style.border, style.outline, style.flex1 ] }>
                    <View style = { [ style.tertiary, style.padding, style.middle, style.border, style.outline, style.flex1 ] }>
                        <Text style = { [ style.text, style.xlarge, style.center] }>
                            Workout Completed!
                        </Text>
                    </View>
                </View>
            ) : (
                <View style = { [ style.secondary, style.margin, style.padding, style.border, style.outline, style.flex1 ] }>
                    <View style = { [ style.tertiary, style.padding, style.border, style.outline ] }>
                        <Text style = { [ style.text, style.large, style.center ] } numberOfLines = { 1 }>
                            Set {setsIndex + 1} / {block.sets}
                        </Text>
                    </View>
                    <View style = { [ style.tertiary, style.marginTop, style.padding, style.middle, style.border, style.outline, style.flex1 ] }>
                        <Text style = { [ style.text, style.xlarge, style.center ] } numberOfLines = { 1 }>
                            { formatDuration(timeLeft) }
                        </Text>
                    </View>
                    <View style = { [ style.tertiary, style.marginTop, style.padding, style.border, style.outline ] }>
                        <Text style = { [ style.text, style.large, style.center ] } numberOfLines = { 1 }>
                            { subBlock.label }
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const style = StyleSheet.create({
    ...useStyles(theme),
    middle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
})
