'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '@/lib/useTimer';
import { cn } from '@/lib/utils';

interface AnimatedQuizTimerProps {
  duration: number; // 초 단위 (45초)
  onTimeUp: () => void;
  isActive: boolean;
  questionNumber: number;
  className?: string;
}

export function AnimatedQuizTimer({ 
  duration, 
  onTimeUp, 
  isActive, 
  questionNumber,
  className 
}: AnimatedQuizTimerProps) {
  const { 
    timeLeft, 
    isRunning, 
    progressReverse, 
    restart, 
    formatTime 
  } = useTimer({
    duration,
    onTimeUp,
    autoStart: false
  });

  // 문제가 바뀌거나 활성화되면 타이머 시작/재시작
  useEffect(() => {
    if (isActive) {
      restart();
    }
  }, [isActive, questionNumber, restart]);

  // 상태 계산
  const isWarning = timeLeft <= 10;
  const isCritical = timeLeft <= 5;
  const progressPercent = progressReverse / 100;

  // 색상 상태
  const getColors = () => {
    if (isCritical) return {
      bg: '#fef2f2', // red-50
      border: '#ef4444', // red-500
      progress: '#dc2626', // red-600
      text: '#dc2626',
      shadow: '0 8px 0 rgba(239, 68, 68, 1)'
    };
    if (isWarning) return {
      bg: '#fffbeb', // orange-50
      border: '#f97316', // orange-500
      progress: '#ea580c', // orange-600
      text: '#ea580c',
      shadow: '0 6px 0 rgba(249, 115, 22, 1)'
    };
    return {
      bg: '#F7F7F5', // bg
      border: '#111111', // ink
      progress: '#FF90E8', // accent
      text: '#111111',
      shadow: '0 6px 0 rgba(0, 0, 0, 1)'
    };
  };

  const colors = getColors();

  // 애니메이션 variants
  const containerVariants = {
    normal: {
      backgroundColor: colors.bg,
      borderColor: colors.border,
      boxShadow: colors.shadow,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    warning: {
      backgroundColor: colors.bg,
      borderColor: colors.border,
      boxShadow: colors.shadow,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    critical: {
      backgroundColor: colors.bg,
      borderColor: colors.border,
      boxShadow: colors.shadow,
      scale: [1.02, 1.05, 1.02],
      transition: { 
        scale: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
        other: { duration: 0.3, ease: "easeOut" }
      }
    }
  };

  const progressVariants = {
    animate: {
      width: `${progressReverse}%`,
      transition: { duration: 1, ease: "linear" }
    }
  };

  const timeVariants = {
    normal: {
      scale: 1,
      color: colors.text,
      transition: { duration: 0.2 }
    },
    pulse: {
      scale: [1, 1.1, 1],
      color: colors.text,
      transition: { 
        scale: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
        color: { duration: 0.2 }
      }
    }
  };

  const currentState = isCritical ? 'critical' : isWarning ? 'warning' : 'normal';

  return (
    <div className={cn('w-full', className)}>
      {/* 메인 타이머 */}
      <motion.div
        className="relative w-full p-4 border-[3px] bg-white"
        variants={containerVariants}
        animate={currentState}
        initial="normal"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-4 h-4 border-[2px] border-ink"
              animate={{ 
                backgroundColor: colors.progress,
                rotate: isRunning ? 360 : 0
              }}
              transition={{ 
                backgroundColor: { duration: 0.3 },
                rotate: { duration: 2, repeat: isRunning ? Infinity : 0, ease: "linear" }
              }}
            />
            <span className="text-[14px] md:text-[16px] font-bold text-ink">
              제한시간
            </span>
          </div>
          
          {/* 애니메이션 시간 표시 */}
          <motion.div 
            className="text-[24px] md:text-[32px] font-black tabular-nums"
            variants={timeVariants}
            animate={isCritical ? 'pulse' : 'normal'}
          >
            {formatTime(timeLeft)}
          </motion.div>
        </div>

        {/* 애니메이션 진행 바 */}
        <div className="relative w-full">
          <div className="w-full h-6 md:h-8 border-[3px] border-ink bg-bg overflow-hidden">
            <motion.div
              className="h-full"
              style={{ backgroundColor: colors.progress }}
              variants={progressVariants}
              animate="animate"
              initial={{ width: "100%" }}
            />
          </div>
          
          {/* 진행률 텍스트 */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              scale: isWarning ? [1, 1.1, 1] : 1 
            }}
            transition={{ 
              duration: 0.8, 
              repeat: isWarning ? Infinity : 0,
              ease: "easeInOut" 
            }}
          >
            <span className="text-[12px] md:text-[14px] font-bold text-ink drop-shadow-sm">
              {Math.ceil(progressReverse)}%
            </span>
          </motion.div>
        </div>

        {/* 상태 메시지 */}
        <motion.div 
          className="mt-2 flex items-center justify-between text-[12px] md:text-[14px]"
          animate={{ color: colors.text }}
        >
          <motion.span 
            className="font-medium"
            animate={{ 
              x: isCritical ? [-2, 2, -2, 2, 0] : 0 
            }}
            transition={{ 
              duration: 0.4, 
              repeat: isCritical ? Infinity : 0,
              repeatDelay: 1 
            }}
          >
            {isRunning ? (
              isCritical ? '🚨 급해요!' : isWarning ? '⚠️ 서둘러요!' : '⏱️ 진행 중'
            ) : timeLeft === 0 ? '⏰ 시간 종료' : '⏸️ 대기 중'}
          </motion.span>
          <span className="text-ink opacity-60 text-[11px] md:text-[12px]">
            총 {duration}초
          </span>
        </motion.div>
      </motion.div>

      {/* 위험 상태 경고 */}
      <AnimatePresence>
        {isCritical && timeLeft > 0 && (
          <motion.div
            className="w-full p-4 border-[3px] border-red-500 bg-red-100 text-center"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              rotate: [-1, 1, -1, 1, 0]
            }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ 
              opacity: { duration: 0.3 },
              y: { duration: 0.3 },
              scale: { duration: 0.3 },
              rotate: { duration: 0.5, repeat: Infinity, repeatDelay: 1 }
            }}
          >
            <motion.div 
              className="text-[16px] md:text-[18px] font-bold text-red-700 mb-1"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            >
              ⚡ 시간이 얼마 남지 않았습니다!
            </motion.div>
            <div className="text-[12px] md:text-[14px] text-red-600">
              빠르게 답안을 선택하세요
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
