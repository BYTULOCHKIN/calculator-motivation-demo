import { z } from 'zod';

const uniqueStringListSchema = (label: string) => {
    return z.array(z.string().trim().min(1, `${label}: значення не може бути порожнім`)).superRefine((values, ctx) => {
        const normalizedValues = new Set<string>();

        values.forEach((value, index) => {
            const normalizedValue = value.trim().toLocaleLowerCase('uk-UA');

            if (normalizedValues.has(normalizedValue)) {
                ctx.addIssue({
                    code: 'custom',
                    message: `${label}: дубльоване значення "${value}"`,
                    path: [index],
                });
            }

            normalizedValues.add(normalizedValue);
        });
    });
};

export const projectInputsSchema = z.object({
    projectName: z.string(),
    realizationPeriod: z
        .string()
        .regex(/^\d{4}-\d{2}$/, 'Ввести період у форматі РРРР-ММ')
        .nullable(),
    segment: z.string().nullable(),
    contractAmount: z.number().min(0, 'Сума договору має бути не менше 0'),
    monthCount: z
        .number()
        .int('Кількість місяців має бути цілим числом')
        .min(1, 'Мінімум 1 місяць')
        .max(120, 'Максимум 120 місяців'),
    oneTimeStopExpenses: z.number().min(0, 'Разові витрати СТОП мають бути не менше 0'),
    monthlyStopExpenses: z.number().min(0, 'Щомісячні витрати СТОП мають бути не менше 0'),
});

export const distributionRowSchema = z.object({
    id: z.string(),
    department: z.string().trim().min(1, 'Підрозділ не може бути порожнім'),
    percentage: z.number().min(0, 'Відсоток має бути не менше 0'),
});

export const distributionRowsSchema = z.array(distributionRowSchema).superRefine((rows, ctx) => {
    const totalPercentage = rows.reduce((sum, row) => {
        return sum + row.percentage;
    }, 0);

    if (totalPercentage > 100) {
        ctx.addIssue({
            code: 'custom',
            message: 'Сума відсотків розподілу не може перевищувати 100%',
        });
    }
});

export const taskRowSchema = z.object({
    id: z.string(),
    stageRole: z.string().nullable(),
    comment: z.string(),
    performer: z.string(),
    department: z.string().nullable(),
});

export const taskRowsSchema = z.array(taskRowSchema).max(100, 'Максимум 100 рядків');

export const referenceDataSchema = z.object({
    departments: uniqueStringListSchema('Підрозділи'),
    segments: uniqueStringListSchema('Сегменти'),
    stageRoles: uniqueStringListSchema('Етапи/ролі'),
});

export const calculatorDataSchema = z.object({
    projectInputs: projectInputsSchema,
    distributionRows: distributionRowsSchema,
    taskRows: taskRowsSchema,
    referenceData: referenceDataSchema,
});

export const validateCalculatorData = (data: unknown) => {
    return calculatorDataSchema.safeParse(data);
};
