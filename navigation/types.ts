import { Workout } from '../types/workout';

export type RootStackParamList = {
    Home: undefined;
    Setup: undefined;
    Timer: { workout: Workout };
};
