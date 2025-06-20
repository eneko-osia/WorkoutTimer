import { generateId } from '../utils/id';
import { generateRandomColor } from '../utils/color';

export type TimerSubBlock = {
    id: number;
    label: string;
    duration: number;
    color: string;
};

export type TimerBlock = {
    id: number;
    sets: number;
    subBlocks: TimerSubBlock[];
};

export type TimerPosition = {
    blockIndex: number;
    subBlockIndex: number;
    set: number;
};

export class Workout {
    static readonly kMinSets: number = 1;
    static readonly kMaxSets: number = 99;
    static readonly kMinDuration: number = 1
    static readonly kMaxDuration: number = 3600
    static readonly kStorageKey: string = 'workouts';

    private _id: number;
    private _name: string;
    private _blocks: TimerBlock[];

    constructor({id, name, blocks = []}: {id: number; name: string; blocks?: TimerBlock[];}) {
        this._id = id;
        this._name = name;
        this._blocks = blocks;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    set name(_name: string) {
        this._name = _name;
    }

    get blocks(): TimerBlock[] {
        return this._blocks;
    }

    set blocks(_blocks: TimerBlock[]) {
        this._blocks = _blocks;
    }

    get totalDuration(): number {
        return this._blocks.reduce((acc, block) => {
            return acc + (block.subBlocks.reduce((sum, subBlock) => { return (sum + subBlock.duration) }, 0) * block.sets);
        }, 0);
    }

    addBlock(block: Omit<TimerBlock, 'id'>): number {
        const id: number = generateId();
        this._blocks.push({...block, id: id});
        return id;
    }

    addSubBlock(blockId: number, subBlock: Omit<TimerSubBlock, 'id'>): number {
        const block = this._blocks.find((b) => b.id === blockId);
        if (block) {
            const id: number = generateId();
            block.subBlocks.push({...subBlock, id: id})
            return id;
        }
        return 0;
    }

    createBlock(sets: number = 1): number {
        return this.addBlock({
            sets: sets,
            subBlocks: []
        });
    };

    createSubBlock(blockId: number, label: string, duration: number = 10): number {
        return this.addSubBlock(blockId, {
            label: label,
            duration: duration,
            color: generateRandomColor()
        });
    };

    deleteBlock(blockId: number) {
        this._blocks = this._blocks.filter((b) => b.id !== blockId);
    }

    deleteSubBlock(blockId: number, subBlockId: number) {
        const block = this._blocks.find((b) => b.id === blockId);
        if (block) {
            block.subBlocks = block.subBlocks.filter((sb) => sb.id !== subBlockId);
        }
    }

    findNextBlock(position: TimerPosition): TimerPosition | null {
        const block = this.blocks[position.blockIndex];
        if ((position.subBlockIndex + 1) < block.subBlocks.length) {
            return { blockIndex: position.blockIndex, subBlockIndex: (position.subBlockIndex + 1), set: position.set };
        } else if ((position.set + 1) <= block.sets) {
            return { blockIndex: position.blockIndex, subBlockIndex: 0, set: (position.set + 1) };
        } else if ((position.blockIndex + 1) < this.blocks.length) {
            return { blockIndex: (position.blockIndex + 1), subBlockIndex: 0, set: 1 };
        }
        return null;
    }

    findPrevBlock(position: TimerPosition): TimerPosition | null {
        const block = this.blocks[position.blockIndex];
        if ((position.subBlockIndex - 1) >= 0) {
            return { blockIndex: position.blockIndex, subBlockIndex: (position.subBlockIndex - 1), set: position.set };
        } else if ((position.set - 1) >= 1) {
            return { blockIndex: position.blockIndex, subBlockIndex: block.subBlocks.length - 1, set: (position.set - 1) };
        } else if ((position.blockIndex - 1) >= 0) {
            return { blockIndex: (position.blockIndex - 1), subBlockIndex: block.subBlocks.length - 1, set: block.sets };
        }
        return null;
    }

    getDuration(position: TimerPosition) : number {
        return this.blocks.reduce((_total, _block, _i) => {
            const _isCurrentBlock = (_i === position.blockIndex);
            const _blockTotal = _block.subBlocks.reduce((_subTotal, _subBlock, _j) => {
                return _subTotal + _subBlock.duration * ((!_isCurrentBlock) ? _block.sets : ((_j < position.subBlockIndex) ? position.set : (position.set - 1)));
            }, 0);
            return (_i <= position.blockIndex) ? (_total + _blockTotal) : _total;
        }, 0);
    }

    static fromJSON(data: any): Workout {
        return new Workout(data);
    }

    toJSON(): any {
        return {
            id: this._id,
            name: this._name,
            blocks: this._blocks,
        };
    }
}
