import type { MotivationCalculatorData } from '@/features/calculator/types';
import { useMemo, useState } from 'react';
import { ContractInputsCard } from '@/features/calculator/components/ContractInputsCard';
import { DistributionControlCard } from '@/features/calculator/components/DistributionControlCard';
import { DistributionTable } from '@/features/calculator/components/DistributionTable';
import { NetIncomeCard } from '@/features/calculator/components/NetIncomeCard';
import { PerformerSummaryTable } from '@/features/calculator/components/PerformerSummaryTable';
import { ProjectDetailsCard } from '@/features/calculator/components/ProjectDetailsCard';
import { ReferenceDataPage } from '@/features/calculator/components/ReferenceDataPage';
import { TaskRowsTable } from '@/features/calculator/components/TaskRowsTable';
import { UndoRedoToolbar } from '@/features/calculator/components/UndoRedoToolbar';
import { calculatorDataSchema, validateCalculatorData } from '@/features/calculator/schemas/calculatorSchemas';
import { useCalculatorStore } from '@/features/calculator/store/calculatorStore';
import { selectDerivedCalculatorValues } from '@/features/calculator/store/selectors';
import { Button, Card, TabsList, TabsPanel, TabsRoot, TabsTab } from '@/shared/ui';
import { useDebouncedEffect, useLocalStorageValue, useMountEffect } from '@react-hookz/web';
import s from '@/features/calculator/components/calculator.module.css';

const STORAGE_KEY = 'motivation-calculator-state';

const parseStoredData = (value: string | null) => {
    if (!value) {
        return null;
    }

    try {
        const parsedValue: unknown = JSON.parse(value);
        const validationResult = validateCalculatorData(parsedValue);

        return validationResult.success ? validationResult.data : null;
    } catch {
        return null;
    }
};

const stringifyStoredData = (data: MotivationCalculatorData | null) => {
    return data ? JSON.stringify(data) : null;
};

export const App = () => {
    const projectInputs = useCalculatorStore((state) => {
        return state.projectInputs;
    });
    const distributionRows = useCalculatorStore((state) => {
        return state.distributionRows;
    });
    const taskRows = useCalculatorStore((state) => {
        return state.taskRows;
    });
    const referenceData = useCalculatorStore((state) => {
        return state.referenceData;
    });
    const replaceData = useCalculatorStore((state) => {
        return state.replaceData;
    });
    const resetCalculator = useCalculatorStore((state) => {
        return state.resetCalculator;
    });
    const [isHydrated, setIsHydrated] = useState(false);
    const [jsonBuffer, setJsonBuffer] = useState('');
    const [importMessage, setImportMessage] = useState('');
    const storedState = useLocalStorageValue<MotivationCalculatorData | null>(STORAGE_KEY, {
        defaultValue: null,
        parse: parseStoredData,
        stringify: stringifyStoredData,
    });
    const setStoredState = storedState.set;
    const data = useMemo(() => {
        return {
            projectInputs,
            distributionRows,
            taskRows,
            referenceData,
        };
    }, [distributionRows, projectInputs, referenceData, taskRows]);
    const derivedValues = useMemo(() => {
        return selectDerivedCalculatorValues(data);
    }, [data]);
    const validationResult = calculatorDataSchema.safeParse(data);

    useMountEffect(() => {
        if (storedState.value) {
            replaceData(storedState.value);
        }

        setIsHydrated(true);
    });

    useDebouncedEffect(
        () => {
            if (isHydrated) {
                setStoredState(data);
            }
        },
        [data, isHydrated, setStoredState],
        500
    );

    const exportJson = () => {
        setJsonBuffer(JSON.stringify(data, null, 2));
        setImportMessage('Експортовано поточний стан у JSON.');
    };

    const importJson = () => {
        try {
            const parsedValue: unknown = JSON.parse(jsonBuffer);
            const result = validateCalculatorData(parsedValue);

            if (!result.success) {
                setImportMessage(
                    result.error.issues
                        .map((issue) => {
                            return issue.message;
                        })
                        .join('; ')
                );
                return;
            }

            replaceData(result.data);
            setImportMessage('Імпортовано стан калькулятора.');
        } catch {
            setImportMessage('JSON має некоректний формат.');
        }
    };

    return (
        <main className={s.page}>
            <div className={s.shell}>
                <header className={s.header}>
                    <h1 className={s.title}>РОЗРАХУНОК МОТИВАЦІЇ</h1>
                    <UndoRedoToolbar />
                </header>

                <TabsRoot defaultValue="calculator">
                    <TabsList>
                        <TabsTab value="calculator">Калькулятор</TabsTab>
                        <TabsTab value="references">Випадаючий список</TabsTab>
                    </TabsList>

                    <TabsPanel value="calculator">
                        <div className={s.grid}>
                            <div className={s.span8}>
                                <ProjectDetailsCard />
                            </div>
                            <div className={s.span4}>
                                <NetIncomeCard
                                    netIncomeMonthly={derivedValues.netIncomeMonthly}
                                    netIncomeTotal={derivedValues.netIncomeTotal}
                                />
                            </div>
                            <div className={s.span4}>
                                <ContractInputsCard />
                            </div>
                            <div className={s.span4}>
                                <DistributionTable
                                    distributionStatus={derivedValues.distributionStatus}
                                    totalAllocationPercent={derivedValues.totalAllocationPercent}
                                    unusedPercent={derivedValues.unusedPercent}
                                />
                            </div>
                            <div className={s.span4}>
                                <DistributionControlCard
                                    amountToDistributeByPercent={derivedValues.amountToDistributeByPercent}
                                    distributedToPerformers={derivedValues.distributedToPerformers}
                                    distributionStatus={derivedValues.distributionStatus}
                                    freeNetIncomeRemainder={derivedValues.freeNetIncomeRemainder}
                                    notDistributedAmongPerformers={derivedValues.notDistributedAmongPerformers}
                                />
                            </div>
                            {!validationResult.success ? (
                                <div className={s.span12}>
                                    <Card title="Валідація">
                                        <ul className={s.validationList}>
                                            {validationResult.error.issues.map((issue) => {
                                                return (
                                                    <li key={`${issue.path.join('.')}-${issue.message}`}>
                                                        {issue.message}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </Card>
                                </div>
                            ) : null}
                            <div className={s.span12}>
                                <TaskRowsTable rows={derivedValues.taskRowsWithAmounts} />
                            </div>
                            <div className={s.span12}>
                                <PerformerSummaryTable rows={derivedValues.performerSummary} />
                            </div>
                            <div className={s.span12}>
                                <Card title="Імпорт / експорт JSON">
                                    <div className={s.inlineActions}>
                                        <Button onClick={exportJson}>Export JSON</Button>
                                        <Button onClick={importJson}>Import JSON</Button>
                                        <Button variant="danger" onClick={resetCalculator}>
                                            Reset full calculator
                                        </Button>
                                    </div>
                                    <textarea
                                        aria-label="JSON стан калькулятора"
                                        className={s.textarea}
                                        value={jsonBuffer}
                                        onChange={(event) => {
                                            return setJsonBuffer(event.target.value);
                                        }}
                                    />
                                    {importMessage ? <p className={s.helper}>{importMessage}</p> : null}
                                </Card>
                            </div>
                        </div>
                    </TabsPanel>

                    <TabsPanel value="references">
                        <ReferenceDataPage />
                    </TabsPanel>
                </TabsRoot>
            </div>
        </main>
    );
};
