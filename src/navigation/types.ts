import { Workout } from '../types/workout';

export type RootStackParamList = {
    Home: undefined;
    Settings: undefined;
    Setup: { workout: Workout, pendingSave: boolean };
    Timer: { workout: Workout };
};
