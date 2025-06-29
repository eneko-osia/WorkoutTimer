// react imports
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import IdleTimerManager from 'react-native-idle-timer';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import SoundPlayer from 'react-native-sound-player';

// project imports
import { formatDuration } from '../utils/format';
import { RootStackParamList } from '../navigation/types';
import { TimerPosition } from '../types/workout'
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
    const style = useMemo(() => StyleSheet.create({
        ...useStyles(theme),
        middle: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    }), [ theme ]);

    // attributes
    const { workout }                           = route.params;
    const [ , forceUpdate ]                     = useState<boolean>(false);
    const [ isPaused,       setIsPaused ]       = useState<boolean>(false);
    const [ isRunning,      setIsRunning ]      = useState<boolean>(true);
    const elapsedRef                            = useRef<number>(0);
    const elapsedTotalRef                       = useRef<number>(0);
    const nextRef                               = useRef<TimerPosition | null>(null);
    const positionRef                           = useRef<TimerPosition>({ blockIndex: 0, subBlockIndex: 0, set: 1});
    const prevRef                               = useRef<TimerPosition | null>(null);
    const timeLeftRef                           = useRef<number>(0);
    const timerRef                              = useRef<NodeJS.Timeout | null>(null);

    // callbacks
    const setState = useCallback((_position: TimerPosition, _elapsed: number = 0) => {
        // set timer position
        positionRef.current = _position;

        // set elapsed
        elapsedRef.current = _elapsed;
        elapsedTotalRef.current = (_elapsed + workout.getDuration(_position));

        // set time left
        const _subBlock = workout.blocks[_position.blockIndex].subBlocks[_position.subBlockIndex];
        timeLeftRef.current = (_subBlock.duration - _elapsed);

        // find prev and next timer positions
        nextRef.current = workout.findNextBlock(_position);
        prevRef.current = workout.findPrevBlock(_position);

        // update
        update();
    }, [ workout ]);

    // effects
    useEffect(() => {
        // keep awake
        IdleTimerManager.setIdleTimerDisabled(true);

        // load sound files
        SoundPlayer.loadSoundFile('beep_long', 'wav');
        SoundPlayer.loadSoundFile('beep', 'wav');

        return () => {
            IdleTimerManager.setIdleTimerDisabled(false);
        }
    }, []);

    useEffect(() => {
        if (isPaused) { return; }

        // initialize state
        let _block = workout.blocks[positionRef.current.blockIndex];
        let _subBlock = _block.subBlocks[positionRef.current.subBlockIndex];
        let _elapsedTotal = elapsedTotalRef.current - elapsedRef.current;
        let _lastBeepSound = Math.max(0, (_subBlock.duration - elapsedRef.current));;
        let _start = (Date.now() - (elapsedRef.current * 1000));
        setState(positionRef.current, elapsedRef.current);

        timerRef.current = setInterval(() => {
            // calculate elapsed time
            const _millisecondElapsed = Math.max(0, Date.now() - _start);
            const _secondsElapsed = Math.floor(_millisecondElapsed / 1000);
            const _millisecondLeft = Math.max(0, (_subBlock.duration * 1000) - _millisecondElapsed);
            const _secondsLeft = Math.ceil(_millisecondLeft / 1000);

            // update state
            elapsedRef.current = _secondsElapsed;
            elapsedTotalRef.current = _elapsedTotal + _secondsElapsed;
            timeLeftRef.current = _secondsLeft;
            update();

            // play beep sound effect only in the last 3 seconds
            if ((_secondsLeft >= 1 && _secondsLeft <= 3) && (_lastBeepSound !== _secondsLeft)) {
                _lastBeepSound = _secondsLeft;
                SoundPlayer.playSoundFile('beep', 'wav');
            }

            // timer block has finished
            if (_millisecondLeft === 0) {
                SoundPlayer.playSoundFile('beep_long', 'wav');
                if (nextRef.current) {
                    // set next timer block
                    positionRef.current = nextRef.current;

                    // initialize state
                    _block = workout.blocks[positionRef.current.blockIndex];
                    _subBlock = _block.subBlocks[positionRef.current.subBlockIndex];
                    _elapsedTotal = _elapsedTotal + _secondsElapsed;
                    _lastBeepSound = 0;
                    _start = Date.now();
                    setState(positionRef.current);
                } else {
                    setIsRunning(false);
                    clearTimeout(timerRef.current!);
                }
            }
        }, 100);

        return () => {
            clearTimeout(timerRef.current!);
        }
    }, [ workout, isPaused, setState ]);

    // methods
    const moveToPrevBlock = useCallback(() => {
        setIsPaused(true);
        if (elapsedRef.current !== 0) {
            setState(positionRef.current);
        } else {
            if (prevRef.current) {
                setState(prevRef.current);
            }
        }
    }, [ setState ]);

    const moveToNextBlock = useCallback(() => {
        setIsPaused(true);
        if (nextRef.current) {
            setState(nextRef.current);
        }
        else {
            setIsRunning(false);
        }
    }, [ setState ]);

    const hasPrevBlock = useCallback(() => {
        return ((prevRef.current != null) || (elapsedRef.current !== 0));
    }, []);

    const hasNextBlock = useCallback(() => {
        return ((nextRef.current != null) || (isRunning === true));
    }, [ isRunning ]);

    const update = useCallback(() => {
        forceUpdate((_prev) => !_prev);
    }, []);

    // jsx
    return (
        <View style = { [ style.containerPrimary ] }>
            <View style = { [ style.containerSecondary, style.marginTop ] }>
                <View style = { [ style.row ] }>
                    <Text style = { [ style.text, style.normal, style.bold, style.left, style.flex1 ] } numberOfLines = { 1 }>
                        { workout.name }
                    </Text>
                    <Text style = { [ style.text, style.normal, style.bold, style.right ] } numberOfLines = { 1 }>
                        { formatDuration(elapsedTotalRef.current) + ' / ' + formatDuration(workout.totalDuration) }
                    </Text>
                </View>
            </View>
            {!isRunning ? (
                <View style = { [ style.containerSecondary, style.marginVertical, style.flex1 ] }>
                    <View style = { [ style.containerTertiary, style.middle, style.flex1 ] }>
                        <MaterialIcons name = 'done' size = { theme.sizes.xl }/>
                    </View>
                </View>
            ) : (
                <View style = { [ style.containerSecondary, style.marginVertical, style.flex1 ] }>
                    <View style = { [ style.containerTertiary ] }>
                        <Text style = { [ style.text, style.large, style.center ] } numberOfLines = { 1 }>
                            { workout.blocks[positionRef.current.blockIndex].subBlocks[positionRef.current.subBlockIndex].label }
                        </Text>
                        <View style = { [ style.row, style.marginTop, style.border ] }>
                            <TouchableOpacity style = { [ style.quaternary, style.padding, style.button, (!hasPrevBlock() ?  style.disabled : {}), style.border, style.outline ] }
                                disabled = { !hasPrevBlock() }
                                onPress = { () => { moveToPrevBlock(); }}
                            >
                                <MaterialIcons name = 'skip-previous' size = { theme.sizes.md }/>
                            </TouchableOpacity>
                            <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, style.border, style.outline, style.flex1 ] }
                                onPress = { () => { setIsPaused(!isPaused); }}
                            >
                                <MaterialIcons name = {isPaused ? 'play-arrow' : 'pause'} size = { theme.sizes.md }/>
                            </TouchableOpacity>
                            <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, (!hasNextBlock() ?  style.disabled : {}), style.border, style.outline ] }
                                disabled = { !hasNextBlock() }
                                onPress = { () => { moveToNextBlock(); }}
                            >
                                <MaterialIcons name = 'skip-next' size = { theme.sizes.md }/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style = { [ { backgroundColor: workout.blocks[positionRef.current.blockIndex].subBlocks[positionRef.current.subBlockIndex].color }, style.middle, style.marginTop, style.border, style.outlineThick, style.flex1 ] }>
                        <Text style = { [ style.text, style.xxlarge, style.bold, style.center ] } numberOfLines = { 1 }>
                            { formatDuration(timeLeftRef.current) }
                        </Text>
                    </View>
                    <View style = { [ style.containerTertiary, style.marginTop ] }>
                        <Text style = { [ style.text, style.large, style.center ] } numberOfLines = { 1 }>
                            Set {positionRef.current.set} / {workout.blocks[positionRef.current.blockIndex].sets}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}
