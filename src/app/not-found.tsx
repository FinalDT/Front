import Link from 'next/link';
import BackButton from './BackButton';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Main 404 Card */}
        <div className="bg-white border-[4px] border-[#0B0B0B] rounded-[24px] p-12 shadow-[12px_12px_0px_0px_#000] rotate-[1deg]">
          {/* 404 Number */}
          <div className="mb-8">
            <div className="inline-block bg-[#FF90E8] border-[4px] border-[#0B0B0B] rounded-[20px] px-8 py-6 shadow-[8px_8px_0px_0px_#000] rotate-[-2deg]">
              <span className="text-[64px] md:text-[96px] font-[800] text-[#0B0B0B]">
                404
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-[32px] md:text-[48px] font-[800] text-[#0B0B0B] uppercase leading-tight">
                앗! 길을 잃었어요!
              </h1>
              <div className="bg-[#FFD700] border-[3px] border-[#0B0B0B] rounded-[12px] px-4 py-2 inline-block rotate-[-1deg] shadow-[4px_4px_0px_0px_#000]">
                <p className="text-[16px] font-bold text-[#0B0B0B]">
                  🗺️ 페이지를 찾을 수 없어요
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#E5F9F3] border-[3px] border-[#0B0B0B] rounded-[16px] p-6 rotate-[0.5deg]">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-[48px]">🤖</span>
                <div className="text-left">
                  <p className="text-[18px] font-bold text-[#0B0B0B]">
                    STUDIYA 가이드봇이 말해요:
                  </p>
                </div>
              </div>
              <p className="text-[16px] text-[#0B0B0B] opacity-80 leading-relaxed">
                찾고 계신 페이지가 존재하지 않거나 다른 곳으로 이동했을 수 있어요.
                홈으로 돌아가서 다른 기능들을 둘러보시는 건 어떨까요?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/">
                <button className="bg-[#FF90E8] border-[4px] border-[#0B0B0B] rounded-[16px] px-8 py-4 text-[18px] font-[800] text-[#0B0B0B] uppercase shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-75 rotate-[-1deg] hover:rotate-0 w-full sm:w-auto">
                  <span className="mr-2">🏠</span>
                  홈으로 가기
                </button>
              </Link>

              <BackButton />
            </div>
          </div>
        </div>

        {/* Navigation Card */}
        <div className="bg-[#C7F2E3] border-[3px] border-[#0B0B0B] rounded-[20px] p-8 shadow-[8px_8px_0px_0px_#000] rotate-[-1deg]">
          <div className="mb-6">
            <h3 className="text-[24px] font-[800] text-[#0B0B0B] uppercase mb-2">
              🎯 이런 페이지는 어떠세요?
            </h3>
            <p className="text-[14px] text-[#0B0B0B] opacity-70">
              STUDIYA의 인기 있는 기능들을 확인해보세요!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/try">
              <div className="bg-white border-[2px] border-[#0B0B0B] rounded-[12px] p-4 shadow-[3px_3px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-75 rotate-[-1deg] hover:rotate-0 cursor-pointer">
                <div className="text-[24px] mb-2">🎯</div>
                <p className="text-[12px] font-bold text-[#0B0B0B]">사전평가</p>
                <p className="text-[10px] text-[#0B0B0B] opacity-70">실력 확인하기</p>
              </div>
            </Link>

            <Link href="/dashboard">
              <div className="bg-white border-[2px] border-[#0B0B0B] rounded-[12px] p-4 shadow-[3px_3px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-75 rotate-[1deg] hover:rotate-0 cursor-pointer">
                <div className="text-[24px] mb-2">📊</div>
                <p className="text-[12px] font-bold text-[#0B0B0B]">대시보드</p>
                <p className="text-[10px] text-[#0B0B0B] opacity-70">학습 현황</p>
              </div>
            </Link>

            <Link href="/tutor">
              <div className="bg-white border-[2px] border-[#0B0B0B] rounded-[12px] p-4 shadow-[3px_3px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-75 rotate-[-0.5deg] hover:rotate-0 cursor-pointer">
                <div className="text-[24px] mb-2">🤖</div>
                <p className="text-[12px] font-bold text-[#0B0B0B]">AI 튜터</p>
                <p className="text-[10px] text-[#0B0B0B] opacity-70">질문하기</p>
              </div>
            </Link>

            <Link href="/context">
              <div className="bg-white border-[2px] border-[#0B0B0B] rounded-[12px] p-4 shadow-[3px_3px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-75 rotate-[0.5deg] hover:rotate-0 cursor-pointer">
                <div className="text-[24px] mb-2">📚</div>
                <p className="text-[12px] font-bold text-[#0B0B0B]">학습기록</p>
                <p className="text-[10px] text-[#0B0B0B] opacity-70">분석 보기</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center">
          <p className="text-[14px] text-[#0B0B0B] opacity-60">
            💡 URL을 직접 입력하신 경우, 올바른 주소인지 다시 한 번 확인해보세요!
          </p>
        </div>
      </div>
    </div>
  );
}