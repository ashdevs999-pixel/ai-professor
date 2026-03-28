'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, id, checked, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex items-start">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            className="sr-only"
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer',
              'flex items-center justify-center',
              checked
                ? 'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
              error && 'border-red-500',
              className
            )}
            onClick={() => {
              const input = document.getElementById(checkboxId) as HTMLInputElement;
              input?.click();
            }}
          >
            {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
          </div>
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
        {error && (
          <p className="ml-2 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
