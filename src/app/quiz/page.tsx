'use client';

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// CuteQuiz 컴포넌트를 동적 로딩 (코드 스플리팅)
const CuteQuiz = dynamic(() => import('@/components/features/CuteQuiz').then(mod => ({ default: mod.CuteQuiz })), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-bg via-soft/20 to-accent/10 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto brutal-card bg-accent flex items-center justify-center animate-pulse">
          <span className="text-[32px]">🤖</span>
        </div>
        <div className="space-y-2">
          <p className="text-[18px] font-bold text-ink">퀴즈를 준비하고 있어요...</p>
          <p className="text-[14px] text-ink/70">잠시만 기다려주세요! ✨</p>
        </div>
        <div className="flex justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-accent rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false, // 상호작용이 많은 컴포넌트는 SSR 제외
});

export default function QuizPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-[32px] font-bold text-ink mb-4">
            세션을 찾을 수 없습니다
          </h1>
          <p className="text-[16px] text-ink opacity-70 mb-8">
            사전평가를 다시 시작해주세요.
          </p>
          <a
            href="/try"
            className="inline-flex items-center justify-center h-12 px-6 border-[3px] border-ink bg-accent text-ink font-medium hover:-translate-y-0.5 transition-transform duration-150"
          >
            사전평가 시작하기
          </a>
        </div>
      </div>
    );
  }

  return <CuteQuiz sessionId={sessionId} />;
}