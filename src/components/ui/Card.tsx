import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlight' | 'warning' | 'success' | 'danger' | 'info';
  rotation?: 'none' | 'slight' | 'mild' | 'bold';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    rotation = 'slight',
    shadow = 'lg', 
    padding = 'md', 
    interactive = false,
    children, 
    ...props 
  }, ref) => {
    const baseStyles = `
      border-4 border-black
      transition-all duration-75 ease-out
      font-bold
    `;

    const interactiveStyles = interactive ? `
      cursor-pointer
      hover:translate-x-[-2px] hover:translate-y-[-2px]
    ` : '';

    const variants = {
      default: 'bg-white text-black',
      highlight: 'bg-[#FFB3F0] text-black',
      warning: 'bg-[#FF6600] text-black',
      success: 'bg-[#00FF00] text-black',
      danger: 'bg-[#FF0000] text-white',
      info: 'bg-[#0066FF] text-white'
    };

    const rotations = {
      none: 'rotate-0',
      slight: 'rotate-1',
      mild: 'rotate-2',  
      bold: 'rotate-3'
    };

    // 인터랙티브한 경우 호버시 회전 초기화
    const interactiveRotations = interactive ? {
      none: 'rotate-0',
      slight: 'rotate-1 hover:rotate-0',
      mild: 'rotate-2 hover:rotate-0',  
      bold: 'rotate-3 hover:rotate-0'
    } : rotations;

    const shadows = {
      sm: 'shadow-[4px_4px_0px_0px_#000]',
      md: 'shadow-[6px_6px_0px_0px_#000]',
      lg: 'shadow-[8px_8px_0px_0px_#000]',
      xl: 'shadow-[12px_12px_0px_0px_#000]'
    };

    const interactiveShadows = interactive ? {
      sm: 'shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000]',
      md: 'shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000]',
      lg: 'shadow-[8px_8px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]',
      xl: 'shadow-[12px_12px_0px_0px_#000] hover:shadow-[10px_10px_0px_0px_#000]'
    } : shadows;

    const paddings = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-12'
    };

    return (
      <div
        className={cn(
          baseStyles,
          variants[variant],
          interactiveRotations[rotation],
          interactiveShadows[shadow],
          paddings[padding],
          interactiveStyles,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components with brutal styling
const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-2 pb-6',
      'border-b-4 border-black mb-6',
      className
    )}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl leading-tight font-black tracking-wide uppercase',
      'font-[Arial Black, Helvetica Neue, sans-serif]',
      'text-black',
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-base leading-snug font-bold',
      'text-black opacity-80',
      className
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn('font-bold text-black', className)} 
    {...props} 
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center pt-6 mt-6',
      'border-t-4 border-black',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};