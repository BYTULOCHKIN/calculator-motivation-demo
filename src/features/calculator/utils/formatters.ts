export const numberFormatter = new Intl.NumberFormat('uk-UA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

export const percentFormatter = new Intl.NumberFormat('uk-UA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

export const formatNumber = (value: number | null | undefined) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return '';
    }

    return numberFormatter.format(value);
};

export const formatPercent = (value: number | null | undefined) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return '';
    }

    return `${percentFormatter.format(value)}%`;
};

export const parseSafeNumber = (value: string) => {
    const normalizedValue = value.replace(/\s/g, '').replace(',', '.');
    const parsedValue = Number(normalizedValue);

    return Number.isFinite(parsedValue) ? parsedValue : 0;
};
