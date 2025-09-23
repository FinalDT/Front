import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center
      font-medium transition-all duration-150 ease-out
      border-[3px] border-ink
      focus:outline-none focus:ring-[3px] focus:ring-accent focus:ring-offset-2
      disabled:opacity-60 disabled:cursor-not-allowed
      active:translate-y-0.5
    `;

    const variants = {
      primary: `
        bg-accent text-ink
        shadow-[0_6px_0_rgba(0,0,0,1)]
        hover:-translate-y-0.5 hover:shadow-[0_8px_0_rgba(0,0,0,1)]
        disabled:hover:translate-y-0 disabled:hover:shadow-[0_6px_0_rgba(0,0,0,1)]
      `,
      outline: `
        bg-transparent text-ink
        shadow-[0_6px_0_rgba(0,0,0,1)]
        hover:-translate-y-0.5 hover:shadow-[0_8px_0_rgba(0,0,0,1)] hover:bg-accent
        disabled:hover:translate-y-0 disabled:hover:shadow-[0_6px_0_rgba(0,0,0,1)] disabled:hover:bg-transparent
      `,
      ghost: `
        bg-transparent text-ink border-transparent
        shadow-none
        hover:bg-accent hover:border-ink hover:shadow-[0_4px_0_rgba(0,0,0,1)]
        disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:shadow-none
      `
    };

    const sizes = {
      sm: 'h-8 px-3 text-[12px] rounded-[8px]',
      md: 'h-12 px-6 text-[14px] rounded-[12px]',
      lg: 'h-14 px-8 text-[16px] rounded-[12px]'
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="w-4 h-4 mr-2 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };