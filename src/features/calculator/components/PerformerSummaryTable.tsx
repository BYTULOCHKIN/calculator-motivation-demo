import type { PerformerSummaryRow } from '../types';
import MoneyIcon from '@/icons/money.svg?react';
import { Card } from '@/shared/ui';
import { formatNumber } from '../utils/formatters';
import s from './calculator.module.css';

type PerformerSummaryTableProps = {
    rows: PerformerSummaryRow[];
};

export const PerformerSummaryTable = ({ rows }: PerformerSummaryTableProps) => {
    return (
        <Card title="Сумарно по виконавцях">
            <div className={s.tableWrap}>
                <table className={`${s.table} ${s.summaryTable}`}>
                    <thead>
                        <tr>
                            <th>Виконавець</th>
                            <th>Сума за період</th>
                            <th>К-сть записів</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => {
                            return (
                                <tr key={row.performer}>
                                    <td>{row.performer}</td>
                                    <td>
                                        <strong className={s.metricLabel}>
                                            <MoneyIcon className={s.metricIcon} />
                                            {formatNumber(row.totalAmount)}
                                        </strong>
                                    </td>
                                    <td>{row.recordCount}</td>
                                </tr>
                            );
                        })}
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={3}>
                                    <div className={s.blankCell}>Немає виконавців для підсумку</div>
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
