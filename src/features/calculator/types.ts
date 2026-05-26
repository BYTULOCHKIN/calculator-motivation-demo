export type ProjectInputs = {
    projectName: string;
    realizationPeriod: string | null;
    segment: string | null;
    contractAmount: number;
    monthCount: number;
    oneTimeStopExpenses: number;
    monthlyStopExpenses: number;
};

export type DistributionRow = {
    id: string;
    department: string;
    percentage: number;
};

export type TaskRow = {
    id: string;
    stageRole: string | null;
    comment: string;
    performer: string;
    department: string | null;
};

export type ReferenceData = {
    departments: string[];
    segments: string[];
    stageRoles: string[];
};

export type MotivationCalculatorData = {
    projectInputs: ProjectInputs;
    distributionRows: DistributionRow[];
    taskRows: TaskRow[];
    referenceData: ReferenceData;
};

export type DistributionStatus = 'OK' | 'ПОМИЛКА: >100%';

export type TaskRowWithAmount = TaskRow & {
    calculatedAmount: number | null;
};

export type PerformerSummaryRow = {
    performer: string;
    totalAmount: number;
    recordCount: number;
};
