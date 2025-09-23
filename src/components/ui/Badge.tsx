import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center
      border-[3px] font-medium
      whitespace-nowrap
    `;

    const variants = {
      default: 'border-ink bg-bg text-ink',
      accent: 'border-ink bg-accent text-ink',
      outline: 'border-ink bg-transparent text-ink',
      success: 'border-green-600 bg-green-100 text-green-800',
      warning: 'border-yellow-600 bg-yellow-100 text-yellow-800',
      error: 'border-red-600 bg-red-100 text-red-800'
    };

    const sizes = {
      sm: 'px-2 py-1 text-[10px] leading-[12px] rounded-[6px]',
      md: 'px-3 py-1.5 text-[12px] leading-[16px] rounded-[8px]',
      lg: 'px-4 py-2 text-[14px] leading-[20px] rounded-[8px]'
    };

    return (
      <div
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };