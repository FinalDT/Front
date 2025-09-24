'use client';

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// BrutalQuiz 컴포넌트를 동적 로딩 (코드 스플리팅)
const BrutalQuiz = dynamic(() => import('@/components/features/BrutalQuiz').then(mod => ({ default: mod.BrutalQuiz })), {
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-[#FF90E8] border-4 border-black 
                       flex items-center justify-center 
                       shadow-[8px_8px_0px_0px_#000] rotate-12 animate-bounce">
          <span className="text-4xl">💥</span>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-black text-black uppercase">브루탈 퀴즈 로딩 중...</p>
          <p className="text-lg text-black font-bold">준비하고 있어요! 🚀</p>
        </div>
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-black border-2 border-black animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-8xl mb-6">😱</div>
          <h1 className="text-4xl font-black text-black mb-4 uppercase">
            세션을 찾을 수 없습니다!
          </h1>
          <p className="text-xl text-black font-bold mb-8">
            사전평가를 다시 시작해주세요!
          </p>
          <a
            href="/try"
            className="inline-flex items-center justify-center h-16 px-8 
                      border-4 border-black bg-[#FF90E8] text-black 
                      font-black text-lg uppercase
                      shadow-[8px_8px_0px_0px_#000]
                      hover:shadow-[4px_4px_0px_0px_#000]
                      hover:translate-x-[4px] hover:translate-y-[4px]
                      transition-all duration-75 rotate-[-1deg] hover:rotate-0"
          >
            사전평가 시작하기 🚀
          </a>
        </div>
      </div>
    );
  }

  return <BrutalQuiz sessionId={sessionId} />;
}