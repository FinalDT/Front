export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Main Loading Card */}
        <div className="bg-white border-[3px] border-[#0B0B0B] rounded-[20px] p-12 shadow-[8px_8px_0px_0px_#000] rotate-1">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-[#FF90E8] border-[3px] border-[#0B0B0B] flex items-center justify-center text-[32px] shadow-[4px_4px_0px_0px_#000] rotate-[-2deg]">
              📚
            </div>
          </div>

          {/* Animated Elements */}
          <div className="space-y-6">
            {/* Brutal Spinner */}
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-[#FF90E8] border-[2px] border-[#0B0B0B] shadow-[2px_2px_0px_0px_#000]"
                  style={{
                    animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>

            {/* Text Content */}
            <div className="space-y-3">
              <h2 className="text-[28px] font-[800] text-[#0B0B0B] uppercase">
                STUDIYA 로딩중
              </h2>
              <p className="text-[16px] font-bold text-[#0B0B0B] opacity-70">
                수학 튜터가 준비하고 있어요! 🤖
              </p>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3">
              {[60, 80, 40].map((width, i) => (
                <div key={i} className="w-full h-3 bg-[#F4F4F0] border-[2px] border-[#0B0B0B]">
                  <div
                    className="h-full bg-[#FF90E8] animate-loading-bar"
                    style={{
                      width: `${width}%`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Tips */}
        <div className="bg-[#C7F2E3] border-[3px] border-[#0B0B0B] rounded-[16px] p-6 shadow-[6px_6px_0px_0px_#000] rotate-[-1deg] max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <span className="text-[20px]">💡</span>
            <div className="text-left">
              <p className="text-[14px] font-bold text-[#0B0B0B]">
                잠깐! 알고 계셨나요?
              </p>
              <p className="text-[12px] text-[#0B0B0B] opacity-70">
                수학은 매일 조금씩 꾸준히 하는 것이 가장 효과적이에요!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}