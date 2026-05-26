import { Badge, Card } from '@/shared/ui';
import clsx from 'clsx';
import { formatNumber } from '../utils/formatters';
import s from './calculator.module.css';

type NetIncomeCardProps = {
    netIncomeTotal: number;
    netIncomeMonthly: number;
};

export const NetIncomeCard = ({ netIncomeTotal, netIncomeMonthly }: NetIncomeCardProps) => {
    const hasNegativeIncome = netIncomeTotal < 0 || netIncomeMonthly < 0;

    return (
        <Card title="Чистий дохід">
            <div className={s.metricList}>
                <div className={clsx(s.metric, hasNegativeIncome && s.errorMetric)}>
                    <span>Чистий Дохід за заключений період</span>
                    <strong className={s.metricValue}>{formatNumber(netIncomeTotal)}</strong>
                </div>
                <div className={clsx(s.metric, hasNegativeIncome && s.errorMetric)}>
                    <span>Чистий Дохід в місяць</span>
                    <strong className={s.metricValue}>{formatNumber(netIncomeMonthly)}</strong>
                </div>
                {hasNegativeIncome ? <Badge tone="error">Відʼємний чистий дохід</Badge> : <Badge>OK</Badge>}
            </div>
        </Card>
    );
};
