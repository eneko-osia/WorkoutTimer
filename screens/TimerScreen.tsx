import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TimerBlockData } from '../types/timer';
import { RouteProp, useRoute } from '@react-navigation/native';

type TimerScreenRouteProp = RouteProp<{ Timer: { blocks: TimerBlockData[] } }, 'Timer'>;

export default function TimerScreen() {
  const route = useRoute<TimerScreenRouteProp>();
  const { blocks } = route.params;

  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentSubIndex, setCurrentSubIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentBlock = blocks[currentBlockIndex];
  const currentSub = currentBlock.subBlocks[currentSubIndex];

  // Initialize timeLeft when sub changes
  useEffect(() => {
    setTimeLeft(currentSub.duration);
  }, [currentSubIndex, currentSetIndex, currentBlockIndex]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;
        handleAdvance();
        return 0;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, currentBlockIndex, currentSetIndex, currentSubIndex]);

  const handleAdvance = () => {
    clearInterval(intervalRef.current!);

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
    <View style={styles.container}>
      {isRunning ? (
        <>
          <Text style={styles.title}>Block {currentBlockIndex + 1}</Text>
          <Text style={styles.subtitle}>Set {currentSetIndex + 1} / {currentBlock.sets}</Text>
          <Text style={styles.label}>{currentSub.label}</Text>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        </>
      ) : (
        <Text style={styles.finished}>Workout Complete!</Text>
      )}
    </View>
  );
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 20, color: '#ccc', marginBottom: 16 },
  label: { fontSize: 24, color: '#0ff', marginBottom: 16 },
  timer: { fontSize: 64, color: '#fff', fontVariant: ['tabular-nums'] },
  finished: { fontSize: 28, color: '#0f0' },
});
