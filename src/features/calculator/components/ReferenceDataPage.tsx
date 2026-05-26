import type { ReferenceData } from '../types';
import { Badge, Button, Card, Input } from '@/shared/ui';
import { referenceDataSchema } from '../schemas/calculatorSchemas';
import { useCalculatorStore } from '../store/calculatorStore';
import s from './calculator.module.css';

const referenceLabels: Record<keyof ReferenceData, string> = {
    departments: 'Підрозділи',
    segments: 'Сегменти',
    stageRoles: 'Етапи/ролі',
};

export const ReferenceDataPage = () => {
    const referenceData = useCalculatorStore((state) => {
        return state.referenceData;
    });
    const updateReferenceOption = useCalculatorStore((state) => {
        return state.updateReferenceOption;
    });
    const addReferenceOption = useCalculatorStore((state) => {
        return state.addReferenceOption;
    });
    const deleteReferenceOption = useCalculatorStore((state) => {
        return state.deleteReferenceOption;
    });
    const resetReferenceData = useCalculatorStore((state) => {
        return state.resetReferenceData;
    });
    const validationResult = referenceDataSchema.safeParse(referenceData);

    return (
        <div className={s.grid}>
            <div className={s.span12}>
                <div className={s.inlineActions}>
                    <Button onClick={resetReferenceData}>Reset to defaults</Button>
                    <Badge tone={validationResult.success ? 'neutral' : 'error'}>
                        {validationResult.success ? 'OK' : 'Є помилки'}
                    </Badge>
                </div>
                {!validationResult.success ? (
                    <ul className={s.validationList}>
                        {validationResult.error.issues.map((issue) => {
                            return <li key={`${issue.path.join('.')}-${issue.message}`}>{issue.message}</li>;
                        })}
                    </ul>
                ) : null}
            </div>
            <div className={`${s.span12} ${s.referenceGrid}`}>
                {(Object.keys(referenceLabels) as Array<keyof ReferenceData>).map((list) => {
                    return (
                        <Card key={list} title={referenceLabels[list]}>
                            <div className={s.referenceList}>
                                {referenceData[list].map((option, index) => {
                                    return (
                                        <div key={`${list}-${index.toString()}`} className={s.referenceRow}>
                                            <Input
                                                value={option}
                                                onChange={(event) => {
                                                    updateReferenceOption(list, index, event.target.value);
                                                }}
                                            />
                                            <Button
                                                variant="danger"
                                                onClick={() => {
                                                    deleteReferenceOption(list, index);
                                                }}
                                            >
                                                Видалити
                                            </Button>
                                        </div>
                                    );
                                })}
                                <Button
                                    onClick={() => {
                                        return addReferenceOption(list);
                                    }}
                                >
                                    Додати
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
