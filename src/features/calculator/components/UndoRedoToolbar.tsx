import type { TemporalState } from 'zundo';
import type { MotivationCalculatorData } from '../types';
import { Button, HelpTooltip } from '@/shared/ui';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { useCalculatorStore } from '../store/calculatorStore';
import s from './calculator.module.css';

const useTemporalStore = <T,>(selector: (_state: TemporalState<MotivationCalculatorData>) => T) => {
    return useStoreWithEqualityFn(useCalculatorStore.temporal, selector);
};

export const UndoRedoToolbar = () => {
    const undo = useTemporalStore((state) => {
        return state.undo;
    });
    const redo = useTemporalStore((state) => {
        return state.redo;
    });
    const clear = useTemporalStore((state) => {
        return state.clear;
    });
    const pastCount = useTemporalStore((state) => {
        return state.pastStates.length;
    });
    const futureCount = useTemporalStore((state) => {
        return state.futureStates.length;
    });

    return (
        <div className={s.toolbar}>
            <HelpTooltip label="Скасувати останню зміну">
                <Button
                    disabled={pastCount === 0}
                    onClick={() => {
                        return undo();
                    }}
                >
                    Undo
                </Button>
            </HelpTooltip>
            <HelpTooltip label="Повернути скасовану зміну">
                <Button
                    disabled={futureCount === 0}
                    onClick={() => {
                        return redo();
                    }}
                >
                    Redo
                </Button>
            </HelpTooltip>
            <Button
                variant="secondary"
                onClick={() => {
                    return clear();
                }}
            >
                Clear history
            </Button>
        </div>
    );
};
