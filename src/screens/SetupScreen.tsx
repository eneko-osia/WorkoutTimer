import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setup'>;

export default function SetupScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [workTime, setWorkTime] = useState('30');
    const [restTime, setRestTime] = useState('15');
    const [sets, setSets] = useState('3');

    return (
        <View style={styles.container}>
        <Text style={styles.header}>Workout Setup</Text>

        <Text style={styles.label}>Work Time (sec)</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={workTime}
            onChangeText={setWorkTime}
        />

        <Text style={styles.label}>Rest Time (sec)</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={restTime}
            onChangeText={setRestTime}
        />

        <Text style={styles.label}>Number of Sets</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={sets}
            onChangeText={setSets}
        />

        <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('Home')}
        >
            <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    header: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginTop: 16,
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#1f1f1f',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
    },
    startButton: {
        backgroundColor: '#00C897',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 32,
    },
    startButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    });
