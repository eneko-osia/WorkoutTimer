import { Workout } from '../types/workout';

export type RootStackParamList = {
    Home: undefined;
    Setup: { workout: Workout };
    Timer: { workout: Workout };
};
