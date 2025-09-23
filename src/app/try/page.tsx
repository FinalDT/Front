'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { GradeSelector } from '@/components/features/GradeSelector';
import { Grade, generateId, storage } from '@/lib/utils';
import { GuestSession } from '@/lib/mockData';

export default function TryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedGrade, setSelectedGrade] = useState<Grade>('중2');
  const [isLoading, setIsLoading] = useState(false);

  // Get grade from URL params if available
  useEffect(() => {
    const gradeParam = searchParams.get('grade');
    if (gradeParam && ['중1', '중2', '중3'].includes(gradeParam)) {
      setSelectedGrade(gradeParam as Grade);
    }
  }, [searchParams]);

  const handleStartQuiz = async () => {
    setIsLoading(true);

    try {
      // Create guest session
      const guestSession: GuestSession = {
        id: generateId(),
        grade: selectedGrade,
        startedAt: new Date(),
        completed: false
      };

      // Save to localStorage
      storage.set('guestSessionId', guestSession.id);
      storage.set('guestSession', guestSession);

      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 800));

      // Navigate to quiz
      router.push(`/quiz?session=${guestSession.id}`);
    } catch (error) {
      console.error('Failed to start quiz:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] font-[800] tracking-tight text-ink mb-4">
            사전평가 시작
          </h1>
          <p className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-ink opacity-70">
            5문항으로 구성된 간단한 평가를 통해<br />
            현재 학습 수준을 확인해보세요.
          </p>
        </div>

        {/* Main Card */}
        <Card className="text-center" padding="xl">
          <div className="space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-accent border-[3px] border-ink shadow-[0_6px_0_rgba(0,0,0,1)] flex items-center justify-center">
                <div className="text-[40px]">📝</div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-[24px] font-bold text-ink">
                  학년을 선택해주세요
                </h2>
                <p className="text-[14px] text-ink opacity-70">
                  선택한 학년에 맞는 문제가 출제됩니다
                </p>
              </div>

              <div className="flex justify-center">
                <GradeSelector
                  value={selectedGrade}
                  onChange={setSelectedGrade}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button
                size="lg"
                onClick={handleStartQuiz}
                isLoading={isLoading}
                className="w-full"
              >
                {isLoading ? '준비 중...' : '사전평가 시작하기'}
              </Button>

              <p className="text-[12px] text-ink opacity-60">
                소요시간: 약 5분 | 문항 수: 5개
              </p>
            </div>
          </div>
        </Card>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '⏱️',
              title: '빠른 평가',
              description: '5분 내외로 완료'
            },
            {
              icon: '🎯',
              title: '정확한 진단',
              description: '현재 수준 파악'
            },
            {
              icon: '📊',
              title: '상세한 결과',
              description: '개념별 분석 제공'
            }
          ].map((item, index) => (
            <div
              key={index}
              className="text-center p-6 border-[3px] border-ink bg-bg"
            >
              <div className="text-[32px] mb-3">{item.icon}</div>
              <h3 className="text-[16px] font-bold text-ink mb-2">
                {item.title}
              </h3>
              <p className="text-[12px] text-ink opacity-70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}