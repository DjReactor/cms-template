import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, id, checked, onChange, disabled, ...props }, ref) => {
    const toggleId = id || React.useId();
    
    return (
      <div className={cn('flex items-center justify-between gap-4', className)}>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label htmlFor={toggleId} className="text-sm font-medium text-slate-900 cursor-pointer">
                {label}
              </label>
            )}
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
        )}
        <button
          type="button"
          role="switch"
          id={toggleId}
          aria-checked={checked}
          disabled={disabled}
          onClick={(e) => {
            if (disabled) return;
            const event = {
              target: { checked: !checked, name: props.name },
            } as any;
            onChange?.(event);
          }}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            checked ? 'bg-blue-600' : 'bg-slate-200',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <span className="sr-only">Toggle {label}</span>
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Toggle.displayName = 'Toggle';
