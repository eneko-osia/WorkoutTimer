// react imports
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
    const style = StyleSheet.create({
        ...useStyles(theme),
        middle: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    })

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
    const moveNextBlock = (_position: TimerPosition) => {
        setIsPaused(true);
        const _next = workout.findNextBlock(_position);
        if (_next) {
            setState(_next);
            update();
        }
    }

    const movePrevBlock = (_position: TimerPosition) => {
        setIsPaused(true);
        const _prev = workout.findPrevBlock(_position);
        if (_prev) {
            setState(_prev);
            update();
        }
    }

    const update = () => {
        forceUpdate((_prev) => !_prev);
    }

    // jsx
    return (
        <View style = { [ style.containerPrimary ] }>
            <View style = { [ style.containerSecondary ] }>
                <View style = { [ style.secondary, style.row ] }>
                    <Text style = { [ style.text, style.normal, style.bold, style.left, style.flex1 ] } numberOfLines = { 1 }>
                        { workout.name }
                    </Text>
                    <Text style = { [ style.text, style.normal, style.bold, style.right ] } numberOfLines = { 1 }>
                        { formatDuration(elapsedTotalRef.current) + ' / ' + formatDuration(workout.totalDuration) }
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
                    <View style = { [ style.tertiary, style.marginTop, style.padding, style.border, style.outlineThick ] }>
                        <Text style = { [ style.text, style.large, style.center ] } numberOfLines = { 1 }>
                            { workout.blocks[positionRef.current.blockIndex].subBlocks[positionRef.current.subBlockIndex].label }
                        </Text>
                        <View style = { [ style.row, style.marginTop, style.border ] }>
                            <TouchableOpacity style = { [ style.quaternary, style.padding, style.button, (prevRef.current == null ?  style.disabled : {}), style.border, style.outline ] }
                                disabled = { prevRef.current == null }
                                onPress = { () => { movePrevBlock(positionRef.current!); }}
                            >
                                <MaterialIcons name = 'skip-previous' size = { theme.sizes.md }/>
                            </TouchableOpacity>
                            <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, style.border, style.outline, style.flex1 ] }
                                onPress = { () => { setIsPaused(!isPaused); }}
                            >
                                <MaterialIcons name = {isPaused ? 'play-arrow' : 'pause'} size = { theme.sizes.md }/>
                            </TouchableOpacity>
                            <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, (nextRef.current == null ?  style.disabled : {}), style.border, style.outline ] }
                                disabled = { nextRef.current == null }
                                onPress = { () => { moveNextBlock(positionRef.current!); }}
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
                    <View style = { [ style.tertiary, style.marginVertical, style.padding, style.border, style.outlineThick ] }>
                        <Text style = { [ style.text, style.large, style.center ] } numberOfLines = { 1 }>
                            Set {positionRef.current.set} / {workout.blocks[positionRef.current.blockIndex].sets}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}
