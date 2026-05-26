import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import type { selectDerivedCalculatorValues } from '../store/selectors';
import type { MotivationCalculatorData } from '../types';
import { formatNumber, formatPercent } from './formatters';

type DerivedCalculatorValues = ReturnType<typeof selectDerivedCalculatorValues>;

const emptyValue = '—';

const safeText = (value: string | null | undefined) => {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : emptyValue;
};

const buildFileName = (projectName: string) => {
    const normalizedProjectName = projectName
        .trim()
        .replace(/[^\p{L}\p{N}\s_-]/gu, '')
        .replace(/\s+/g, '-')
        .slice(0, 48);
    const date = new Date().toISOString().slice(0, 10);

    return `motivation-calculation-${normalizedProjectName || 'project'}-${date}.pdf`;
};

const labeledRows = (rows: Array<[string, string]>): Content => {
    return {
        table: {
            widths: ['45%', '55%'],
            body: rows.map(([label, value]) => {
                return [
                    { text: label, style: 'tableLabel' },
                    { text: value, style: 'tableValue' },
                ];
            }),
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 12],
    };
};

export const exportCalculatorPdf = async (data: MotivationCalculatorData, derivedValues: DerivedCalculatorValues) => {
    const [{ default: pdfMake }, { default: pdfFonts }] = await Promise.all([
        import('pdfmake/build/pdfmake'),
        import('pdfmake/build/vfs_fonts'),
    ]);
    const generatedAt = new Intl.DateTimeFormat('uk-UA', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date());
    const taskBody = [
        [
            { text: 'ЕТАП/РОЛЬ', style: 'tableHeader' },
            { text: 'Коментар', style: 'tableHeader' },
            { text: 'Виконавець', style: 'tableHeader' },
            { text: 'Підрозділ', style: 'tableHeader' },
            { text: 'Сума за період', style: 'tableHeader' },
        ],
        ...derivedValues.taskRowsWithAmounts.map((row) => {
            return [
                safeText(row.stageRole),
                safeText(row.comment),
                safeText(row.performer),
                safeText(row.department),
                row.calculatedAmount === null ? emptyValue : formatNumber(row.calculatedAmount),
            ];
        }),
    ];
    const performerBody = [
        [
            { text: 'Виконавець', style: 'tableHeader' },
            { text: 'Сума за період', style: 'tableHeader' },
            { text: 'К-сть записів', style: 'tableHeader' },
        ],
        ...derivedValues.performerSummary.map((row) => {
            return [row.performer, formatNumber(row.totalAmount), row.recordCount.toString()];
        }),
    ];

    const documentDefinition: TDocumentDefinitions = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [28, 34, 28, 34],
        defaultStyle: {
            font: 'Roboto',
            fontSize: 8,
            color: '#1f1a16',
        },
        footer: (currentPage, pageCount) => {
            return {
                text: `${currentPage.toString()} / ${pageCount.toString()}`,
                alignment: 'right',
                margin: [0, 0, 28, 0],
                fontSize: 7,
                color: '#6b7280',
            };
        },
        styles: {
            title: {
                fontSize: 18,
                bold: true,
                color: '#7c4d2b',
                margin: [0, 0, 0, 4],
            },
            subtitle: {
                fontSize: 8,
                color: '#6b7280',
                margin: [0, 0, 0, 14],
            },
            sectionTitle: {
                fontSize: 10,
                bold: true,
                color: '#ffffff',
                fillColor: '#8a5b36',
                margin: [0, 10, 0, 0],
            },
            tableHeader: {
                bold: true,
                color: '#ffffff',
                fillColor: '#2d679d',
            },
            tableLabel: {
                bold: true,
                fillColor: '#fff3e8',
            },
            tableValue: {
                fillColor: '#fffaf5',
            },
            warning: {
                color: '#7a5600',
                fillColor: '#fff0c9',
            },
            error: {
                color: '#8a2118',
                fillColor: '#ffd8d3',
            },
        },
        content: [
            { text: 'РОЗРАХУНОК МОТИВАЦІЇ', style: 'title' },
            { text: `Згенеровано: ${generatedAt}`, style: 'subtitle' },
            {
                columns: [
                    [
                        { text: 'Дані проекту', style: 'sectionTitle' },
                        labeledRows([
                            ['ПРОЕКТ', safeText(data.projectInputs.projectName)],
                            ['РЕАЛІЗАЦІЯ ПРОЕКТУ', safeText(data.projectInputs.realizationPeriod)],
                            ['СЕГМЕНТ', safeText(data.projectInputs.segment)],
                        ]),
                    ],
                    [
                        { text: 'Договір / витрати', style: 'sectionTitle' },
                        labeledRows([
                            ['СУМА ДОГОВОРУ', formatNumber(data.projectInputs.contractAmount)],
                            ['Кількість місяців', data.projectInputs.monthCount.toString()],
                            ['ВИТРАТИ разові СТОП', formatNumber(data.projectInputs.oneTimeStopExpenses)],
                            ['ВИТРАТИ АП/міс СТОП', formatNumber(data.projectInputs.monthlyStopExpenses)],
                        ]),
                    ],
                    [
                        { text: 'Чистий дохід', style: 'sectionTitle' },
                        labeledRows([
                            ['Чистий Дохід за заключений період', formatNumber(derivedValues.netIncomeTotal)],
                            ['Чистий Дохід в місяць', formatNumber(derivedValues.netIncomeMonthly)],
                        ]),
                    ],
                ],
                columnGap: 12,
            },
            {
                columns: [
                    [
                        { text: 'Розподіл %', style: 'sectionTitle' },
                        labeledRows([
                            ['Разом %', formatPercent(derivedValues.totalAllocationPercent)],
                            ['Вільно %', formatPercent(derivedValues.unusedPercent)],
                            ['Статус', derivedValues.distributionStatus],
                        ]),
                    ],
                    [
                        { text: 'Контроль розподілу', style: 'sectionTitle' },
                        labeledRows([
                            ['Сума до розподілу за %', formatNumber(derivedValues.amountToDistributeByPercent)],
                            ['Розподілено виконавцям', formatNumber(derivedValues.distributedToPerformers)],
                            [
                                'Не розподілено між виконавцями',
                                formatNumber(derivedValues.notDistributedAmongPerformers),
                            ],
                            ['Вільний залишок від чистого доходу', formatNumber(derivedValues.freeNetIncomeRemainder)],
                        ]),
                    ],
                ],
                columnGap: 12,
            },
            { text: 'Призначення етапів / ролей', style: 'sectionTitle' },
            {
                table: {
                    headerRows: 1,
                    widths: ['28%', '18%', '16%', '18%', '12%'],
                    body:
                        taskBody.length > 1
                            ? taskBody
                            : [...taskBody, [emptyValue, emptyValue, emptyValue, emptyValue, emptyValue]],
                },
                layout: 'lightHorizontalLines',
                margin: [0, 0, 0, 12],
            },
            { text: 'Сумарно по виконавцях', style: 'sectionTitle' },
            {
                table: {
                    headerRows: 1,
                    widths: ['45%', '30%', '25%'],
                    body:
                        performerBody.length > 1
                            ? performerBody
                            : [...performerBody, [emptyValue, emptyValue, emptyValue]],
                },
                layout: 'lightHorizontalLines',
            },
        ],
    };

    pdfMake.addVirtualFileSystem(pdfFonts);
    pdfMake.createPdf(documentDefinition).download(buildFileName(data.projectInputs.projectName));
};
