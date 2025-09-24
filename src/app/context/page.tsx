'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Badge, JsonViewer, SkeletonCard } from '@/components/ui';
import { session } from '@/lib/utils';
import { mockPersonalContext, PersonalContext } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function ContextPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [context, setContext] = useState<PersonalContext | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    if (!session.isAuthenticated()) {
      router.push('/auth');
      return;
    }

    // Load context data
    setTimeout(() => {
      setContext(mockPersonalContext);
      setIsLoading(false);
    }, 800);
  }, [router]);

  const handleSendToTutor = () => {
    // Prepare context JSON for tutor
    const contextData = {
      recentQuestions: context?.recentQuestions || [],
      timestamp: new Date().toISOString(),
      userId: session.getUserId()
    };

    // Store context for tutor
    sessionStorage.setItem('tutorContext', JSON.stringify(contextData));

    // Navigate to tutor with context
    router.push('/tutor?ctx=latest6');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg p-4">
        <div className="max-w-6xl mx-auto pt-8 space-y-8">
          <SkeletonCard />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!context) {
    return (
      <div className="min-h-screen bg-bg p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-[48px] mb-4">📊</div>
          <h2 className="text-[24px] font-bold text-ink mb-4">
            학습기록을 불러올 수 없습니다
          </h2>
          <p className="text-[16px] text-ink opacity-70 mb-8">
            사전평가를 먼저 완료해주세요.
          </p>
          <Button onClick={() => router.push('/try')}>
            사전평가 시작하기
          </Button>
        </div>
      </div>
    );
  }

  // Prepare JSON data for viewer
  const contextJson = {
    meta: {
      userId: session.getUserId(),
      totalQuestions: context.recentQuestions.length,
      lastUpdated: new Date().toISOString(),
      accuracy: Math.round(
        (context.recentQuestions.filter(q => q.isCorrect).length /
         context.recentQuestions.length) * 100
      )
    },
    recentQuestions: context.recentQuestions.map(q => ({
      id: q.id,
      concept: q.concept,
      isCorrect: q.isCorrect,
      timestamp: q.timestamp,
      question: q.question
    })),
    analysis: {
      strongConcepts: context.recentQuestions
        .filter(q => q.isCorrect)
        .map(q => q.concept),
      weakConcepts: context.recentQuestions
        .filter(q => !q.isCorrect)
        .map(q => q.concept),
      conceptDistribution: context.recentQuestions.reduce((acc, q) => {
        acc[q.concept] = (acc[q.concept] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    }
  };

  return (
    <div className="min-h-screen bg-bg p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-accent border-[3px] border-ink shadow-[0_4px_0_rgba(0,0,0,1)] flex items-center justify-center">
              <div className="text-[20px]">🎯</div>
            </div>
            <div>
              <h1 className="text-[32px] md:text-[48px] font-bold text-ink">
                개인화 학습기록
              </h1>
              <p className="text-[16px] text-ink opacity-70">
                최근 6문항 기반 학습 분석
              </p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border-[3px] border-ink bg-bg">
              <div className="text-[20px] font-bold text-ink">
                {context.recentQuestions.length}
              </div>
              <div className="text-[12px] text-ink opacity-70">총 문항</div>
            </div>
            <div className="text-center p-4 border-[3px] border-ink bg-bg">
              <div className="text-[20px] font-bold text-accent">
                {contextJson.meta.accuracy}%
              </div>
              <div className="text-[12px] text-ink opacity-70">정답률</div>
            </div>
            <div className="text-center p-4 border-[3px] border-ink bg-bg">
              <div className="text-[20px] font-bold text-ink">
                {contextJson.analysis.strongConcepts.length}
              </div>
              <div className="text-[12px] text-ink opacity-70">강한 개념</div>
            </div>
            <div className="text-center p-4 border-[3px] border-ink bg-bg">
              <div className="text-[20px] font-bold text-ink">
                {contextJson.analysis.weakConcepts.length}
              </div>
              <div className="text-[12px] text-ink opacity-70">약한 개념</div>
            </div>
          </div>
        </div>

        {/* Context Tiles */}
        <Card className="mb-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-ink">최근 학습 문항</h3>
              <Badge variant="accent" size="sm">
                {context.recentQuestions.length}개 문항
              </Badge>
            </div>

            {/* Question Tiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {context.recentQuestions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => setSelectedQuestion(
                    selectedQuestion === question.id ? null : question.id
                  )}
                  className={cn(
                    `
                      p-4 border-[3px] text-left transition-all duration-150
                      hover:shadow-[0_4px_0_rgba(0,0,0,1)] hover:-translate-y-0.5
                      focus:outline-none focus:ring-[3px] focus:ring-accent focus:ring-offset-2
                    `,
                    selectedQuestion === question.id
                      ? 'border-accent bg-accent/20 shadow-[0_4px_0_rgba(0,0,0,1)]'
                      : 'border-ink bg-bg'
                  )}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`
                          w-6 h-6 border-[2px] border-ink flex items-center justify-center
                          ${question.isCorrect ? 'bg-green-100' : 'bg-red-100'}
                        `}>
                          <span className="text-[10px] font-bold">
                            {question.isCorrect ? '✓' : '✗'}
                          </span>
                        </div>
                        <span className="text-[12px] font-bold text-ink">
                          #{index + 1}
                        </span>
                      </div>
                      <span className="text-[10px] text-ink opacity-60">
                        {new Date(question.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <div className="text-[14px] font-medium text-ink">
                        {question.concept}
                      </div>
                      {selectedQuestion === question.id && (
                        <div className="text-[12px] text-ink opacity-70 pt-2 border-t-[2px] border-ink">
                          {question.question}
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={question.isCorrect ? 'success' : 'error'}
                        size="sm"
                      >
                        {question.isCorrect ? '정답' : '오답'}
                      </Badge>
                      <span className="text-[10px] text-ink opacity-60">
                        {new Date(question.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center text-[12px] text-ink opacity-60">
              클릭하면 문제 내용을 확인할 수 있습니다
            </div>
          </div>
        </Card>

        {/* Action Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Send to Tutor */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <div className="space-y-4 h-full flex flex-col">
                <div className="space-y-3">
                  <h3 className="text-[18px] font-bold text-ink">튜터에게 전달</h3>
                  <p className="text-[14px] text-ink opacity-70">
                    현재 학습기록을 AI 튜터에게 전달하여 개인화된 학습 도움을 받으세요.
                  </p>
                </div>

                <div className="flex-1 flex items-end">
                  <Button
                    onClick={handleSendToTutor}
                    className="w-full"
                  >
                    🤖 튜터와 대화 시작
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* JSON Viewer */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <JsonViewer
                data={contextJson}
                title="학습기록 JSON"
              />
            </Card>
          </div>
        </div>

        {/* Analysis Summary */}
        <Card>
          <div className="space-y-6">
            <h3 className="text-[20px] font-bold text-ink">학습 분석 요약</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strong Concepts */}
              <div className="space-y-3">
                <h4 className="text-[16px] font-medium text-ink flex items-center space-x-2">
                  <span>💪</span>
                  <span>잘하는 개념</span>
                </h4>
                <div className="space-y-2">
                  {[...new Set(contextJson.analysis.strongConcepts)].map((concept, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border-[2px] border-green-500 bg-green-50"
                    >
                      <span className="text-[14px] text-green-800">{concept}</span>
                      <Badge variant="success" size="sm">
                        정답
                      </Badge>
                    </div>
                  ))}
                  {contextJson.analysis.strongConcepts.length === 0 && (
                    <div className="text-[14px] text-ink opacity-60 text-center py-4">
                      아직 충분한 데이터가 없습니다
                    </div>
                  )}
                </div>
              </div>

              {/* Weak Concepts */}
              <div className="space-y-3">
                <h4 className="text-[16px] font-medium text-ink flex items-center space-x-2">
                  <span>📚</span>
                  <span>복습이 필요한 개념</span>
                </h4>
                <div className="space-y-2">
                  {[...new Set(contextJson.analysis.weakConcepts)].map((concept, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border-[2px] border-red-500 bg-red-50"
                    >
                      <span className="text-[14px] text-red-800">{concept}</span>
                      <Badge variant="error" size="sm">
                        오답
                      </Badge>
                    </div>
                  ))}
                  {contextJson.analysis.weakConcepts.length === 0 && (
                    <div className="text-[14px] text-ink opacity-60 text-center py-4">
                      모든 문제를 정답으로 맞혔습니다! 🎉
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}