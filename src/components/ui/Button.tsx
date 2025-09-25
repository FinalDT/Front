'use client';

import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [isFocused, setIsFocused] = useState(false);
    const baseStyles = `
      inline-flex items-center justify-center
      font-black uppercase tracking-wide
      border-4 border-black
      cursor-pointer text-center
      focus:outline-none
      disabled:opacity-60 disabled:cursor-not-allowed
      font-[Arial Black, Helvetica Neue, sans-serif]
    `;

    const variants = {
      primary: `
        text-black
        shadow-[6px_6px_0px_0px_#000]
      `,
      secondary: `
        text-black
        shadow-[6px_6px_0px_0px_#000]
      `,
      danger: `
        text-white
        shadow-[6px_6px_0px_0px_#000]
      `,
      success: `
        text-black
        shadow-[6px_6px_0px_0px_#000]
      `,
      outline: `
        text-black
        shadow-[6px_6px_0px_0px_#000]
      `,
      ghost: `
        text-black border-transparent
        shadow-none
      `
    };

    const sizes = {
      sm: 'h-10 px-4 text-sm min-w-[80px]',
      md: 'h-12 px-6 text-base min-w-[120px]',
      lg: 'h-14 px-8 text-lg min-w-[140px]',
      xl: 'h-16 px-10 text-xl min-w-[160px]'
    };

    const shadowSizes = {
      sm: { default: '4px 4px 0px 0px #000', hover: '2px 2px 0px 0px #000', active: '1px 1px 0px 0px #000' },
      md: { default: '6px 6px 0px 0px #000', hover: '4px 4px 0px 0px #000', active: '2px 2px 0px 0px #000' },
      lg: { default: '8px 8px 0px 0px #000', hover: '6px 6px 0px 0px #000', active: '3px 3px 0px 0px #000' },
      xl: { default: '10px 10px 0px 0px #000', hover: '8px 8px 0px 0px #000', active: '4px 4px 0px 0px #000' }
    };

    const rotationValues = {
      none: 0,
      slight: 1,
      mild: 2,
      bold: 3
    };

    const colorPalettes = {
      primary: {
        default: '#FF90E8',
        hover: '#E066D1',
        active: '#C850B8',
        disabled: '#FF90E8'
      },
      secondary: {
        default: '#FFFFFF',
        hover: '#FFB3F0',
        active: '#FF90E8',
        disabled: '#FFFFFF'
      },
      danger: {
        default: '#FF0000',
        hover: '#CC0000',
        active: '#990000',
        disabled: '#FF0000'
      },
      success: {
        default: '#00FF00',
        hover: '#00CC00',
        active: '#009900',
        disabled: '#00FF00'
      },
      outline: {
        default: '#FFFFFF',
        hover: '#FFB3F0',
        active: '#FF90E8',
        disabled: '#FFFFFF'
      },
      ghost: {
        default: 'transparent',
        hover: '#FFB3F0',
        active: '#FF90E8',
        disabled: 'transparent'
      }
    };

    return (
      <div className="relative inline-block">
        <motion.button
          className={cn(
            baseStyles,
            variants[variant],
            sizes[size],
            className
          )}
          ref={ref}
          disabled={disabled || isLoading}
          aria-busy={isLoading}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          initial={{
            rotate: rotationValues[rotation],
            x: 0,
            y: 0,
            boxShadow: shadowSizes[size].default,
            backgroundColor: colorPalettes[variant].default,
          }}
          whileHover={
            disabled || isLoading
              ? {}
              : {
                  rotate: 0,
                  x: 2,
                  y: 2,
                  boxShadow: shadowSizes[size].hover,
                  backgroundColor: colorPalettes[variant].hover,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    mass: 0.8,
                    backgroundColor: {
                      type: "tween",
                      duration: 0.2,
                      ease: "easeOut"
                    }
                  }
                }
          }
          whileTap={
            disabled || isLoading
              ? {}
              : {
                  rotate: 0,
                  x: 4,
                  y: 4,
                  boxShadow: shadowSizes[size].active,
                  backgroundColor: colorPalettes[variant].active,
                  scale: 0.98,
                  transition: {
                    type: "spring",
                    stiffness: 600,
                    damping: 30,
                    mass: 0.6,
                    backgroundColor: {
                      type: "tween",
                      duration: 0.15,
                      ease: "easeOut"
                    },
                    scale: {
                      type: "spring",
                      stiffness: 600,
                      damping: 30,
                      mass: 0.6
                    }
                  }
                }
          }
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
        </motion.button>

        {/* Focus Outline Animation */}
        <AnimatePresence>
          {isFocused && !disabled && !isLoading && (
            <motion.div
              className="absolute inset-0 border-4 border-[#FF90E8] pointer-events-none"
              style={{
                borderRadius: 'inherit',
                margin: '-2px'
              }}
              initial={{
                scale: 0.8,
                opacity: 0
              }}
              animate={{
                scale: 1,
                opacity: 1
              }}
              exit={{
                scale: 0.8,
                opacity: 0
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                mass: 0.6
              }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Button.displayName = 'Button';

export { Button };