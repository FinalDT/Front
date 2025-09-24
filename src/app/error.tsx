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
    <div className="min-h-screen bg-[#F4F4F0] flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Main Error Card */}
        <div className="bg-white border-[4px] border-[#0B0B0B] rounded-[24px] p-12 shadow-[12px_12px_0px_0px_#000] rotate-[-1deg]">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-[#FF6B6B] border-[4px] border-[#0B0B0B] rounded-[20px] flex items-center justify-center shadow-[8px_8px_0px_0px_#000] rotate-[2deg]">
              <span className="text-[48px] animate-pulse">⚠️</span>
            </div>
          </div>

          {/* Error Content */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-[36px] md:text-[48px] font-[800] text-[#0B0B0B] uppercase leading-tight">
                앗! 문제가 생겼어요!
              </h1>
              <div className="inline-block bg-[#FFD700] border-[3px] border-[#0B0B0B] px-4 py-2 rotate-[1deg] shadow-[4px_4px_0px_0px_#000]">
                <p className="text-[14px] font-bold text-[#0B0B0B]">
                  ERROR CODE: {error.digest || 'UNKNOWN'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#FFE5E5] border-[3px] border-[#0B0B0B] rounded-[16px] p-6 rotate-[0.5deg]">
              <p className="text-[18px] font-bold text-[#0B0B0B] mb-3">
                🤖 무슨 일이 일어났나요?
              </p>
              <p className="text-[16px] text-[#0B0B0B] opacity-80 leading-relaxed">
                예상치 못한 오류가 발생했어요. STUDIYA 개발팀이 이 문제를 해결하고 있습니다.
                잠시 후 다시 시도해보시거나 홈으로 돌아가세요!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={reset}
                className="bg-[#FF90E8] border-[4px] border-[#0B0B0B] rounded-[16px] px-8 py-4 text-[18px] font-[800] text-[#0B0B0B] uppercase shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-75 rotate-[-1deg] hover:rotate-0"
              >
                <span className="mr-2">🔄</span>
                다시 시도하기
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="bg-white border-[4px] border-[#0B0B0B] rounded-[16px] px-8 py-4 text-[18px] font-[800] text-[#0B0B0B] uppercase shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-75 rotate-[1deg] hover:rotate-0"
              >
                <span className="mr-2">🏠</span>
                홈으로 가기
              </button>
            </div>
          </div>
        </div>

        {/* Help Card */}
        <div className="bg-[#C7F2E3] border-[3px] border-[#0B0B0B] rounded-[20px] p-8 shadow-[8px_8px_0px_0px_#000] rotate-[1deg]">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <span className="text-[32px]">🔧</span>
            <h3 className="text-[24px] font-[800] text-[#0B0B0B] uppercase">
              도움이 필요하신가요?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white border-[2px] border-[#0B0B0B] rounded-[12px] p-4 shadow-[3px_3px_0px_0px_#000] rotate-[-1deg]">
              <div className="text-[20px] mb-2">📧</div>
              <p className="text-[12px] font-bold text-[#0B0B0B]">이메일 문의</p>
              <p className="text-[10px] text-[#0B0B0B] opacity-70">help@studiya.com</p>
            </div>

            <div className="bg-white border-[2px] border-[#0B0B0B] rounded-[12px] p-4 shadow-[3px_3px_0px_0px_#000] rotate-[1deg]">
              <div className="text-[20px] mb-2">💬</div>
              <p className="text-[12px] font-bold text-[#0B0B0B]">실시간 채팅</p>
              <p className="text-[10px] text-[#0B0B0B] opacity-70">24시간 지원</p>
            </div>

            <div className="bg-white border-[2px] border-[#0B0B0B] rounded-[12px] p-4 shadow-[3px_3px_0px_0px_#000] rotate-[-0.5deg]">
              <div className="text-[20px] mb-2">📚</div>
              <p className="text-[12px] font-bold text-[#0B0B0B]">도움말</p>
              <p className="text-[10px] text-[#0B0B0B] opacity-70">FAQ 확인하기</p>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center">
          <p className="text-[14px] text-[#0B0B0B] opacity-60">
            문제가 계속 발생하면 브라우저 새로고침(F5)을 시도해보세요!
          </p>
        </div>
      </div>
    </div>
  );
}