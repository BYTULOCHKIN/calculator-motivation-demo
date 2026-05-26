import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';
import ChevronDownIcon from '@/icons/chevron-down.svg?react';
import { Input as BaseInput } from '@base-ui/react/input';
import { Select } from '@base-ui/react/select';
import { Tabs } from '@base-ui/react/tabs';
import { Tooltip } from '@base-ui/react/tooltip';
import clsx from 'clsx';
import { NumericFormat } from 'react-number-format';
import s from './ui.module.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger';
};

export const Button = ({ className, variant = 'primary', ...props }: ButtonProps) => {
    return (
        <button
            className={clsx(
                s.button,
                variant === 'secondary' && s.buttonSecondary,
                variant === 'danger' && s.buttonDanger,
                className
            )}
            type="button"
            {...props}
        />
    );
};

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
    return <BaseInput className={clsx(s.input, className)} {...props} />;
};

type CurrencyInputProps = {
    value: number;
    onValueChange: (_value: number) => void;
    className?: string;
    id?: string;
    name?: string;
};

export const CurrencyInput = ({ value, onValueChange, className, id, name }: CurrencyInputProps) => {
    const [draftValue, setDraftValue] = useState<string | null>(null);
    const displayValue = draftValue ?? (Number.isFinite(value) ? value : '');

    return (
        <NumericFormat
            allowNegative={false}
            allowedDecimalSeparators={['.', ',']}
            className={clsx(s.input, className)}
            decimalScale={2}
            decimalSeparator=","
            id={id}
            inputMode="decimal"
            name={name}
            suffix=" грн"
            thousandSeparator=" "
            value={displayValue}
            valueIsNumericString={typeof displayValue === 'string'}
            onFocus={() => {
                if (draftValue === null && value === 0) {
                    setDraftValue('');
                }
            }}
            onValueChange={(values) => {
                setDraftValue(values.value);
                onValueChange(values.floatValue ?? 0);
            }}
            onBlur={() => {
                setDraftValue(null);
            }}
        />
    );
};

type SelectInputProps = {
    value: string | null;
    options: string[];
    placeholder?: string;
    onChange: (_value: string | null) => void;
    labelledBy?: string;
};

export const SelectInput = ({
    value,
    options,
    placeholder = 'Оберіть значення',
    onChange,
    labelledBy,
}: SelectInputProps) => {
    return (
        <Select.Root
            items={options.map((option) => {
                return { label: option, value: option };
            })}
            value={value}
            onValueChange={(nextValue) => {
                onChange(nextValue);
            }}
        >
            <Select.Trigger aria-labelledby={labelledBy} className={s.selectTrigger}>
                <Select.Value placeholder={placeholder} />
                <Select.Icon>
                    <ChevronDownIcon className={s.selectIcon} />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Positioner sideOffset={4}>
                    <Select.Popup className={s.selectPopup}>
                        <Select.List>
                            {options.map((option) => {
                                return (
                                    <Select.Item key={option} className={s.selectItem} value={option}>
                                        <Select.ItemText>{option}</Select.ItemText>
                                    </Select.Item>
                                );
                            })}
                        </Select.List>
                    </Select.Popup>
                </Select.Positioner>
            </Select.Portal>
        </Select.Root>
    );
};

type CardProps = {
    title: string;
    children: ReactNode;
    className?: string;
    headerClassName?: string;
};

export const Card = ({ title, children, className, headerClassName }: CardProps) => {
    return (
        <section className={clsx(s.card, className)}>
            <div className={clsx(s.cardHeader, headerClassName)}>{title}</div>
            <div className={s.cardBody}>{children}</div>
        </section>
    );
};

type BadgeProps = {
    children: ReactNode;
    tone?: 'neutral' | 'warning' | 'error';
};

export const Badge = ({ children, tone = 'neutral' }: BadgeProps) => {
    return (
        <span className={clsx(s.badge, tone === 'warning' && s.badgeWarning, tone === 'error' && s.badgeError)}>
            {children}
        </span>
    );
};

export const TabsRoot = Tabs.Root;
export const TabsPanel = Tabs.Panel;

export const TabsList = ({ children }: { children: ReactNode }) => {
    return <Tabs.List className={s.tabsList}>{children}</Tabs.List>;
};

export const TabsTab = ({ value, children }: { value: string; children: ReactNode }) => {
    return (
        <Tabs.Tab className={s.tab} value={value}>
            {children}
        </Tabs.Tab>
    );
};

export const HelpTooltip = ({ label, children }: { label: string; children: ReactNode }) => {
    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger render={<span />} className={s.tooltipTrigger} aria-label={label}>
                    {children}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Positioner sideOffset={6}>
                        <Tooltip.Popup className={s.tooltipPopup}>{label}</Tooltip.Popup>
                    </Tooltip.Positioner>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};
