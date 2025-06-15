// react imports
import AsyncStorage from '@react-native-async-storage/async-storage';

// project imports
import { Workout } from '../types/workout';

// methods
export async function deleteWorkout(key: string, id: number): Promise<void> {
    const workouts = await loadWorkouts(key);
    saveWorkouts(key, workouts.filter(w => w.id !== id))
}

export async function loadWorkouts(key: string): Promise<Workout[]> {
    const json = await AsyncStorage.getItem(key);
    if (!json) { return []; }
    try {
        const parsed = JSON.parse(json);
        return parsed.map((data: any) => Workout.fromJSON(data));
    } catch (e) {
        console.error('Failed to parse workouts:', e);
        return [];
    }
}

export async function saveWorkout(key: string, workout: Workout): Promise<void> {
    const workouts = await loadWorkouts(key);
    const found = workouts.find((w) => w.id === workout.id);
    if (found) {
        Object.assign(found, workout);
        saveWorkouts(key, workouts);
    }
    else {
        saveWorkouts(key, [...workouts, workout])
    }
}

export async function saveWorkouts(key: string, workouts: Workout[]): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(workouts));
}
