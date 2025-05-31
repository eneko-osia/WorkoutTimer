import { TimerBlockData } from '../types/timer';

export type RootStackParamList = {
    Home: undefined;
    Setup: undefined;
    Timer: { blocks: TimerBlockData[] };
};
