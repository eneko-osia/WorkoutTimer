import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TimerBlockProps {
    title: string;
    time: string;
    sets: number;
    color: string;
}

export const TimerBlock = ({ title, time, sets, color }: TimerBlockProps) => {
    return (
        <View style={[styles.blockContainer, { backgroundColor: color }]}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>

        <View style={styles.setRow}>
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>-</Text></TouchableOpacity>
            <Text style={styles.sets}>{sets}</Text>
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>+</Text></TouchableOpacity>
        </View>

        <View style={styles.timeRow}>
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>-</Text></TouchableOpacity>
            <Text style={styles.time}>{time}</Text>
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>+</Text></TouchableOpacity>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    blockContainer: {
        borderRadius: 12,
        marginVertical: 10,
        padding: 16,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    setRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8,
    },
    timeRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 2
    },
    sets: {
        color: '#FFFFFF',
        fontSize: 24,
        marginHorizontal: 40,
        textAlign: 'center',
        width: 80,
    },
    time: {
        color: '#FFFFFF',
        fontSize: 24,
        marginHorizontal: 40,
        textAlign: 'center',
        width: 80,
    },
    button: {
        backgroundColor: '#333333',
        borderRadius: 6,
        padding: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
