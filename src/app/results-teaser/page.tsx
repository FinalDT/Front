'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Badge } from '@/components/ui';
import { generateMockResult, QuizResult, GuestSession } from '@/lib/mockData';
import { storage, Grade } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function ResultsTeaserPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  const [result, setResult] = useState<QuizResult | null>(null);
  const [session, setSession] = useState<GuestSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const savedSession = storage.get('guestSession');
        if (!savedSession || savedSession.id !== sessionId) {
          return;
        }

        setSession(savedSession);

        if (savedSession.answers && savedSession.completed) {
          // Generate mock result
          const mockResult = generateMockResult(savedSession.answers, savedSession.grade);
          setResult(mockResult);
        }
      } catch (error) {
        console.error('Failed to load results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-[3px] border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-ink">결과를 분석하는 중...</p>
        </div>
      </div>
    );
  }

  if (!result || !session) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-[32px] font-bold text-ink mb-4">
            결과를 찾을 수 없습니다
          </h1>
          <p className="text-[16px] text-ink opacity-70 mb-8">
            사전평가를 다시 진행해주세요.
          </p>
          <Link href="/try">
            <Button>사전평가 다시하기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-accent border-[3px] border-ink shadow-[0_6px_0_rgba(0,0,0,1)] flex items-center justify-center">
            <div className="text-[32px]">🎯</div>
          </div>
          <h1 className="text-[32px] md:text-[48px] font-bold text-ink mb-4">
            평가 완료!
          </h1>
          <p className="text-[16px] md:text-[18px] text-ink opacity-70">
            {session.grade} 사전평가 결과 미리보기
          </p>
          <div className="mt-4 p-3 bg-accent/20 border-[3px] border-accent max-w-md mx-auto">
            <p className="text-[14px] text-ink">
              💡 일부 결과만 미리 보여드립니다.<br />
              전체 분석과 맞춤 학습은 회원가입 후 이용하세요!
            </p>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Score Card */}
          <Card>
            <div className="text-center space-y-4">
              <h3 className="text-[20px] font-bold text-ink">전체 점수</h3>
              <div className="relative">
                {/* Blurred Background */}
                <div className="text-[48px] font-bold text-ink blur-sm" aria-hidden="true">
                  {result.correctAnswers}/{result.totalQuestions}
                </div>
                {/* Lock Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-ink text-bg border-[3px] border-ink flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M5 10V7a5 5 0 0110 0v3h1a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7a1 1 0 011-1h1z" />
                    </svg>
                  </div>
                </div>
                <div className="sr-only">
                  정확한 점수는 회원가입 후 확인 가능합니다
                </div>
              </div>
              <p className="text-[14px] text-ink opacity-70">
                정확도: <span className="blur-sm" aria-hidden="true">{result.accuracy}%</span>
                <span className="sr-only">정확한 정확도는 회원가입 후 확인 가능</span>
              </p>
            </div>
          </Card>

          {/* Level Card */}
          <Card>
            <div className="text-center space-y-4">
              <h3 className="text-[20px] font-bold text-ink">예상 레벨</h3>
              <div className="relative">
                {/* Blurred Badge */}
                <div className="flex justify-center">
                  <Badge
                    variant="accent"
                    size="lg"
                    className="text-[24px] font-bold blur-sm px-8 py-4"
                    aria-hidden="true"
                  >
                    {result.estimatedLevel}
                  </Badge>
                </div>
                {/* Lock Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-ink text-bg border-[3px] border-ink flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M5 10V7a5 5 0 0110 0v3h1a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7a1 1 0 011-1h1z" />
                    </svg>
                  </div>
                </div>
                <div className="sr-only">
                  정확한 레벨은 회원가입 후 확인 가능합니다
                </div>
              </div>
              <p className="text-[14px] text-ink opacity-70">
                A~C 등급 중 하나
              </p>
            </div>
          </Card>
        </div>

        {/* Concept Scores - Partially Visible */}
        <Card className="mb-12">
          <div className="space-y-6">
            <h3 className="text-[20px] font-bold text-ink">개념별 분석</h3>
            <div className="space-y-4">
              {result.conceptScores.slice(0, 2).map((concept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-ink">
                      {concept.concept}
                    </span>
                    <span className="text-[14px] text-ink opacity-70">
                      {concept.score}/{concept.maxScore}
                    </span>
                  </div>
                  <div 
                    className="w-full h-3 border-[3px] border-ink bg-bg"
                    role="progressbar"
                    aria-valuenow={concept.score}
                    aria-valuemin={0}
                    aria-valuemax={concept.maxScore}
                    aria-label={`${concept.concept}: ${concept.score}점 / ${concept.maxScore}점`}
                  >
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${(concept.score / concept.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Locked concepts */}
              <div className="relative">
                <div className="space-y-4 blur-sm opacity-50" aria-hidden="true">
                  {result.conceptScores.slice(2).map((concept, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[14px] font-medium text-ink">
                          {concept.concept}
                        </span>
                        <span className="text-[14px] text-ink opacity-70">
                          {concept.score}/{concept.maxScore}
                        </span>
                      </div>
                      <div className="w-full h-3 border-[3px] border-ink bg-bg">
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${(concept.score / concept.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center space-x-2 bg-bg px-4 py-2 border-[3px] border-ink shadow-[0_4px_0_rgba(0,0,0,1)]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M4 8V6a4 4 0 018 0v2h.8A.8.8 0 0113.6 8.8v5.6a.8.8 0 01-.8.8H3.2a.8.8 0 01-.8-.8V8.8A.8.8 0 013.2 8H4z" />
                    </svg>
                    <span className="text-[12px] font-medium text-ink">
                      나머지 {result.conceptScores.length - 2}개 개념 분석
                    </span>
                  </div>
                </div>
                <div className="sr-only">
                  나머지 개념별 분석 결과는 회원가입 후 확인 가능합니다
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="text-center mb-8" padding="xl">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-[24px] font-bold text-ink">
                전체 결과와 맞춤 학습을 확인하세요
              </h2>
              <p className="text-[16px] text-ink opacity-70 max-w-2xl mx-auto">
                계정을 만들면 오늘 결과와 향후 추천 학습을 저장해 드려요.<br />
                개인화된 AI 튜터와의 대화도 시작할 수 있습니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  회원가입하고 전체 결과 보기
                </Button>
              </Link>
              <Link href="/try">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  게스트로 다시 풀기
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t-[3px] border-ink">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {[
                  {
                    icon: '📊',
                    title: '상세 분석',
                    description: '개념별 세부 점수'
                  },
                  {
                    icon: '🎯',
                    title: '맞춤 학습',
                    description: '개인화된 학습 경로'
                  },
                  {
                    icon: '💬',
                    title: 'AI 튜터',
                    description: '실시간 학습 도움'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-[24px]">{benefit.icon}</div>
                    <h4 className="text-[14px] font-bold text-ink">
                      {benefit.title}
                    </h4>
                    <p className="text-[12px] text-ink opacity-70">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}