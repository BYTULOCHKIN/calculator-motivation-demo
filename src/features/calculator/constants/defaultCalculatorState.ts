import type { MotivationCalculatorData } from '../types';
import { createId } from '../utils/ids';
import { defaultReferenceData } from './defaultReferenceData';

export const createDefaultCalculatorState = (): MotivationCalculatorData => {
    return {
        projectInputs: {
            projectName: 'Українська компанія "Бавовна"',
            realizationPeriod: '2026-05',
            segment: null,
            contractAmount: 500000,
            monthCount: 6,
            oneTimeStopExpenses: 50000,
            monthlyStopExpenses: 15000,
        },
        distributionRows: [
            { id: createId('distribution'), department: 'Відділ СТОП', percentage: 25 },
            { id: createId('distribution'), department: 'Комерційна служба', percentage: 25 },
            { id: createId('distribution'), department: 'Технічна служба', percentage: 25 },
            { id: createId('distribution'), department: 'Юридична служба', percentage: 25 },
            { id: createId('distribution'), department: 'Бухгалтерія', percentage: 0 },
        ],
        taskRows: [
            {
                id: createId('task'),
                stageRole: 'ТЕХ: Перевірка виконання технічних вимог Замовника',
                comment: '',
                performer: 'Іванов',
                department: 'Технічна служба',
            },
            {
                id: createId('task'),
                stageRole: 'СТОП: Заключення договору/ДУ на нові точки',
                comment: '',
                performer: 'Іванов',
                department: 'Комерційна служба',
            },
        ],
        referenceData: {
            departments: [...defaultReferenceData.departments],
            segments: [...defaultReferenceData.segments],
            stageRoles: [...defaultReferenceData.stageRoles],
        },
    };
};
