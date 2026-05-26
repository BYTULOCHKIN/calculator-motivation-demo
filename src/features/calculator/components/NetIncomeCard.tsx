import CheckCircleIcon from '@/icons/check-circle.svg?react';
import MoneyIcon from '@/icons/money.svg?react';
import WarningTriangleIcon from '@/icons/warning-triangle.svg?react';
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
                    <span className={s.metricLabel}>
                        <MoneyIcon className={s.metricIcon} />
                        Чистий Дохід за заключений період
                    </span>
                    <strong className={s.metricValue}>{formatNumber(netIncomeTotal)}</strong>
                </div>
                <div className={clsx(s.metric, hasNegativeIncome && s.errorMetric)}>
                    <span className={s.metricLabel}>
                        <MoneyIcon className={s.metricIcon} />
                        Чистий Дохід в місяць
                    </span>
                    <strong className={s.metricValue}>{formatNumber(netIncomeMonthly)}</strong>
                </div>
                {hasNegativeIncome ? (
                    <Badge tone="error">
                        <WarningTriangleIcon />
                        Відʼємний чистий дохід
                    </Badge>
                ) : (
                    <Badge>
                        <CheckCircleIcon />
                        OK
                    </Badge>
                )}
            </div>
        </Card>
    );
};
