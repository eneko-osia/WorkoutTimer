// react imports
import AsyncStorage from '@react-native-async-storage/async-storage';

// project imports
import { Settings } from '../types/settings';
import { Workout } from '../types/workout';

// methods
export async function deleteWorkout(key: string, id: number): Promise<void> {
    const workouts = await loadWorkouts(key);
    saveWorkouts(key, workouts.filter(w => w.id !== id))
}

export async function loadSettings(key: string): Promise<Settings | null> {
    const json = await AsyncStorage.getItem(key);
    if (!json) { return null; }
    try {
        return Settings.fromJSON(JSON.parse(json));
    } catch (e) {
        console.error('Failed to parse settings:', e);
        return null;
    }
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

export async function saveSettings(key: string, settings: Settings): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(settings));
}

export async function saveWorkouts(key: string, workouts: Workout[]): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(workouts));
}
