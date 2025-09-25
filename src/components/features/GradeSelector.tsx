'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Grade } from '@/lib/utils';

interface GradeSelectorProps {
  value?: Grade;
  onChange: (grade: Grade) => void;
  className?: string;
}

const grades: Grade[] = ['중1', '중2', '중3'];

export function GradeSelector({ value, onChange, className }: GradeSelectorProps) {
  const [focusedGrade, setFocusedGrade] = useState<Grade | null>(null);
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-[12px] font-medium leading-[16px] text-ink">
        학년 선택
      </label>

      <div
        role="radiogroup"
        aria-labelledby="grade-label"
        className="flex space-x-2"
      >
        {grades.map((grade) => (
          <div key={grade} className="relative">
            <motion.button
              role="radio"
              aria-checked={value === grade}
              onClick={() => onChange(grade)}
              onFocus={() => setFocusedGrade(grade)}
              onBlur={() => setFocusedGrade(null)}
              className={cn(
                `
                  px-6 py-3 border-[3px] border-ink
                  text-[14px] font-medium text-ink
                  focus:outline-none
                `,
                value === grade ? 'bg-accent' : 'bg-bg'
              )}
              initial={{
                backgroundColor: value === grade ? '#FF90E8' : '#F4F4F0',
                y: 0,
                boxShadow: value === grade ? '0 4px 0 rgba(0,0,0,1)' : '0 0 0 rgba(0,0,0,1)'
              }}
              animate={{
                backgroundColor: value === grade ? '#FF90E8' : '#F4F4F0',
                y: value === grade ? 0 : 0,
                boxShadow: value === grade ? '0 4px 0 rgba(0,0,0,1)' : '0 0 0 rgba(0,0,0,1)'
              }}
              whileHover={{
                backgroundColor: '#FF90E8',
                y: -2,
                boxShadow: '0 4px 0 rgba(0,0,0,1)',
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
              }}
              whileTap={{
                y: -1,
                boxShadow: '0 2px 0 rgba(0,0,0,1)',
                transition: {
                  type: "spring",
                  stiffness: 600,
                  damping: 30,
                  mass: 0.6
                }
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 0.8
              }}
            >
              {grade}
            </motion.button>

            {/* Focus Outline Animation */}
            <AnimatePresence>
              {focusedGrade === grade && (
                <motion.div
                  className="absolute inset-0 border-4 border-[#FF90E8] pointer-events-none"
                  style={{
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
        ))}
      </div>
    </div>
  );
}