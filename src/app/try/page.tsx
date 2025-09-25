'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { GradeSelector } from '@/components/features/GradeSelector';
import { Grade, generateId, storage, gradeToNumber, getCurrentSemester } from '@/lib/utils';
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
      // 현재 학기 계산
      const currentSemester = getCurrentSemester();
      const gradeNumber = gradeToNumber(selectedGrade);

      // Create guest session with semester info
      const guestSession: GuestSession = {
        id: generateId(),
        grade: selectedGrade,
        gradeNumber: gradeNumber,
        semester: currentSemester,
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
    <div className="h-[calc(100vh-80px)] bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] font-[800] tracking-tight text-ink mb-3">
            사전평가 시작
          </h1>
          <p className="text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-ink opacity-70">
            6문항으로 구성된 간단한 평가를 통해 현재 학습 수준을 확인해보세요.
          </p>
        </div>

        {/* Main Layout - 3열 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-8 items-center">
          {/* 왼쪽 정보 카드 */}
          <div className="lg:col-span-2">
            <div className="text-center p-4 border-[3px] border-ink bg-bg hover:bg-soft/20 transition-colors h-full flex flex-col justify-center">
              <div className="text-[24px] mb-2">⏱️</div>
              <h3 className="text-[14px] font-bold text-ink mb-1">
                빠른 평가
              </h3>
              <p className="text-[11px] text-ink opacity-70">
                6분 내외로 완료
              </p>
            </div>
          </div>

          {/* 중앙 메인 카드 */}
          <div className="lg:col-span-6">
            <Card className="text-center" padding="xl">
              <div className="space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-accent border-[3px] border-ink shadow-[0_6px_0_rgba(0,0,0,1)] flex items-center justify-center">
                    <div className="text-[32px]">📝</div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-[20px] font-bold text-ink">
                      학년을 선택해주세요
                    </h2>
                    <p className="text-[13px] text-ink opacity-70">
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
                <div className="space-y-3">
                  <Button
                    size="lg"
                    onClick={handleStartQuiz}
                    isLoading={isLoading}
                    className="w-full"
                  >
                    {isLoading ? '준비 중...' : '사전평가 시작하기'}
                  </Button>

                  <p className="text-[11px] text-ink opacity-60">
                    소요시간: 약 6분 | 문항 수: 6개
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* 오른쪽 정보 카드 */}
          <div className="lg:col-span-2">
            <div className="text-center p-4 border-[3px] border-ink bg-bg hover:bg-soft/20 transition-colors h-full flex flex-col justify-center">
              <div className="text-[24px] mb-2">📊</div>
              <h3 className="text-[14px] font-bold text-ink mb-1">
                상세한 결과
              </h3>
              <p className="text-[11px] text-ink opacity-70">
                개념별 분석 제공
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}