import type { DistributionStatus } from '../types';
import { Badge, Button, Card, Input, SelectInput } from '@/shared/ui';
import clsx from 'clsx';
import { formatPercent, parseSafeNumber } from '../utils/formatters';
import { useCalculatorStore } from '../store/calculatorStore';
import s from './calculator.module.css';

type DistributionTableProps = {
    totalAllocationPercent: number;
    unusedPercent: number;
    distributionStatus: DistributionStatus;
};

export const DistributionTable = ({
    totalAllocationPercent,
    unusedPercent,
    distributionStatus,
}: DistributionTableProps) => {
    const distributionRows = useCalculatorStore((state) => {
        return state.distributionRows;
    });
    const departments = useCalculatorStore((state) => {
        return state.referenceData.departments;
    });
    const updateDistributionRow = useCalculatorStore((state) => {
        return state.updateDistributionRow;
    });
    const addDistributionRow = useCalculatorStore((state) => {
        return state.addDistributionRow;
    });
    const deleteDistributionRow = useCalculatorStore((state) => {
        return state.deleteDistributionRow;
    });
    const hasError = distributionStatus !== 'OK';

    return (
        <Card title="Розподіл %">
            <div className={s.inlineActions}>
                <Button onClick={addDistributionRow}>Додати підрозділ</Button>
                <Badge tone={hasError ? 'error' : 'neutral'}>{distributionStatus}</Badge>
                <Badge tone={unusedPercent > 0 ? 'warning' : 'neutral'}>Вільно {formatPercent(unusedPercent)}</Badge>
            </div>
            <div className={clsx(s.tableWrap, hasError && s.errorMetric)}>
                <table className={s.table}>
                    <thead>
                        <tr>
                            <th>Підрозділ</th>
                            <th>Відсоток</th>
                            <th>Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {distributionRows.map((row) => {
                            return (
                                <tr key={row.id}>
                                    <td>
                                        <SelectInput
                                            options={departments}
                                            value={row.department}
                                            onChange={(value) => {
                                                return updateDistributionRow(row.id, 'department', value ?? '');
                                            }}
                                        />
                                        {!departments.includes(row.department) ? (
                                            <div className={s.referenceWarning}>Значення відсутнє у довіднику</div>
                                        ) : null}
                                    </td>
                                    <td>
                                        <Input
                                            min={0}
                                            type="number"
                                            value={row.percentage}
                                            onChange={(event) => {
                                                return updateDistributionRow(
                                                    row.id,
                                                    'percentage',
                                                    parseSafeNumber(event.target.value)
                                                );
                                            }}
                                        />
                                    </td>
                                    <td className={s.actionsCell}>
                                        <Button
                                            variant="danger"
                                            onClick={() => {
                                                return deleteDistributionRow(row.id);
                                            }}
                                        >
                                            Видалити
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className={s.metricList}>
                <div className={clsx(s.metric, hasError && s.errorMetric)}>
                    <span>Разом %</span>
                    <strong>{formatPercent(totalAllocationPercent)}</strong>
                </div>
                {hasError ? (
                    <p className={s.referenceWarning}>Сума відсотків розподілу не може перевищувати 100%.</p>
                ) : null}
            </div>
        </Card>
    );
};
