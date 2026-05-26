import type { DistributionRow, MotivationCalculatorData, ProjectInputs, ReferenceData, TaskRow } from '../types';
import { temporal } from 'zundo';
import { create } from 'zustand';
import { createDefaultCalculatorState } from '../constants/defaultCalculatorState';
import { defaultReferenceData } from '../constants/defaultReferenceData';
import { validateCalculatorData } from '../schemas/calculatorSchemas';
import { createId } from '../utils/ids';

const defaultState = createDefaultCalculatorState();

type MotivationCalculatorActions = {
    updateProjectInput: <Key extends keyof ProjectInputs>(_key: Key, _value: ProjectInputs[Key]) => void;
    updateDistributionRow: <Key extends keyof DistributionRow>(
        _id: string,
        _key: Key,
        _value: DistributionRow[Key]
    ) => void;
    addDistributionRow: () => void;
    deleteDistributionRow: (_id: string) => void;
    updateTaskRow: <Key extends keyof TaskRow>(_id: string, _key: Key, _value: TaskRow[Key]) => void;
    addTaskRow: () => void;
    duplicateTaskRow: (_id: string) => void;
    deleteTaskRow: (_id: string) => void;
    clearTaskRows: () => void;
    updateReferenceOption: (_list: keyof ReferenceData, _index: number, _value: string) => void;
    addReferenceOption: (_list: keyof ReferenceData) => void;
    deleteReferenceOption: (_list: keyof ReferenceData, _index: number) => void;
    resetReferenceData: () => void;
    resetCalculator: () => void;
    replaceData: (_data: MotivationCalculatorData) => void;
};

export type MotivationCalculatorState = MotivationCalculatorData & MotivationCalculatorActions;

const sanitizeImportedData = (data: MotivationCalculatorData): MotivationCalculatorData => {
    return {
        projectInputs: data.projectInputs,
        distributionRows: data.distributionRows.map((row) => {
            return { ...row, id: row.id || createId('distribution') };
        }),
        taskRows: data.taskRows.slice(0, 100).map((row) => {
            return { ...row, id: row.id || createId('task') };
        }),
        referenceData: data.referenceData,
    };
};

export const useCalculatorStore = create<MotivationCalculatorState>()(
    temporal(
        (set) => {
            return {
                ...defaultState,
                updateProjectInput: (key, value) => {
                    set((state) => {
                        return { projectInputs: { ...state.projectInputs, [key]: value } };
                    });
                },
                updateDistributionRow: (id, key, value) => {
                    set((state) => {
                        return {
                            distributionRows: state.distributionRows.map((row) => {
                                return row.id === id ? { ...row, [key]: value } : row;
                            }),
                        };
                    });
                },
                addDistributionRow: () => {
                    set((state) => {
                        return {
                            distributionRows: [
                                ...state.distributionRows,
                                {
                                    id: createId('distribution'),
                                    department: state.referenceData.departments[0] ?? '',
                                    percentage: 0,
                                },
                            ],
                        };
                    });
                },
                deleteDistributionRow: (id) => {
                    set((state) => {
                        return {
                            distributionRows: state.distributionRows.filter((row) => {
                                return row.id !== id;
                            }),
                        };
                    });
                },
                updateTaskRow: (id, key, value) => {
                    set((state) => {
                        return {
                            taskRows: state.taskRows.map((row) => {
                                return row.id === id ? { ...row, [key]: value } : row;
                            }),
                        };
                    });
                },
                addTaskRow: () => {
                    set((state) => {
                        if (state.taskRows.length >= 100) {
                            return state;
                        }

                        return {
                            taskRows: [
                                ...state.taskRows,
                                {
                                    id: createId('task'),
                                    stageRole: state.referenceData.stageRoles[0] ?? null,
                                    comment: '',
                                    performer: '',
                                    department: state.referenceData.departments[0] ?? null,
                                },
                            ],
                        };
                    });
                },
                duplicateTaskRow: (id) => {
                    set((state) => {
                        if (state.taskRows.length >= 100) {
                            return state;
                        }

                        const rowIndex = state.taskRows.findIndex((row) => {
                            return row.id === id;
                        });

                        if (rowIndex < 0) {
                            return state;
                        }

                        const nextRows = [...state.taskRows];
                        nextRows.splice(rowIndex + 1, 0, { ...state.taskRows[rowIndex], id: createId('task') });

                        return { taskRows: nextRows };
                    });
                },
                deleteTaskRow: (id) => {
                    set((state) => {
                        return {
                            taskRows: state.taskRows.filter((row) => {
                                return row.id !== id;
                            }),
                        };
                    });
                },
                clearTaskRows: () => {
                    set({ taskRows: [] });
                },
                updateReferenceOption: (list, index, value) => {
                    set((state) => {
                        return {
                            referenceData: {
                                ...state.referenceData,
                                [list]: state.referenceData[list].map((option, optionIndex) => {
                                    return optionIndex === index ? value : option;
                                }),
                            },
                        };
                    });
                },
                addReferenceOption: (list) => {
                    set((state) => {
                        return {
                            referenceData: {
                                ...state.referenceData,
                                [list]: [...state.referenceData[list], ''],
                            },
                        };
                    });
                },
                deleteReferenceOption: (list, index) => {
                    set((state) => {
                        return {
                            referenceData: {
                                ...state.referenceData,
                                [list]: state.referenceData[list].filter((_, optionIndex) => {
                                    return optionIndex !== index;
                                }),
                            },
                        };
                    });
                },
                resetReferenceData: () => {
                    set({
                        referenceData: {
                            departments: [...defaultReferenceData.departments],
                            segments: [...defaultReferenceData.segments],
                            stageRoles: [...defaultReferenceData.stageRoles],
                        },
                    });
                },
                resetCalculator: () => {
                    set(createDefaultCalculatorState());
                    useCalculatorStore.temporal.getState().clear();
                },
                replaceData: (data) => {
                    const result = validateCalculatorData(data);

                    if (!result.success) {
                        return;
                    }

                    set(sanitizeImportedData(result.data));
                },
            };
        },
        {
            limit: 80,
            partialize: (state) => {
                return {
                    projectInputs: state.projectInputs,
                    distributionRows: state.distributionRows,
                    taskRows: state.taskRows,
                    referenceData: state.referenceData,
                };
            },
        }
    )
);

export const selectCalculatorData = (state: MotivationCalculatorState): MotivationCalculatorData => {
    return {
        projectInputs: state.projectInputs,
        distributionRows: state.distributionRows,
        taskRows: state.taskRows,
        referenceData: state.referenceData,
    };
};
