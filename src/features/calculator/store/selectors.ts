import type { MotivationCalculatorData } from '../types';
import {
    addCalculatedTaskAmounts,
    calculateAmountToDistributeByPercent,
    calculateDistributedToPerformers,
    calculateDistributionStatus,
    calculateFreeNetIncomeRemainder,
    calculateNetIncomeMonthly,
    calculateNetIncomeTotal,
    calculateNotDistributedAmongPerformers,
    calculatePerformerSummary,
    calculateTotalAllocationPercent,
    calculateUnusedPercent,
} from '../utils/calculations';

export const selectDerivedCalculatorValues = (state: MotivationCalculatorData) => {
    const netIncomeTotal = calculateNetIncomeTotal(state.projectInputs);
    const netIncomeMonthly = calculateNetIncomeMonthly(state.projectInputs);
    const totalAllocationPercent = calculateTotalAllocationPercent(state.distributionRows);
    const unusedPercent = calculateUnusedPercent(totalAllocationPercent);
    const distributionStatus = calculateDistributionStatus(totalAllocationPercent);
    const amountToDistributeByPercent = calculateAmountToDistributeByPercent(netIncomeMonthly, totalAllocationPercent);
    const taskRowsWithAmounts = addCalculatedTaskAmounts(state.taskRows, state.distributionRows, netIncomeMonthly);
    const distributedToPerformers = calculateDistributedToPerformers(taskRowsWithAmounts);
    const notDistributedAmongPerformers = calculateNotDistributedAmongPerformers(
        amountToDistributeByPercent,
        distributedToPerformers
    );
    const freeNetIncomeRemainder = calculateFreeNetIncomeRemainder(netIncomeMonthly, distributedToPerformers);
    const performerSummary = calculatePerformerSummary(taskRowsWithAmounts);

    return {
        netIncomeTotal,
        netIncomeMonthly,
        totalAllocationPercent,
        unusedPercent,
        distributionStatus,
        amountToDistributeByPercent,
        taskRowsWithAmounts,
        distributedToPerformers,
        notDistributedAmongPerformers,
        freeNetIncomeRemainder,
        performerSummary,
    };
};
