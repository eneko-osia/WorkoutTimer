export type TimerSubBlockData = {
    id: string;
    label: string;
    duration: number;
};

export type TimerBlockData = {
    id: string;
    sets: number;
    subBlocks: TimerSubBlockData[];
};
