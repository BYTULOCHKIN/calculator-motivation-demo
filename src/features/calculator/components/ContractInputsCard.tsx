import { Card, CurrencyInput, Input } from '@/shared/ui';
import { parseSafeNumber } from '../utils/formatters';
import { useCalculatorStore } from '../store/calculatorStore';
import s from './calculator.module.css';

export const ContractInputsCard = () => {
    const contract = useCalculatorStore((state) => {
        return state.projectInputs;
    });
    const updateProjectInput = useCalculatorStore((state) => {
        return state.updateProjectInput;
    });

    return (
        <Card title="Договір / витрати">
            <div className={s.fieldGrid}>
                <label className={s.field}>
                    <span className={s.label}>СУМА ДОГОВОРУ</span>
                    <CurrencyInput
                        value={contract.contractAmount}
                        onValueChange={(value) => {
                            updateProjectInput('contractAmount', value);
                        }}
                    />
                </label>
                <label className={s.field}>
                    <span className={s.label}>Кількість місяців</span>
                    <Input
                        max={120}
                        min={1}
                        step={1}
                        type="number"
                        value={contract.monthCount}
                        onChange={(event) => {
                            return updateProjectInput('monthCount', Math.trunc(parseSafeNumber(event.target.value)));
                        }}
                    />
                </label>
                <label className={s.field}>
                    <span className={s.label}>ВИТРАТИ разові СТОП</span>
                    <CurrencyInput
                        value={contract.oneTimeStopExpenses}
                        onValueChange={(value) => {
                            updateProjectInput('oneTimeStopExpenses', value);
                        }}
                    />
                </label>
                <label className={s.field}>
                    <span className={s.label}>ВИТРАТИ АП/міс СТОП</span>
                    <CurrencyInput
                        value={contract.monthlyStopExpenses}
                        onValueChange={(value) => {
                            updateProjectInput('monthlyStopExpenses', value);
                        }}
                    />
                </label>
            </div>
        </Card>
    );
};
