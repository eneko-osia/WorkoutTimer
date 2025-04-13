import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TimerBlock } from '../components/TimerBlock';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
        <Text style={styles.header}>Workout Timer</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TimerBlock title="Prepare" time="00:10" sets={1} color="#6C63FF" />
            <TimerBlock title="Work" time="00:30" sets={3} color="#00C897" />
            <TimerBlock title="Rest" time="00:15" sets={3} color="#FF6B6B" />
        </ScrollView>
        <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Block</Text>
        </TouchableOpacity>
        </View>
    );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 16,
    },
    header: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    scrollContainer: {
        paddingBottom: 100,
    },
    addButton: {
        backgroundColor: '#1E88E5',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    });
