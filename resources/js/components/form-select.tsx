import type { ReactNode } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type FormSelectOption = {
    value: string | number;
    label: ReactNode;
};

type FormSelectProps = {
    id?: string;
    name?: string;
    options: FormSelectOption[];
    defaultValue?: string | number | null;
    value?: string | number;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    'aria-label'?: string;
};

const emptyOptionValue = '__empty_select_option__';

function normalizeValue(value: string | number): string {
    return value === '' ? emptyOptionValue : String(value);
}

export function FormSelect({
    id,
    name,
    options,
    defaultValue,
    value,
    onValueChange,
    placeholder,
    className,
    'aria-label': ariaLabel,
}: FormSelectProps) {
    return (
        <Select
            name={name}
            defaultValue={
                defaultValue === null || defaultValue === undefined
                    ? undefined
                    : normalizeValue(defaultValue)
            }
            value={value === undefined ? undefined : normalizeValue(value)}
            onValueChange={(selectedValue) =>
                onValueChange?.(
                    selectedValue === emptyOptionValue ? '' : selectedValue,
                )
            }
        >
            <SelectTrigger
                id={id}
                aria-label={ariaLabel}
                className={cn('w-full', className)}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem
                        key={option.value}
                        value={normalizeValue(option.value)}
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
