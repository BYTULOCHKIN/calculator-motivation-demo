import { Card, Input, SelectInput } from '@/shared/ui';
import { useCalculatorStore } from '../store/calculatorStore';
import s from './calculator.module.css';

export const ProjectDetailsCard = () => {
    const projectInputs = useCalculatorStore((state) => {
        return state.projectInputs;
    });
    const segments = useCalculatorStore((state) => {
        return state.referenceData.segments;
    });
    const updateProjectInput = useCalculatorStore((state) => {
        return state.updateProjectInput;
    });

    return (
        <Card title="Дані проекту">
            <div className={s.fieldGrid}>
                <label className={s.field}>
                    <span className={s.label}>ПРОЕКТ</span>
                    <Input
                        value={projectInputs.projectName}
                        onChange={(event) => {
                            return updateProjectInput('projectName', event.target.value);
                        }}
                    />
                    <span className={s.helper}>Ввести назву контрагента</span>
                </label>
                <label className={s.field}>
                    <span className={s.label}>РЕАЛІЗАЦІЯ ПРОЕКТУ</span>
                    <Input
                        type="month"
                        value={projectInputs.realizationPeriod ?? ''}
                        onChange={(event) => {
                            return updateProjectInput('realizationPeriod', event.target.value || null);
                        }}
                    />
                    <span className={s.helper}>Ввести період завершення реалізації проекту</span>
                </label>
                <div className={s.field}>
                    <span className={s.label} id="segment-label">
                        СЕГМЕНТ
                    </span>
                    <SelectInput
                        labelledBy="segment-label"
                        options={segments}
                        placeholder="Не обрано"
                        value={projectInputs.segment}
                        onChange={(value) => {
                            return updateProjectInput('segment', value);
                        }}
                    />
                    <span className={s.helper}>Метадані, не впливає на розрахунок</span>
                </div>
            </div>
        </Card>
    );
};
