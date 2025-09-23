'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Grade } from '@/lib/utils';

interface GradeSelectorProps {
  value?: Grade;
  onChange: (grade: Grade) => void;
  className?: string;
}

const grades: Grade[] = ['중1', '중2', '중3'];

export function GradeSelector({ value, onChange, className }: GradeSelectorProps) {
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
          <button
            key={grade}
            role="radio"
            aria-checked={value === grade}
            onClick={() => onChange(grade)}
            className={cn(
              `
                px-6 py-3 border-[3px] border-ink
                text-[14px] font-medium
                transition-all duration-150 ease-out
                focus:outline-none focus:ring-[3px] focus:ring-accent focus:ring-offset-2
              `,
              value === grade
                ? 'bg-accent text-ink shadow-[0_4px_0_rgba(0,0,0,1)]'
                : 'bg-bg text-ink hover:bg-accent hover:shadow-[0_4px_0_rgba(0,0,0,1)] hover:-translate-y-0.5'
            )}
          >
            {grade}
          </button>
        ))}
      </div>
    </div>
  );
}