'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Modal } from '@/components/ui';
import { AnimatedQuizTimer } from './AnimatedQuizTimer';
import { QuizQuestion, mockQuizQuestions } from '@/lib/mockData';
import { Grade, storage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface QuizProps {
  sessionId: string;
}

export function Quiz({ sessionId }: QuizProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [grade, setGrade] = useState<Grade>('중2');
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Load session and questions
  useEffect(() => {
    const session = storage.get('guestSession');
    if (!session || session.id !== sessionId) {
      router.push('/try');
      return;
    }

    setGrade(session.grade);
    setQuestions(mockQuizQuestions[session.grade as Grade]);

    // Load existing answers if any
    const savedAnswers = storage.get('quizAnswers');
    if (savedAnswers) {
      setAnswers(savedAnswers);
      // Set current question's answer if exists
      if (savedAnswers[currentQuestion] !== undefined) {
        setSelectedAnswer(savedAnswers[currentQuestion]);
      }
    }
  }, [sessionId, router]);

  // Update selected answer when question changes
  useEffect(() => {
    if (answers[currentQuestion] !== undefined) {
      setSelectedAnswer(answers[currentQuestion]);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestion, answers]);

  // 문제가 로드되면 타이머 활성화
  useEffect(() => {
    if (questions.length > 0) {
      setIsTimerActive(true);
    }
  }, [questions.length, currentQuestion]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  // 타이머 시간 초과 처리
  const handleTimeUp = () => {
    // 답을 선택하지 않았으면 자동으로 다음 문제로 넘어감 (답안 -1로 저장)
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer ?? -1;
    setAnswers(newAnswers);
    storage.set('quizAnswers', newAnswers);

    if (isLastQuestion) {
      // 마지막 문제면 세션 완료 처리
      const session = storage.get('guestSession');
      if (session) {
        session.answers = newAnswers;
        session.completed = true;
        storage.set('guestSession', session);
        storage.set('lastQuiz', newAnswers);
      }
      router.push(`/results-teaser?session=${sessionId}`);
    } else {
      // 다음 문제로 이동
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleNext = async () => {
    if (selectedAnswer === null) return;

    // 타이머 일시정지 (문제 전환 중)
    setIsTimerActive(false);

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    // Save answers to localStorage
    storage.set('quizAnswers', newAnswers);

    if (isLastQuestion) {
      setIsLoading(true);

      // Complete the session
      const session = storage.get('guestSession');
      if (session) {
        session.answers = newAnswers;
        session.completed = true;
        storage.set('guestSession', session);
        storage.set('lastQuiz', newAnswers);
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push(`/results-teaser?session=${sessionId}`);
    } else {
      setCurrentQuestion(prev => prev + 1);
      // 다음 문제로 넘어가면 타이머 재시작 (useEffect에서 처리)
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      // 타이머 일시정지 (문제 전환 중)
      setIsTimerActive(false);
      setCurrentQuestion(prev => prev - 1);
      // selectedAnswer는 useEffect에서 자동으로 설정됨
    }
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    // Save current progress
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      storage.set('quizAnswers', newAnswers);
    }
    router.push('/');
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-[3px] border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-ink">문제를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  
  if (!question) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink">문제를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header - 컨테이너 안에 */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExit}
                className="p-2 border-[3px] border-ink bg-bg hover:bg-accent transition-colors duration-150"
                aria-label="평가 종료"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
              <div>
                <h1 className="text-[24px] font-bold text-ink">사전평가</h1>
                <p className="text-[14px] text-ink opacity-70">{grade} 문제</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[14px] font-medium text-ink">
                {currentQuestion + 1} / {questions.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timer - 전체 화면 폭 차지 (여백 없음) */}
      <div className="w-full mb-8">
        <AnimatedQuizTimer
          duration={45}
          onTimeUp={handleTimeUp}
          isActive={isTimerActive}
          questionNumber={currentQuestion}
          className="w-full"
        />
      </div>

      {/* 나머지 컨텐츠 - 컨테이너 안에 */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto">

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="sr-only">
            진행률: {Math.round(progress)}%
          </div>
          <div 
            className="w-full h-3 border-[3px] border-ink bg-bg"
            role="progressbar"
            aria-valuenow={currentQuestion + 1}
            aria-valuemin={1}
            aria-valuemax={questions.length}
            aria-label={`전체 ${questions.length}문항 중 ${currentQuestion + 1}번째 문항`}
          >
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8" padding="xl">
          <div 
            className="space-y-8"
            role="group"
            aria-labelledby="q-title"
          >
            {/* Question */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent border-[3px] border-ink flex items-center justify-center flex-shrink-0">
                  <span className="text-[14px] font-bold">Q</span>
                </div>
                <div className="flex-1">
                  <h2 
                    id="q-title"
                    className="text-[18px] md:text-[20px] font-medium text-ink leading-relaxed"
                  >
                    {question.question}
                  </h2>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-[12px] text-ink opacity-60">
                      개념: {question.concept}
                    </span>
                    <span className="text-[12px] text-ink opacity-60">
                      난이도: {question.difficulty === 'easy' ? '쉬움' : question.difficulty === 'medium' ? '보통' : '어려움'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <fieldset className="space-y-3">
              <legend className="sr-only">답 선택</legend>
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  role="radio"
                  aria-checked={selectedAnswer === index}
                  aria-describedby={`option-${index}-label`}
                  className={cn(
                    `
                      w-full p-4 text-left border-[3px] transition-all duration-150
                      hover:shadow-[0_4px_0_rgba(0,0,0,1)] hover:-translate-y-0.5
                      focus:outline-none focus:ring-[3px] focus:ring-accent focus:ring-offset-2
                      min-h-[44px]
                    `,
                    selectedAnswer === index
                      ? 'border-ink bg-accent text-ink shadow-[0_4px_0_rgba(0,0,0,1)]'
                      : 'border-ink bg-bg text-ink'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      'w-6 h-6 border-[2px] border-ink flex items-center justify-center',
                      selectedAnswer === index ? 'bg-ink' : 'bg-bg'
                    )}>
                      {selectedAnswer === index && (
                        <span className="text-[12px] font-bold text-bg">
                          {String.fromCharCode(65 + index)}
                        </span>
                      )}
                      {selectedAnswer !== index && (
                        <span className="text-[12px] font-bold text-ink">
                          {String.fromCharCode(65 + index)}
                        </span>
                      )}
                    </div>
                    <span id={`option-${index}-label`} className="text-[16px]">{option}</span>
                  </div>
                </button>
              ))}
            </fieldset>

            {/* "I don't know" option */}
            <button
              onClick={() => handleAnswerSelect(-1)}
              role="radio"
              aria-checked={selectedAnswer === -1}
              aria-label="모르겠습니다"
              className={cn(
                `
                  w-full p-3 text-center border-[3px] border-dashed transition-all duration-150
                  hover:shadow-[0_2px_0_rgba(0,0,0,1)] hover:-translate-y-0.5
                  focus:outline-none focus:ring-[3px] focus:ring-accent focus:ring-offset-2
                `,
                selectedAnswer === -1
                  ? 'border-ink bg-ink text-bg'
                  : 'border-ink bg-bg text-ink opacity-60 hover:opacity-100'
              )}
            >
              <span className="text-[14px]">모르겠어요</span>
            </button>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            이전
          </Button>

          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            isLoading={isLoading}
          >
            {isLastQuestion ? (isLoading ? '제출 중...' : '제출') : '다음'}
          </Button>
        </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="평가를 종료하시겠습니까?"
      >
        <div className="space-y-4">
          <p className="text-[14px] text-ink">
            현재까지의 진행상황이 저장됩니다.<br />
            평가를 종료하고 홈으로 돌아가시겠습니까?
          </p>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowExitModal(false)}
              className="flex-1"
            >
              계속하기
            </Button>
            <Button
              onClick={confirmExit}
              className="flex-1"
            >
              종료
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}