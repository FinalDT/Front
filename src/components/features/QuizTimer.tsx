import { useEffect } from 'react';
import { useTimer } from '@/lib/useTimer';
import { cn } from '@/lib/utils';

interface QuizTimerProps {
  duration: number; // 초 단위 (45초)
  onTimeUp: () => void;
  isActive: boolean;
  questionNumber: number;
  className?: string;
}

export function QuizTimer({ 
  duration, 
  onTimeUp, 
  isActive, 
  questionNumber,
  className 
}: QuizTimerProps) {
  const { 
    timeLeft, 
    isRunning, 
    progressReverse, 
    start, 
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

  // 경고 상태 계산 (10초 이하일 때 빨간색)
  const isWarning = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* 메인 타이머 디스플레이 */}
      <div className={cn(
        'relative w-full p-6 border-[3px] border-ink transition-all duration-300',
        isCritical 
          ? 'bg-red-50 border-red-500 shadow-[0_8px_0_rgba(239,68,68,1)] animate-pulse' 
          : isWarning 
            ? 'bg-orange-50 border-orange-500 shadow-[0_6px_0_rgba(249,115,22,1)]' 
            : 'bg-bg shadow-[0_6px_0_rgba(0,0,0,1)]'
      )}>
        {/* 타이머 헤더와 시간 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'w-4 h-4 border-[2px] border-ink transition-colors duration-300',
              isCritical ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-accent'
            )} />
            <span className="text-[14px] md:text-[16px] font-bold text-ink">
              제한시간
            </span>
          </div>
          
          {/* 큰 시간 표시 */}
          <div className={cn(
            'text-[24px] md:text-[32px] font-black transition-all duration-300 tabular-nums',
            isCritical 
              ? 'text-red-600 drop-shadow-lg' 
              : isWarning 
                ? 'text-orange-600 drop-shadow-md' 
                : 'text-ink'
          )}>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* 대형 진행 바 */}
        <div className="relative w-full">
          <div className="w-full h-6 md:h-8 border-[3px] border-ink bg-bg overflow-hidden">
            <div
              className={cn(
                'h-full transition-all ease-linear',
                isCritical 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : isWarning 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
                    : 'bg-gradient-to-r from-accent to-accent'
              )}
              style={{ 
                width: `${progressReverse}%`,
                transitionDuration: '1000ms'
              }}
            />
          </div>
          
          {/* 진행 바 위 퍼센트 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[12px] md:text-[14px] font-bold text-ink drop-shadow-sm">
              {Math.ceil(progressReverse)}%
            </span>
          </div>
        </div>

        {/* 상태 및 경고 메시지 */}
        <div className="mt-3 flex items-center justify-between text-[12px] md:text-[14px]">
          <span className={cn(
            'font-medium transition-colors duration-300',
            isRunning 
              ? (isCritical ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-ink')
              : 'text-ink opacity-60'
          )}>
            {isRunning ? (
              isCritical ? '🚨 급해요!' : isWarning ? '⚠️ 서둘러요!' : '⏱️ 진행 중'
            ) : timeLeft === 0 ? '⏰ 시간 종료' : '⏸️ 대기 중'}
          </span>
          <span className="text-ink opacity-60 text-[11px] md:text-[12px]">
            총 {duration}초
          </span>
        </div>
      </div>

      {/* 추가 경고 메시지 (위험 상태일 때만) */}
      {isCritical && timeLeft > 0 && (
        <div className="w-full p-4 border-[3px] border-red-500 bg-red-100 text-center animate-bounce">
          <div className="text-[16px] md:text-[18px] font-bold text-red-700 mb-1">
            ⚡ 시간이 얼마 남지 않았습니다!
          </div>
          <div className="text-[12px] md:text-[14px] text-red-600">
            빠르게 답안을 선택하세요
          </div>
        </div>
      )}
    </div>
  );
}
