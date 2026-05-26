import { describe, expect, it } from 'vitest';
import { createDefaultCalculatorState } from '../constants/defaultCalculatorState';
import {
    calculatorDataSchema,
    distributionRowsSchema,
    projectInputsSchema,
    referenceDataSchema,
} from './calculatorSchemas';

describe('calculator validation', () => {
    it('accepts the default sample state', () => {
        expect(calculatorDataSchema.safeParse(createDefaultCalculatorState()).success).toBe(true);
    });

    it('rejects invalid month count', () => {
        const state = createDefaultCalculatorState();

        expect(projectInputsSchema.safeParse({ ...state.projectInputs, monthCount: 0 }).success).toBe(false);
    });

    it('rejects negative expenses', () => {
        const state = createDefaultCalculatorState();

        expect(projectInputsSchema.safeParse({ ...state.projectInputs, monthlyStopExpenses: -1 }).success).toBe(false);
        expect(projectInputsSchema.safeParse({ ...state.projectInputs, oneTimeStopExpenses: -1 }).success).toBe(false);
    });

    it('rejects distribution percentages over 100 in total', () => {
        const state = createDefaultCalculatorState();
        const rows = state.distributionRows.map((row) => {
            return { ...row, percentage: 25 };
        });

        expect(distributionRowsSchema.safeParse(rows).success).toBe(false);
    });

    it('rejects duplicate reference values in the same list', () => {
        const state = createDefaultCalculatorState();

        expect(
            referenceDataSchema.safeParse({
                ...state.referenceData,
                departments: ['Технічна служба', 'технічна служба'],
            }).success
        ).toBe(false);
    });
});
