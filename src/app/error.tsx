'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-4">
          <div className="text-[64px] font-bold text-ink">❌</div>
          <h2 className="text-[32px] font-bold text-ink">문제가 발생했습니다</h2>
          <p className="text-[16px] text-ink opacity-70">
            예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            다시 시도
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}