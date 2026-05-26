import type {
    DistributionRow,
    DistributionStatus,
    PerformerSummaryRow,
    ProjectInputs,
    TaskRow,
    TaskRowWithAmount,
} from '../types';

export const calculateNetIncomeTotal = (inputs: ProjectInputs) => {
    return inputs.contractAmount - (inputs.monthlyStopExpenses * inputs.monthCount + inputs.oneTimeStopExpenses);
};

export const calculateNetIncomeMonthly = (inputs: ProjectInputs) => {
    if (!Number.isFinite(inputs.monthCount) || inputs.monthCount <= 0) {
        return 0;
    }

    return calculateNetIncomeTotal(inputs) / inputs.monthCount;
};

export const calculateTotalAllocationPercent = (distributionRows: DistributionRow[]) => {
    return distributionRows.reduce((sum, row) => {
        return sum + row.percentage;
    }, 0);
};

export const calculateUnusedPercent = (totalAllocationPercent: number) => {
    return Math.max(0, 100 - totalAllocationPercent);
};

export const calculateDistributionStatus = (totalAllocationPercent: number): DistributionStatus => {
    return totalAllocationPercent > 100 ? 'ПОМИЛКА: >100%' : 'OK';
};

export const calculateAmountToDistributeByPercent = (netIncomeMonthly: number, totalAllocationPercent: number) => {
    return (netIncomeMonthly * totalAllocationPercent) / 100;
};

export const calculateTaskRowAmount = (
    taskRow: TaskRow,
    allTaskRows: TaskRow[],
    distributionRows: DistributionRow[],
    netIncomeMonthly: number
) => {
    if (!taskRow.performer.trim() || !taskRow.department) {
        return null;
    }

    const departmentPercent =
        distributionRows.find((distributionRow) => {
            return distributionRow.department === taskRow.department;
        })?.percentage ?? 0;
    const departmentRowCount = allTaskRows.filter((row) => {
        return row.department === taskRow.department;
    }).length;

    if (departmentRowCount === 0) {
        return 0;
    }

    return (netIncomeMonthly * departmentPercent) / 100 / departmentRowCount;
};

export const addCalculatedTaskAmounts = (
    taskRows: TaskRow[],
    distributionRows: DistributionRow[],
    netIncomeMonthly: number
): TaskRowWithAmount[] => {
    return taskRows.map((taskRow) => {
        return {
            ...taskRow,
            calculatedAmount: calculateTaskRowAmount(taskRow, taskRows, distributionRows, netIncomeMonthly),
        };
    });
};

export const calculateDistributedToPerformers = (taskRowsWithAmounts: TaskRowWithAmount[]) => {
    return taskRowsWithAmounts.reduce((sum, row) => {
        return sum + (row.calculatedAmount ?? 0);
    }, 0);
};

export const calculateNotDistributedAmongPerformers = (
    amountToDistributeByPercent: number,
    distributedToPerformers: number
) => {
    return Math.max(0, amountToDistributeByPercent - distributedToPerformers);
};

export const calculateFreeNetIncomeRemainder = (netIncomeMonthly: number, distributedToPerformers: number) => {
    return Math.max(0, netIncomeMonthly - distributedToPerformers);
};

export const calculatePerformerSummary = (taskRowsWithAmounts: TaskRowWithAmount[]): PerformerSummaryRow[] => {
    const rows: PerformerSummaryRow[] = [];
    const indexByPerformer = new Map<string, number>();

    taskRowsWithAmounts.forEach((row) => {
        const performer = row.performer.trim();

        if (!performer) {
            return;
        }

        const existingIndex = indexByPerformer.get(performer);

        if (typeof existingIndex === 'number') {
            rows[existingIndex] = {
                ...rows[existingIndex],
                totalAmount: rows[existingIndex].totalAmount + (row.calculatedAmount ?? 0),
                recordCount: rows[existingIndex].recordCount + 1,
            };
            return;
        }

        indexByPerformer.set(performer, rows.length);
        rows.push({
            performer,
            totalAmount: row.calculatedAmount ?? 0,
            recordCount: 1,
        });
    });

    return rows;
};
