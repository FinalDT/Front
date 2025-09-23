'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Modal } from '@/components/ui';
import { session, storage, generateId } from '@/lib/utils';

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 800));

      // 10% chance of mock failure for demonstration
      if (Math.random() < 0.1) {
        throw new Error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      }

      // Create user session
      const userId = `demo-${generateId()}`;
      session.login(userId);

      // Migrate guest session data if exists
      const guestSession = storage.get('guestSession');
      const lastQuiz = storage.get('lastQuiz');

      if (guestSession && lastQuiz) {
        // Save guest data to user account (simulation)
        storage.set('userQuizResults', {
          userId,
          guestSession,
          answers: lastQuiz,
          migratedAt: new Date().toISOString()
        });
      }

      // Show success modal briefly before redirect
      setShowModal(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-accent border-[3px] border-ink shadow-[0_6px_0_rgba(0,0,0,1)] flex items-center justify-center">
            <div className="text-[32px]">🔑</div>
          </div>
          <h1 className="text-[32px] md:text-[48px] font-bold text-ink mb-4">
            로그인
          </h1>
          <p className="text-[16px] text-ink opacity-70">
            간편하게 시작해보세요
          </p>
        </div>

        {/* Main Login Card */}
        <Card padding="xl" className="text-center mb-8">
          <div className="space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-bg border-[3px] border-ink shadow-[0_4px_0_rgba(0,0,0,1)] flex items-center justify-center">
                <div className="text-[24px]">👤</div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h2 className="text-[20px] font-bold text-ink">
                데모 계정으로 체험하기
              </h2>
              <p className="text-[14px] text-ink opacity-70">
                실제 회원가입 없이 모든 기능을 체험할 수 있습니다.<br />
                클릭 한 번으로 시작하세요!
              </p>
            </div>

            {/* Login Button */}
            <div className="space-y-4">
              <Button
                size="lg"
                onClick={handleLogin}
                isLoading={isLoading}
                className="w-full"
              >
                {isLoading ? '로그인 중...' : '한 번 눌러 로그인'}
              </Button>

              {error && (
                <div
                  role="alert"
                  className="p-3 border-[3px] border-red-500 bg-red-50 text-red-700 text-[14px]"
                >
                  {error}
                  <button
                    onClick={() => setError(null)}
                    className="ml-2 underline hover:no-underline"
                  >
                    다시 시도
                  </button>
                </div>
              )}
            </div>

            {/* Demo Info */}
            <div className="pt-4 border-t-[3px] border-ink space-y-3">
              <p className="text-[12px] text-ink opacity-60">
                데모 계정 기능
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                {[
                  { icon: '📊', label: '결과 저장' },
                  { icon: '💬', label: 'AI 튜터' },
                  { icon: '🎯', label: '맞춤 학습' },
                  { icon: '📈', label: '진도 추적' }
                ].map((feature, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-[16px]">{feature.icon}</div>
                    <div className="text-[10px] text-ink opacity-70">
                      {feature.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Alternative Actions */}
        <div className="text-center space-y-4">
          <div className="text-[12px] text-ink opacity-60">
            또는
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/try')}
              className="w-full p-3 border-[3px] border-dashed border-ink bg-transparent text-ink hover:bg-accent transition-colors duration-150"
            >
              <span className="text-[14px]">게스트로 계속 사용하기</span>
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full p-2 text-[12px] text-ink opacity-60 hover:opacity-100 transition-opacity duration-150"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {}}
        className="max-w-sm"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 border-[3px] border-green-600 flex items-center justify-center">
            <div className="text-[24px]">✅</div>
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-ink mb-2">
              로그인 성공!
            </h3>
            <p className="text-[14px] text-ink opacity-70">
              대시보드로 이동합니다...
            </p>
          </div>
          <div className="w-8 h-8 mx-auto border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </Modal>
    </div>
  );
}