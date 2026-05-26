import { describe, expect, it } from 'vitest';
import { createDefaultCalculatorState } from '../constants/defaultCalculatorState';
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
    calculateTaskRowAmount,
    calculateTotalAllocationPercent,
    calculateUnusedPercent,
} from './calculations';

describe('motivation calculations', () => {
    it('matches the default workbook sample', () => {
        const state = createDefaultCalculatorState();
        const netIncomeTotal = calculateNetIncomeTotal(state.projectInputs);
        const netIncomeMonthly = calculateNetIncomeMonthly(state.projectInputs);
        const totalAllocationPercent = calculateTotalAllocationPercent(state.distributionRows);
        const unusedPercent = calculateUnusedPercent(totalAllocationPercent);
        const distributionStatus = calculateDistributionStatus(totalAllocationPercent);
        const amountToDistributeByPercent = calculateAmountToDistributeByPercent(
            netIncomeMonthly,
            totalAllocationPercent
        );
        const taskRowsWithAmounts = addCalculatedTaskAmounts(state.taskRows, state.distributionRows, netIncomeMonthly);
        const distributedToPerformers = calculateDistributedToPerformers(taskRowsWithAmounts);
        const notDistributedAmongPerformers = calculateNotDistributedAmongPerformers(
            amountToDistributeByPercent,
            distributedToPerformers
        );
        const freeNetIncomeRemainder = calculateFreeNetIncomeRemainder(netIncomeMonthly, distributedToPerformers);
        const performerSummary = calculatePerformerSummary(taskRowsWithAmounts);

        expect(netIncomeTotal).toBe(360000);
        expect(netIncomeMonthly).toBe(60000);
        expect(totalAllocationPercent).toBe(100);
        expect(unusedPercent).toBe(0);
        expect(distributionStatus).toBe('OK');
        expect(amountToDistributeByPercent).toBe(60000);
        expect(taskRowsWithAmounts[0]?.calculatedAmount).toBe(15000);
        expect(taskRowsWithAmounts[1]?.calculatedAmount).toBe(15000);
        expect(distributedToPerformers).toBe(30000);
        expect(notDistributedAmongPerformers).toBe(30000);
        expect(freeNetIncomeRemainder).toBe(30000);
        expect(performerSummary).toEqual([{ performer: 'Іванов', totalAmount: 30000, recordCount: 2 }]);
    });

    it('does not clamp negative net income', () => {
        const state = createDefaultCalculatorState();
        const inputs = {
            ...state.projectInputs,
            contractAmount: 1000,
            monthCount: 2,
            oneTimeStopExpenses: 2000,
            monthlyStopExpenses: 1000,
        };

        expect(calculateNetIncomeTotal(inputs)).toBe(-3000);
        expect(calculateNetIncomeMonthly(inputs)).toBe(-1500);
    });

    it('splits a department budget equally between all rows in that department', () => {
        const state = createDefaultCalculatorState();
        const taskRows = [
            ...state.taskRows,
            {
                id: 'extra',
                stageRole: null,
                comment: '',
                performer: 'Петров',
                department: 'Технічна служба',
            },
        ];

        expect(calculateTaskRowAmount(taskRows[0], taskRows, state.distributionRows, 60000)).toBe(7500);
        expect(calculateTaskRowAmount(taskRows[2], taskRows, state.distributionRows, 60000)).toBe(7500);
    });

    it('returns blank amounts for rows without performer or department', () => {
        const state = createDefaultCalculatorState();

        expect(
            calculateTaskRowAmount(
                { ...state.taskRows[0], performer: '' },
                state.taskRows,
                state.distributionRows,
                60000
            )
        ).toBeNull();
        expect(
            calculateTaskRowAmount(
                { ...state.taskRows[0], department: null },
                state.taskRows,
                state.distributionRows,
                60000
            )
        ).toBeNull();
    });

    it('uses zero percent for departments missing from distribution rows', () => {
        const state = createDefaultCalculatorState();
        const row = { ...state.taskRows[0], department: 'Монтажник звʼязку - лінійник' };

        expect(calculateTaskRowAmount(row, [row], state.distributionRows, 60000)).toBe(0);
    });

    it('preserves performer first appearance order in summaries', () => {
        const summary = calculatePerformerSummary([
            { id: '1', stageRole: null, comment: '', performer: 'Б', department: 'A', calculatedAmount: 20 },
            { id: '2', stageRole: null, comment: '', performer: 'А', department: 'A', calculatedAmount: 30 },
            { id: '3', stageRole: null, comment: '', performer: 'Б', department: 'A', calculatedAmount: 40 },
        ]);

        expect(summary).toEqual([
            { performer: 'Б', totalAmount: 60, recordCount: 2 },
            { performer: 'А', totalAmount: 30, recordCount: 1 },
        ]);
    });

    it('reports an error distribution status above 100 percent', () => {
        expect(calculateDistributionStatus(100.01)).toBe('ПОМИЛКА: >100%');
    });
});
