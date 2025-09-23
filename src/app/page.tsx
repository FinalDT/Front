import Image from 'next/image';
import { Card } from '@/components/ui';
import { HomePage } from '@/components/features/HomePage';
import { HomeCTA } from '@/components/features/HomeCTA';

export default function Home() {

  return (
    <>
      {/* Hero Section - Full Bleed */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/herosample.png"
            alt="수학 학습 일러스트"
            fill
            className="object-cover w-full h-full"
            priority
            quality={90}
          />
        </div>
        
        {/* Neo-Brutal Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-bg/90 via-bg/70 to-accent/20" />
        
        {/* Content Container */}
        <div className="relative z-20 w-full px-5 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left: Hero Content (8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                {/* Hero Badge */}
                <div className="inline-flex items-center space-x-2 brutal-badge bg-accent text-ink">
                  <span className="text-sm">🎯</span>
                  <span className="font-bold text-sm">개인화 학습 플랫폼</span>
                </div>
                
                {/* Main Headline */}
                <div className="space-y-6">
                  <h1 className="text-[48px] leading-[56px] md:text-[72px] md:leading-[80px] font-[800] tracking-tight text-ink">
                    정직한 <span className="text-accent underline decoration-[4px] underline-offset-8">튜터</span>,<br />
                    지금 내 수준 확인
                  </h1>
                  <p className="text-[18px] md:text-[20px] leading-[28px] md:leading-[32px] text-ink/80 max-w-2xl font-medium">
                    🚀 개인화된 학습 컨텍스트를 기반으로 <strong className="text-ink">정확한 피드백</strong>을 받아보세요. 
                    5분 사전평가로 시작하는 스마트한 학습 여정!
                  </p>
                </div>

                {/* Interactive Elements */}
                <HomePage />
                
                {/* Key Features Pills */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <div className="brutal-badge bg-soft">
                    <span className="text-xs">⚡</span>
                    <span className="ml-1">5분 평가</span>
                  </div>
                  <div className="brutal-badge bg-soft">
                    <span className="text-xs">🎯</span>
                    <span className="ml-1">개인화 학습</span>
                  </div>
                  <div className="brutal-badge bg-soft">
                    <span className="text-xs">💬</span>
                    <span className="ml-1">AI 튜터</span>
                  </div>
                  <div className="brutal-badge bg-soft">
                    <span className="text-xs">📊</span>
                    <span className="ml-1">정직한 피드백</span>
                  </div>
                </div>
              </div>

              {/* Right: Neo-Brutal Illustration (4 cols) */}
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <div className="relative pulse-gentle">
                  {/* Main Brand Character Card */}
                  <div className="w-72 h-72 md:w-80 md:h-80 brutal-card bg-accent-light flex items-center justify-center transform rotate-2 hover:rotate-0 transition-transform duration-300 overflow-hidden rounded-3xl">
                    <Image
                      src="/brandcharacter.png"
                      alt="브랜드 캐릭터"
                      width={220}
                      height={220}
                      className="object-contain hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 w-20 h-20 brutal-card bg-soft-light transform -rotate-12 hover:rotate-0 transition-transform duration-300 rounded-2xl">
                    <div className="flex items-center justify-center h-full text-[28px]">📚</div>
                  </div>
                  
                  <div className="absolute -bottom-6 -left-6 w-16 h-16 brutal-card bg-soft-light transform rotate-12 hover:rotate-0 transition-transform duration-300 rounded-2xl">
                    <div className="flex items-center justify-center h-full text-[20px]">✨</div>
                  </div>
                  
                  <div className="absolute top-8 -left-8 w-12 h-12 brutal-card bg-soft-light transform -rotate-45 hover:rotate-0 transition-transform duration-300 rounded-xl">
                    <div className="flex items-center justify-center h-full text-[16px]">💡</div>
                  </div>
                  
                  {/* Stats Floating Cards */}
                  <div className="absolute -top-2 left-16 brutal-badge bg-success text-white px-2 py-1 text-xs font-bold">
                    98% 정확도
                  </div>
                  <div className="absolute bottom-16 -right-2 brutal-badge bg-info text-ink px-2 py-1 text-xs font-bold">
                    5분 평가
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-[2px] border-ink rounded-full flex justify-center">
            <div className="w-1 h-3 bg-ink rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-bg border-t-[4px] border-ink">
        <div className="px-5 md:px-8 lg:px-12 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 brutal-badge bg-soft mb-6">
              <span className="text-sm">⭐</span>
              <span className="font-bold text-sm">핵심 기능</span>
            </div>
            <h2 className="text-[40px] md:text-[56px] font-[800] text-ink mb-6 leading-tight">
              왜 우리 <span className="text-accent">튜터</span>인가요?
            </h2>
            <p className="text-[18px] md:text-[20px] text-ink/70 max-w-2xl mx-auto leading-relaxed">
              개인화된 학습 경험을 제공하는 혁신적인 기능들을 만나보세요
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="brutal-card p-8 text-center group hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 brutal-card bg-accent flex items-center justify-center text-[32px] group-hover:bounce-gentle">
                🎯
              </div>
              <h3 className="text-[24px] font-bold text-ink mb-4">개인화 컨텍스트</h3>
              <p className="text-[16px] text-ink/70 leading-relaxed mb-6">
                최근 6문항 분석으로 정확한 학습 상태를 파악하고 맞춤형 학습 경로를 제공합니다.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="brutal-badge bg-soft text-xs">실시간 분석</span>
                <span className="brutal-badge bg-soft text-xs">맞춤 경로</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="brutal-card p-8 text-center group hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 brutal-card bg-info flex items-center justify-center text-[32px] group-hover:bounce-gentle">
                💬
              </div>
              <h3 className="text-[24px] font-bold text-ink mb-4">AI 튜터 대화</h3>
              <p className="text-[16px] text-ink/70 leading-relaxed mb-6">
                자연스러운 대화를 통해 개념을 쉽게 이해하고 궁금한 점을 바로 해결하세요.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="brutal-badge bg-soft text-xs">24/7 이용</span>
                <span className="brutal-badge bg-soft text-xs">즉시 답변</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="brutal-card p-8 text-center group hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 brutal-card bg-warning flex items-center justify-center text-[32px] group-hover:bounce-gentle">
                📊
              </div>
              <h3 className="text-[24px] font-bold text-ink mb-4">정직한 피드백</h3>
              <p className="text-[16px] text-ink/70 leading-relaxed mb-6">
                솔직하고 구체적인 피드백으로 현실적인 학습 목표와 방향을 제시합니다.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="brutal-badge bg-soft text-xs">정확한 진단</span>
                <span className="brutal-badge bg-soft text-xs">구체적 가이드</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 pt-16 border-t-[3px] border-ink/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-[32px] md:text-[40px] font-[800] text-accent">98%</div>
                <div className="text-[14px] font-medium text-ink/70">학습 만족도</div>
              </div>
              <div className="space-y-2">
                <div className="text-[32px] md:text-[40px] font-[800] text-accent">5분</div>
                <div className="text-[14px] font-medium text-ink/70">평가 시간</div>
              </div>
              <div className="space-y-2">
                <div className="text-[32px] md:text-[40px] font-[800] text-accent">24/7</div>
                <div className="text-[14px] font-medium text-ink/70">튜터 이용</div>
              </div>
              <div className="space-y-2">
                <div className="text-[32px] md:text-[40px] font-[800] text-accent">1000+</div>
                <div className="text-[14px] font-medium text-ink/70">학습자</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-bg border-t-[4px] border-ink">
        <div className="px-5 md:px-8 lg:px-12 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 brutal-badge bg-success text-white mb-6">
              <span className="text-sm">💬</span>
              <span className="font-bold text-sm">실제 후기</span>
            </div>
            <h2 className="text-[40px] md:text-[56px] font-[800] text-ink mb-6 leading-tight">
              학습자들의 <span className="text-accent">진짜 이야기</span>
            </h2>
            <p className="text-[18px] md:text-[20px] text-ink/70 max-w-2xl mx-auto leading-relaxed">
              실제 학습자들이 경험한 변화와 성장을 들어보세요
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                name: "김민수",
                grade: "중2",
                emoji: "😊",
                comment: "내 수준에 맞는 정확한 피드백을 받을 수 있어서 좋아요! 튜터가 정말 친절하고 이해하기 쉽게 설명해줘요.",
                rating: 5,
                improvement: "수학 성적 B+ → A"
              },
              {
                name: "이지은",
                grade: "중3",
                emoji: "🤓",
                comment: "복잡한 문제도 쉽게 설명해주는 튜터가 정말 도움이 됩니다. 5분 평가로 내 약점을 정확히 찾았어요!",
                rating: 5,
                improvement: "이차방정식 완전 정복"
              },
              {
                name: "박준호",
                grade: "중1",
                emoji: "🚀",
                comment: "개인화된 학습으로 실력이 눈에 띄게 늘었어요. 매일 조금씩 하니까 부담도 없고 재미있어요.",
                rating: 5,
                improvement: "함수 개념 완전 이해"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="brutal-card p-8 group hover:transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-[48px] text-accent/20 transform rotate-12">
                  "
                </div>
                
                {/* Rating Stars */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-[16px] text-warning">⭐</span>
                  ))}
                </div>
                
                {/* Comment */}
                <p className="text-[16px] text-ink leading-relaxed mb-6 relative z-10">
                  "{testimonial.comment}"
                </p>
                
                {/* Improvement Badge */}
                <div className="mb-6">
                  <div className="brutal-badge bg-soft-light text-xs">
                    <span className="text-success mr-1">✨</span>
                    {testimonial.improvement}
                  </div>
                </div>
                
                {/* User Info */}
                <div className="flex items-center space-x-3 pt-4 border-t-[2px] border-ink/10">
                  <div className="w-12 h-12 brutal-card bg-accent flex items-center justify-center text-[20px] group-hover:bounce-gentle">
                    {testimonial.emoji}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-ink">
                      {testimonial.name}
                    </div>
                    <div className="text-[12px] text-ink/70 font-medium">
                      {testimonial.grade} 학습자
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 pt-12 border-t-[3px] border-ink/20">
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center space-x-2 text-ink/60">
                <span className="text-[20px]">🏆</span>
                <span className="text-[14px] font-medium">교육부 인증</span>
              </div>
              <div className="flex items-center space-x-2 text-ink/60">
                <span className="text-[20px]">🔒</span>
                <span className="text-[14px] font-medium">개인정보 보호</span>
              </div>
              <div className="flex items-center space-x-2 text-ink/60">
                <span className="text-[20px]">💯</span>
                <span className="text-[14px] font-medium">100% 만족 보장</span>
              </div>
              <div className="flex items-center space-x-2 text-ink/60">
                <span className="text-[20px]">⚡</span>
                <span className="text-[14px] font-medium">즉시 시작</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-accent/10 via-bg to-soft/20 border-t-[4px] border-ink">
        <div className="px-5 md:px-8 lg:px-12 max-w-5xl mx-auto text-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-8 h-full">
              {[...Array(32)].map((_, i) => (
                <div key={i} className="border-r border-ink h-full"></div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 space-y-12">
            {/* CTA Badge */}
            <div className="inline-flex items-center space-x-2 brutal-badge bg-accent text-ink">
              <span className="text-sm">🚀</span>
              <span className="font-bold text-sm">지금 시작하기</span>
            </div>
            
            {/* Main CTA */}
            <div className="space-y-6">
              <h2 className="text-[48px] md:text-[64px] font-[800] text-ink leading-tight">
                <span className="text-accent">5분</span>이면 충분해요!
              </h2>
              <p className="text-[20px] md:text-[24px] text-ink/80 max-w-3xl mx-auto leading-relaxed font-medium">
                지금 바로 사전평가를 시작하고 <strong className="text-ink">나만의 학습 여정</strong>을 시작해보세요. 
                회원가입 없이도 바로 체험할 수 있어요! ✨
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-6">
              <HomeCTA />
              
              {/* Secondary Info */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-ink/60">
                <div className="flex items-center space-x-2">
                  <span className="text-[16px]">✅</span>
                  <span className="text-[14px] font-medium">회원가입 불필요</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[16px]">⚡</span>
                  <span className="text-[14px] font-medium">즉시 시작</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[16px]">🎯</span>
                  <span className="text-[14px] font-medium">정확한 진단</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[16px]">💝</span>
                  <span className="text-[14px] font-medium">완전 무료</span>
                </div>
              </div>
            </div>
            
            {/* Process Steps */}
            <div className="pt-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto brutal-card bg-accent flex items-center justify-center text-[24px]">
                    1️⃣
                  </div>
                  <h4 className="text-[18px] font-bold text-ink">학년 선택</h4>
                  <p className="text-[14px] text-ink/70">중1, 중2, 중3 중 선택</p>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto brutal-card bg-info flex items-center justify-center text-[24px]">
                    2️⃣
                  </div>
                  <h4 className="text-[18px] font-bold text-ink">5분 평가</h4>
                  <p className="text-[14px] text-ink/70">간단한 문제 5개 풀이</p>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto brutal-card bg-success flex items-center justify-center text-[24px]">
                    3️⃣
                  </div>
                  <h4 className="text-[18px] font-bold text-ink">맞춤 피드백</h4>
                  <p className="text-[14px] text-ink/70">AI 튜터와 대화 시작</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
