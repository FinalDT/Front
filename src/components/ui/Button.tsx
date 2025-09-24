'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rotation?: 'none' | 'slight' | 'mild' | 'bold';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    rotation = 'slight',
    isLoading = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center
      font-black uppercase tracking-wide
      border-4 border-black
      transition-all duration-75 ease-out
      cursor-pointer text-center
      hover:translate-x-1 hover:translate-y-1
      active:translate-x-2 active:translate-y-2
      focus:outline-4 focus:outline-[#FF90E8] focus:outline-offset-2
      disabled:opacity-60 disabled:cursor-not-allowed
      disabled:hover:translate-x-0 disabled:hover:translate-y-0
      font-[Arial Black, Helvetica Neue, sans-serif]
    `;

    const variants = {
      primary: `
        bg-[#FF90E8] text-black
        shadow-[6px_6px_0px_0px_#000]
        hover:shadow-[4px_4px_0px_0px_#000]
        hover:bg-[#E066D1]
        active:shadow-[2px_2px_0px_0px_#000]
        disabled:bg-[#FF90E8] disabled:shadow-[6px_6px_0px_0px_#000]
      `,
      secondary: `
        bg-white text-black
        shadow-[6px_6px_0px_0px_#000]
        hover:shadow-[4px_4px_0px_0px_#000]
        hover:bg-[#FFB3F0] hover:text-black
        active:shadow-[2px_2px_0px_0px_#000]
        disabled:bg-white disabled:shadow-[6px_6px_0px_0px_#000]
      `,
      danger: `
        bg-[#FF0000] text-white
        shadow-[6px_6px_0px_0px_#000]
        hover:shadow-[4px_4px_0px_0px_#000]
        hover:bg-[#CC0000]
        active:shadow-[2px_2px_0px_0px_#000]
        disabled:bg-[#FF0000] disabled:shadow-[6px_6px_0px_0px_#000]
      `,
      success: `
        bg-[#00FF00] text-black
        shadow-[6px_6px_0px_0px_#000]
        hover:shadow-[4px_4px_0px_0px_#000]
        hover:bg-[#00CC00]
        active:shadow-[2px_2px_0px_0px_#000]
        disabled:bg-[#00FF00] disabled:shadow-[6px_6px_0px_0px_#000]
      `,
      outline: `
        bg-white text-black
        shadow-[6px_6px_0px_0px_#000]
        hover:shadow-[4px_4px_0px_0px_#000]
        hover:bg-[#FFB3F0] hover:text-black
        active:shadow-[2px_2px_0px_0px_#000]
        disabled:bg-white disabled:shadow-[6px_6px_0px_0px_#000]
      `,
      ghost: `
        bg-transparent text-black border-transparent
        shadow-none
        hover:bg-[#FFB3F0] hover:border-black hover:shadow-[4px_4px_0px_0px_#000]
        active:shadow-[2px_2px_0px_0px_#000]
        disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:shadow-none
      `
    };

    const sizes = {
      sm: 'h-10 px-4 text-sm min-w-[80px] shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000]',
      md: 'h-12 px-6 text-base min-w-[120px] shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000]',
      lg: 'h-14 px-8 text-lg min-w-[140px] shadow-[8px_8px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]',
      xl: 'h-16 px-10 text-xl min-w-[160px] shadow-[10px_10px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000]'
    };

    const rotations = {
      none: 'rotate-0',
      slight: 'rotate-1 hover:rotate-0',
      mild: 'rotate-2 hover:rotate-0',
      bold: 'rotate-3 hover:rotate-0'
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          rotations[rotation],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <div className="mr-2 flex space-x-1">
            <div className="w-2 h-2 bg-current animate-bounce" />
            <div className="w-2 h-2 bg-current animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-current animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };