import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[12px] font-medium leading-[16px] text-ink"
          >
            {label}
          </label>
        )}

        <input
          type={type}
          className={cn(
            `
              flex h-12 w-full px-4 py-3
              border-[3px] border-ink bg-bg
              text-[16px] text-ink
              placeholder:text-ink placeholder:opacity-50
              focus:outline-none focus:ring-[3px] focus:ring-accent focus:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50
            `,
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          id={inputId}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />

        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-[12px] leading-[16px] text-red-600"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={helperId}
            className="text-[12px] leading-[16px] text-ink opacity-70"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };