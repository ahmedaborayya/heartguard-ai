import React, { ChangeEvent } from 'react';
import FormField from './FormField';

export interface NumberFieldProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  className?: string;
}

const NumberField: React.FC<NumberFieldProps> = ({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step,
  hint,
  className = ''
}) => {
  return (
    <FormField label={label} hint={hint} className={className}>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </FormField>
  );
};

export default NumberField;