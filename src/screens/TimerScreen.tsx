// react imports
import React, { useEffect, useRef, useState } from 'react';
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
import { useStyles } from '../styles/common';
import { useTheme } from '../styles/theme';

// type definitions
type TimerPosition = { blockIndex: number; subBlockIndex: number; set: number; };
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
    const [ elapsed,        setElapsed ]        = useState(0);
    const [ elapsedTotal,   setElapsedTotal ]   = useState(0);
    const [ isPaused,       setIsPaused ]       = useState(false);
    const [ isRunning,      setIsRunning ]      = useState(true);
    const [ position,       setPosition]        = useState<TimerPosition>({ blockIndex: 0, subBlockIndex: 0, set: 1});
    const [ timeLeft,       setTimeLeft ]       = useState(0);
    const { workout }                           = route.params;
    const next                                  = useRef<TimerPosition | null>(null);
    const prev                                  = useRef<TimerPosition | null>(null);
    const timer                                 = useRef<NodeJS.Timeout | null>(null);

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
        console.log("Tick!!!!");
        if (isPaused) { return; }

        let _position = position;
        let _lastBeepSound = Math.max(0, (workout.blocks[_position.blockIndex].subBlocks[_position.subBlockIndex].duration - elapsed));;
        let _start = Date.now() - (elapsed * 1000);
        let _elapsedTotal = elapsedTotal - elapsed;

        setState(_position, elapsed);

        timer.current = setInterval(() => {
            const _block = workout.blocks[_position.blockIndex];
            const _subBlock = _block.subBlocks[_position.subBlockIndex];

            const _millisecondElapsed = Math.max(0, Date.now() - _start);
            const _secondsElapsed = Math.floor(_millisecondElapsed / 1000);
            const _millisecondLeft = Math.max(0, (_subBlock.duration * 1000) - _millisecondElapsed);
            const _secondsLeft = Math.ceil(_millisecondLeft / 1000);

            setElapsed(_secondsElapsed);
            setElapsedTotal(_elapsedTotal + _secondsElapsed);
            setTimeLeft(_secondsLeft);

            // play beep sound effect only in the last 3 seconds
            if ((_secondsLeft >= 1 && _secondsLeft <= 3) && (_lastBeepSound !== _secondsLeft)) {
                _lastBeepSound = _secondsLeft;
                SoundPlayer.playSoundFile('beep', 'wav');
            }

            // time block has finished
            if (_millisecondLeft === 0) {
                SoundPlayer.playSoundFile('beep_long', 'wav');
                if (next.current) {
                    _position = next.current;
                    _lastBeepSound = 0;
                    _start = Date.now();
                    _elapsedTotal = _elapsedTotal + _secondsElapsed;
                    setState(_position);
                } else {
                    setIsRunning(false);
                    clearTimeout(timer.current!);
                }
            }
        }, 100);

        return () => {
            console.log("clear timer");
            clearTimeout(timer.current!);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ workout, isPaused ]);

    // methods
    const findNextBlock = (_position: TimerPosition): TimerPosition | null => {
        const _block = workout.blocks[_position.blockIndex];
        if ((_position.subBlockIndex + 1) < _block.subBlocks.length) {
            return { blockIndex: _position.blockIndex, subBlockIndex: (_position.subBlockIndex + 1), set: _position.set };
        } else if ((_position.set + 1) <= _block.sets) {
            return { blockIndex: _position.blockIndex, subBlockIndex: 0, set: (_position.set + 1) };
        } else if ((_position.blockIndex + 1) < workout.blocks.length) {
            return { blockIndex: (_position.blockIndex + 1), subBlockIndex: 0, set: 1 };
        }
        return null;
    }

    const findPrevBlock = (_position: TimerPosition): TimerPosition | null => {
        const _block = workout.blocks[_position.blockIndex];
        if ((_position.subBlockIndex - 1) >= 0) {
            return { blockIndex: _position.blockIndex, subBlockIndex: (_position.subBlockIndex - 1), set: _position.set };
        } else if ((_position.set - 1) >= 1) {
            return { blockIndex: _position.blockIndex, subBlockIndex: _block.subBlocks.length - 1, set: (_position.set - 1) };
        } else if ((_position.blockIndex - 1) >= 0) {
            return { blockIndex: (_position.blockIndex - 1), subBlockIndex: _block.subBlocks.length - 1, set: _block.sets };
        }
        return null;
    }

    const moveNextBlock = (_position: TimerPosition) => {
        setIsPaused(true);
        const _next = findNextBlock(_position);
        if (_next) {
            setState(_next);
        }
    }

    const movePrevBlock = (_position: TimerPosition) => {
        setIsPaused(true);
        const _prev = findPrevBlock(_position);
        if (_prev) {
            setState(_prev);
        }
    }

    const setState = (_position: TimerPosition, _elapsed: number = 0) => {
        // set timer position
        setPosition(_position);

        // calculated total elapsed time
        let _elapsedTotal = _elapsed;
        for (let i = 0; i <= _position.blockIndex; ++i) {
            const _isCurrentBlock = (i === _position.blockIndex);
            const _block = workout.blocks[i];
            const _sets = (_isCurrentBlock ? _position.set : _block.sets);
            for (let j = 1; j <= _sets; ++j) {
                const _isCurrentSet = (j === _position.set);
                const _length = ((_isCurrentBlock && _isCurrentSet) ? _position.subBlockIndex : _block.subBlocks.length);
                for (let k = 0; k < _length; ++k) {
                    const _subBlock = _block.subBlocks[k];
                    _elapsedTotal = _elapsedTotal + _subBlock.duration;
                }
            }
        }

        // set elapsed and time left
        setElapsed(_elapsed);
        setElapsedTotal(_elapsedTotal);
        setTimeLeft(workout.blocks[_position.blockIndex].subBlocks[_position.subBlockIndex].duration - _elapsed);

        // find prev and next timer positions
        next.current = findNextBlock(_position);
        prev.current = findPrevBlock(_position);
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
                        { formatDuration(elapsedTotal) + ' / ' + formatDuration(workout.totalDuration) }
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
                            { workout.blocks[position.blockIndex].subBlocks[position.subBlockIndex].label }
                        </Text>
                        <View style = { [ style.row, style.marginTop, style.border ] }>
                            <TouchableOpacity style = { [ style.quaternary, style.padding, style.button, (prev.current == null ?  style.disabled : {}), style.border, style.outline ] }
                                disabled = { prev.current == null }
                                onPress = { () => { movePrevBlock(position); }}
                            >
                                <MaterialIcons name = 'skip-previous' size = { theme.sizes.md }/>
                            </TouchableOpacity>
                            <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, style.border, style.outline, style.flex1 ] }
                                onPress = { () => { setIsPaused(!isPaused); }}
                            >
                                <MaterialIcons name = {isPaused ? 'play-arrow' : 'pause'} size = { theme.sizes.md }/>
                            </TouchableOpacity>
                            <TouchableOpacity style = { [ style.quaternary, style.marginLeft, style.padding, style.button, (next.current == null ?  style.disabled : {}), style.border, style.outline ] }
                                disabled = { next.current == null }
                                onPress = { () => { moveNextBlock(position); }}
                            >
                                <MaterialIcons name = 'skip-next' size = { theme.sizes.md }/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style = { [ { backgroundColor: workout.blocks[position.blockIndex].subBlocks[position.subBlockIndex].color }, style.middle, style.marginTop, style.border, style.outlineThick, style.flex1 ] }>
                        <Text style = { [ style.text, style.xxlarge, style.bold, style.center ] } numberOfLines = { 1 }>
                            { formatDuration(timeLeft) }
                        </Text>
                    </View>
                    <View style = { [ style.tertiary, style.marginVertical, style.padding, style.border, style.outlineThick ] }>
                        <Text style = { [ style.text, style.large, style.center ] } numberOfLines = { 1 }>
                            Set {position.set} / {workout.blocks[position.blockIndex].sets}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}
