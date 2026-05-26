import type { DistributionStatus } from '../types';
import ErrorCircleIcon from '@/icons/error-circle.svg?react';
import MoneyIcon from '@/icons/money.svg?react';
import WarningTriangleIcon from '@/icons/warning-triangle.svg?react';
import { Card } from '@/shared/ui';
import clsx from 'clsx';
import { formatNumber } from '../utils/formatters';
import s from './calculator.module.css';

type DistributionControlCardProps = {
    amountToDistributeByPercent: number;
    distributedToPerformers: number;
    notDistributedAmongPerformers: number;
    freeNetIncomeRemainder: number;
    distributionStatus: DistributionStatus;
};

export const DistributionControlCard = ({
    amountToDistributeByPercent,
    distributedToPerformers,
    notDistributedAmongPerformers,
    freeNetIncomeRemainder,
    distributionStatus,
}: DistributionControlCardProps) => {
    const hasDistributionError = distributionStatus !== 'OK';

    return (
        <Card title="Контроль розподілу">
            <div className={s.metricList}>
                <div className={clsx(s.metric, hasDistributionError && s.errorMetric)}>
                    <span className={s.metricLabel}>
                        {hasDistributionError ? (
                            <ErrorCircleIcon className={s.metricIcon} />
                        ) : (
                            <MoneyIcon className={s.metricIcon} />
                        )}
                        Сума до розподілу за %
                    </span>
                    <strong className={s.metricValue}>{formatNumber(amountToDistributeByPercent)}</strong>
                </div>
                <div className={s.metric}>
                    <span className={s.metricLabel}>
                        <MoneyIcon className={s.metricIcon} />
                        Розподілено виконавцям
                    </span>
                    <strong className={s.metricValue}>{formatNumber(distributedToPerformers)}</strong>
                </div>
                <div className={clsx(s.metric, notDistributedAmongPerformers > 0 && s.warningMetric)}>
                    <span className={s.metricLabel}>
                        <WarningTriangleIcon className={s.metricIcon} />
                        Не розподілено між виконавцями
                    </span>
                    <strong className={s.metricValue}>{formatNumber(notDistributedAmongPerformers)}</strong>
                </div>
                <div className={s.metric}>
                    <span className={s.metricLabel}>
                        <MoneyIcon className={s.metricIcon} />
                        Вільний залишок від чистого доходу
                    </span>
                    <strong className={s.metricValue}>{formatNumber(freeNetIncomeRemainder)}</strong>
                </div>
            </div>
        </Card>
    );
};
