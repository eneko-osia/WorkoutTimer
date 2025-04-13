// src/Timer.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Timer = () => {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [intervalType, setIntervalType] = useState<'work' | 'rest'>('work');

    const [workSeconds, setWorkSeconds] = useState(60);

    const startPauseTimer = () => {
        setIsRunning(prevState => !prevState);
    };

    const stopTimer = () => {
        setIsRunning(false);
        setSeconds(0);
        setWorkSeconds(60);
    };

    const toggleInterval = () => {
        setIntervalType(intervalType === 'work' ? 'rest' : 'work');
        setSeconds(0); // Reset the seconds when toggling intervals
    };

    useEffect(() => {
        let timerId: NodeJS.Timeout | null = null;

        if (isRunning) {
            timerId = setInterval(() => {
                setSeconds(prev => prev + 1);
                setWorkSeconds(prev => prev - 1)
            }, 1000);
        } else if (!isRunning && timerId) {
            clearInterval(timerId);
        }

        return () => {
        if (timerId) clearInterval(timerId); // Cleanup on component unmount
        };
    }, [isRunning]);

    const formatTime = (sec: number) => {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Workout Timer</Text>
        <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
            {intervalType === 'work' ? 'Work' : 'Rest'}
            </Text>
            <Text style={styles.timeDisplay}>{formatTime(workSeconds)}</Text>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, isRunning ? styles.pauseButton : styles.startButton]} onPress={startPauseTimer}>
            <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopTimer}>
            <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.toggleButton]} onPress={toggleInterval}>
            <Text style={styles.buttonText}>Toggle</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    timerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        width: '100%', // Ensure it fills the width for proper layout
    },
    timerText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#555',
        marginBottom: 10,
    },
    timeDisplay: {
        fontSize: 30, // Increased font size to make it more visible
        fontWeight: 'bold',
        color: '#333',
        borderWidth: 5,
        borderColor: '#333',
        borderRadius: 100,
        padding: 30,
        width: 180, // Increased size to fit the timer data
        height: 180,
        textAlign: 'center',
        lineHeight: 120, // Adjusted to vertically center the text
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly', // Ensures buttons are spaced out evenly
        width: '100%',
        marginTop: 20, // Added some margin between the timer and buttons
    },
    button: {
        padding: 10,
        borderRadius: 10,
        margin: 10,
        width: 80,
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#4CAF50',
    },
    pauseButton: {
        backgroundColor: '#FFC107',
    },
    stopButton: {
        backgroundColor: '#F44336',
    },
    toggleButton: {
        backgroundColor: '#2196F3',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default Timer;
