import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  duration: number; // 초 단위
  onTimeUp?: () => void;
  onTick?: (timeLeft: number) => void;
  autoStart?: boolean;
}

export function useTimer({
  duration,
  onTimeUp,
  onTick,
  autoStart = false
}: UseTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [hasStarted, setHasStarted] = useState(autoStart);
  
  // 콜백 함수들을 ref로 저장하여 안정적인 참조 유지
  const onTimeUpRef = useRef(onTimeUp);
  const onTickRef = useRef(onTick);
  
  // 콜백 함수가 변경될 때마다 ref 업데이트
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);
  
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  const start = useCallback(() => {
    setIsRunning(true);
    setHasStarted(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    setHasStarted(false);
  }, [duration]);

  const restart = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(true);
    setHasStarted(true);
  }, [duration]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        onTickRef.current?.(newTime);
        
        if (newTime <= 0) {
          setIsRunning(false);
          // setTimeout을 사용해서 렌더링 사이클 외부에서 콜백 실행
          setTimeout(() => {
            onTimeUpRef.current?.();
          }, 0);
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // duration이 변경되면 타이머 리셋
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  const progress = ((duration - timeLeft) / duration) * 100;
  const progressReverse = (timeLeft / duration) * 100;

  return {
    timeLeft,
    isRunning,
    hasStarted,
    progress,
    progressReverse,
    start,
    pause,
    reset,
    restart,
    formatTime: (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  };
}
