'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Modal } from '@/components/ui';
import { AnimatedQuizTimer } from './AnimatedQuizTimer';
import { QuizQuestion, mockQuizQuestions } from '@/lib/mockData';
import { Grade, storage, isValidGrade } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { transformQuizDataForBackend, sendQuizDataToBackend } from '@/lib/backendUtils';

interface BrutalQuizProps {
  sessionId: string;
}

// 브루탈 하트 컴포넌트 - 픽셀아트 스타일
const BrutalHeart = ({ filled }: { filled: boolean }) => (
  <div className={`
    w-8 h-8 border-2 border-black inline-block mr-1
    ${filled ? 'bg-red-500' : 'bg-white'}
    relative shadow-[2px_2px_0px_0px_#000]
    rotate-1
  `}>
    {/* 픽셀아트 하트 모양 */}
    <div className="absolute inset-1" style={{
      background: filled ? '#FF0000' : 'transparent',
      clipPath: 'polygon(50% 20%, 80% 0%, 100% 30%, 50% 100%, 0% 30%, 20% 0%)'
    }} />
  </div>
);

// 브루탈 답안 선택지 컴포넌트
const BrutalAnswerChoice = ({ 
  choice, 
  index, 
  isSelected, 
  isCorrect, 
  isRevealed, 
  onClick, 
  disabled 
}: {
  choice: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  isRevealed: boolean;
  onClick: () => void;
  disabled: boolean;
}) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`
      w-full p-4 mb-3 border-4 border-black
      font-black text-left relative
      transition-all duration-75
      ${isSelected && !isRevealed ? 'bg-[#FFB3F0] rotate-1 scale-105' : 'bg-white'}
      ${isRevealed && isCorrect ? 'bg-green-400 rotate-0 scale-110' : ''}
      ${isRevealed && isSelected && !isCorrect ? 'bg-red-500 rotate-2 scale-95' : ''}
      ${!isSelected && !disabled ? 'hover:bg-gray-100 hover:rotate-1 hover:scale-102' : ''}
      shadow-[6px_6px_0px_0px_#000]
      hover:shadow-[4px_4px_0px_0px_#000]
      hover:translate-x-[2px] hover:translate-y-[2px]
      ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      transform
    `}
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
  >
    <div className="flex items-center">
      <span className="w-10 h-10 border-2 border-black bg-white 
                     flex items-center justify-center font-black mr-4
                     shadow-[2px_2px_0px_0px_#000] text-xl">
        {String.fromCharCode(65 + index)}
      </span>
      <span className="text-black text-lg font-bold">{choice}</span>
      
      {/* 결과 아이콘 */}
      {isRevealed && (
        <span className="ml-auto text-2xl font-black">
          {isCorrect ? '✅' : isSelected ? '❌' : ''}
        </span>
      )}
    </div>
  </motion.button>
);

// 브루탈 피드백 모달
const BrutalFeedbackModal = ({ isCorrect, onNext, concept }: { 
  isCorrect: boolean; 
  onNext: () => void;
  concept: string;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center"
    onClick={onNext}
  >
    <div className={`
      w-full h-full flex items-center justify-center
      ${isCorrect ? 'bg-green-400' : 'bg-red-500'}
      border-8 border-black
    `}>
      <motion.div 
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        className="text-center px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div 
          className="text-8xl md:text-9xl font-black mb-6"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: isCorrect ? [0, 5, -5, 0] : [0, -10, 10, -5, 5, 0]
          }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
        >
          {isCorrect ? '정답!' : '틀렸어요!'}
        </motion.div>
        
        <div className="text-2xl md:text-3xl font-bold mb-8 text-black">
          {isCorrect ? 
            `🎉 ${concept} 개념을 완벽하게 이해했어요!` : 
            `💪 ${concept} 개념을 다시 공부해보세요!`
          }
        </div>
        
        <Button
          variant={isCorrect ? "success" : "secondary"}
          size="xl"
          onClick={onNext}
          className="font-black text-xl px-12 py-4 uppercase"
          rotation="mild"
        >
          {isCorrect ? '계속하기 🚀' : '다음 문제 ➡️'}
        </Button>
      </motion.div>
    </div>
  </motion.div>
);

export function BrutalQuiz({ sessionId }: BrutalQuizProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [grade, setGrade] = useState<Grade>('중2');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);
  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [showHint, setShowHint] = useState(false);
  const [autoAdvanceTimeout, setAutoAdvanceTimeout] = useState<NodeJS.Timeout | null>(null);
  // 시간 측정 관련 상태
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);
  const [answerTimestamps, setAnswerTimestamps] = useState<Date[]>([]);

  // Load session and questions
  useEffect(() => {
    const session = storage.get('guestSession');
    if (!session || session.id !== sessionId) {
      router.push('/try');
      return;
    }

    setGrade(session.grade);
    
    // Validate grade and get questions
    if (!isValidGrade(session.grade)) {
      console.error(`Invalid grade: ${session.grade}`);
      router.push('/try');
      return;
    }
    
    const questions = mockQuizQuestions[session.grade as Grade];
    if (!questions) {
      console.error(`No questions found for grade: ${session.grade}`);
      router.push('/try');
      return;
    }
    
    setQuestions(questions);

    // Load existing state
    const savedAnswers = storage.get('quizAnswers');
    const savedStreak = storage.get('quizStreak') || 0;
    const savedHearts = storage.get('quizHearts') || 5;
    
    if (savedAnswers) {
      setAnswers(savedAnswers);
      if (savedAnswers[currentQuestion] !== undefined) {
        setSelectedAnswer(savedAnswers[currentQuestion]);
      }
    }
    setStreak(savedStreak);
    setHearts(savedHearts);
  }, [sessionId, router, currentQuestion]);

  // Activate timer when question loads
  useEffect(() => {
    if (questions.length > 0) {
      setIsTimerActive(true);
      // 문제 시작 시간 기록
      setQuestionStartTime(new Date());
    }
  }, [currentQuestion, questions]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showFeedback) {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showFeedback]);

  const question = questions[currentQuestion];
  if (!question) return null;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback || isLoading) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || showFeedback) return;

    setIsLoading(true);
    setIsTimerActive(false);

    // Check if answer is correct
    const isCorrect = selectedAnswer === question.correctAnswer;
    setFeedbackType(isCorrect ? 'correct' : 'wrong');

    // 문제 소요 시간 계산
    if (questionStartTime) {
      const endTime = new Date();
      const timeSpent = Math.round((endTime.getTime() - questionStartTime.getTime()) / 1000);
      const newQuestionTimes = [...questionTimes];
      newQuestionTimes[currentQuestion] = timeSpent;
      setQuestionTimes(newQuestionTimes);

      // 로컬 스토리지에 저장
      storage.set('quizQuestionTimes', newQuestionTimes);
    }
    
    // Update hearts and streak
    if (isCorrect) {
      setStreak(prev => prev + 1);
      storage.set('quizStreak', streak + 1);
    } else {
      setHearts(prev => Math.max(0, prev - 1));
      storage.set('quizHearts', Math.max(0, hearts - 1));
      setStreak(0);
      storage.set('quizStreak', 0);
    }

    // Save answer and timestamp
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    storage.set('quizAnswers', newAnswers);

    // Save answer timestamp
    const newTimestamps = [...answerTimestamps];
    newTimestamps[currentQuestion] = new Date();
    setAnswerTimestamps(newTimestamps);

    // Show feedback with brutal timing
    setTimeout(() => {
      setShowFeedback(true);
      setIsLoading(false);

      // Auto-advance after feedback (with cleanup)
      const timeoutId = setTimeout(() => {
        handleNext();
      }, isCorrect ? 3000 : 2500); // 정답시 더 오래 축하

      setAutoAdvanceTimeout(timeoutId);
    }, 300); // 더 빠른 피드백
  };

  const handleNext = () => {
    // Clear any pending auto-advance
    if (autoAdvanceTimeout) {
      clearTimeout(autoAdvanceTimeout);
      setAutoAdvanceTimeout(null);
    }

    setShowFeedback(false);
    setFeedbackType(null);
    setSelectedAnswer(null);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz completed
      setIsLoading(true);

      setTimeout(async () => {
        const session = storage.get('guestSession');
        if (session) {
          session.answers = answers;
          session.completed = true;
          session.questionTimes = questionTimes; // 시간 데이터 추가
          storage.set('guestSession', session);
          storage.set('lastQuiz', answers);
        }
        storage.set('quizCompleted', true);

        // Send data to backend
        try {
          const backendData = transformQuizDataForBackend({
            sessionId: sessionId,
            grade: grade,
            startTime: session?.startedAt || new Date(),
            answers: answers.map((answer, index) => ({
              questionIndex: index,
              selectedAnswer: answer,
              correctAnswer: questions[index]?.correctAnswer || 0,
              submittedAt: answerTimestamps[index] || new Date()
            }))
          });

          await sendQuizDataToBackend(backendData);
          console.log('✅ Quiz data successfully sent to backend');
        } catch (error) {
          console.error('❌ Failed to send quiz data to backend:', error);
          // Continue even if backend fails
        }

        router.push(`/results-teaser?session=${sessionId}`);
      }, 500);
    }
  };

  const handleTimeUp = () => {
    if (showFeedback) return;

    setHearts(prev => Math.max(0, prev - 1));
    storage.set('quizHearts', Math.max(0, hearts - 1));
    setStreak(0);
    storage.set('quizStreak', 0);

    setFeedbackType('wrong');
    setShowFeedback(true);

    const timeoutId = setTimeout(() => {
      handleNext();
    }, 2000);

    setAutoAdvanceTimeout(timeoutId);
  };

  const handleHint = () => {
    setShowHint(true);
  };

  const handleSkip = () => {
    setSelectedAnswer(null);
    handleNext();
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    storage.remove('quizAnswers');
    storage.remove('quizStreak');
    storage.remove('quizHearts');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 브루탈 헤더 바 */}
      <div className="sticky top-0 z-40 bg-white border-b-4 border-black">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          {/* 나가기 + 하트 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleExit}
              className="w-12 h-12 bg-red-500 hover:bg-red-600 border-4 border-black
                         flex items-center justify-center text-xl font-black text-white
                         shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000]
                         hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-75
                         rotate-[-2deg] hover:rotate-0"
            >
              ✕
            </button>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <BrutalHeart key={i} filled={i < hearts} />
              ))}
            </div>
          </div>

          {/* 진행 상황 */}
          <div className="flex-1 mx-6">
            <div className="w-full h-8 border-4 border-black bg-white overflow-hidden">
              <motion.div
                className="h-full bg-[#FF90E8] transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
            <div className="text-center mt-2 text-sm font-black text-black uppercase">
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>

          {/* 스트릭 */}
          <div className="flex items-center space-x-2 bg-[#FF90E8] px-4 py-2 border-4 border-black
                         shadow-[4px_4px_0px_0px_#000] rotate-1">
            <span className="text-2xl">🔥</span>
            <span className="text-xl font-black text-black">{streak}</span>
          </div>
        </div>
      </div>

      {/* 브루탈 타이머 */}
      <div className="w-full">
        <AnimatedQuizTimer
          duration={45}
          onTimeUp={handleTimeUp}
          isActive={isTimerActive && !showFeedback}
          questionNumber={currentQuestion}
          className="w-full"
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 100, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -100, rotate: -5 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              className="space-y-6"
            >
              {/* 수평 레이아웃: 문제 + 답안 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                {/* 왼쪽: 브루탈 문제 카드 */}
                <div className="bg-white border-4 border-black p-6 lg:p-8 text-center
                               shadow-[12px_12px_0px_0px_#000] rotate-[-1deg] h-fit">
                  {/* 문제 타입 배지 */}
                  <div className="inline-flex items-center space-x-2 bg-[#C7F2E3] px-3 py-2
                                 border-2 border-black mb-4 lg:mb-6 font-black text-black uppercase text-sm lg:text-base
                                 shadow-[4px_4px_0px_0px_#000] rotate-2">
                    <span className="text-base lg:text-lg">📝</span>
                    <span className="font-black">{question.type || '객관식'}</span>
                  </div>

                  {/* 문제 텍스트 */}
                  <h2 className="text-xl lg:text-3xl xl:text-4xl font-black text-black mb-4 lg:mb-6 leading-tight uppercase">
                    {question.question}
                  </h2>

                  {/* 문제 이미지/수식 */}
                  {question.image && (
                    <div className="mb-4 lg:mb-6 p-4 lg:p-6 bg-[#E5F9F3] border-4 border-black
                                   shadow-[6px_6px_0px_0px_#000] rotate-1">
                      <div className="text-lg lg:text-xl font-mono text-black font-bold">
                        {question.image}
                      </div>
                    </div>
                  )}
                </div>

                {/* 오른쪽: 브루탈 답안 선택지 */}
                <div className="grid gap-3 lg:gap-4">
                  {question.options.map((option, index) => (
                    <BrutalAnswerChoice
                      key={index}
                      choice={option}
                      index={index}
                      isSelected={selectedAnswer === index}
                      isCorrect={index === question.correctAnswer}
                      isRevealed={showFeedback}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showFeedback || isLoading}
                    />
                  ))}
                </div>
              </div>

              {/* 브루탈 액션 버튼들 */}
              <div className="flex flex-wrap gap-4 justify-center pt-6">
                {!showFeedback && (
                  <>
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null || isLoading}
                      variant={selectedAnswer !== null ? "primary" : "secondary"}
                      size="lg"
                      rotation="mild"
                      className="font-black text-lg px-8 uppercase"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current animate-bounce" />
                            <div className="w-2 h-2 bg-current animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-current animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                          <span>확인 중...</span>
                        </div>
                      ) : (
                        "정답 확인 💥"
                      )}
                    </Button>
                    
                    <Button
                      onClick={handleHint}
                      variant="outline"
                      size="lg"
                      rotation="slight"
                      className="font-black text-lg uppercase"
                    >
                      💡 힌트
                    </Button>
                    
                    <Button
                      onClick={handleSkip}
                      variant="outline"
                      size="lg"
                      rotation="slight"
                      className="font-black text-lg uppercase"
                    >
                      ⏭️ 건너뛰기
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 브루탈 피드백 모달 */}
      <AnimatePresence>
        {showFeedback && (
          <BrutalFeedbackModal
            isCorrect={feedbackType === 'correct'}
            onNext={handleNext}
            concept={question.concept}
          />
        )}
      </AnimatePresence>

      {/* 브루탈 힌트 모달 */}
      <Modal isOpen={showHint} onClose={() => setShowHint(false)}>
        <div className="p-6 space-y-6 bg-[#FFB3F0] border-4 border-black">
          <h3 className="text-2xl font-black text-black uppercase">💡 힌트</h3>
          <p className="text-lg text-black font-bold leading-relaxed">
            {question.hint || `${question.concept} 개념을 떠올려보세요! 차근차근 접근하면 답을 찾을 수 있어요!`}
          </p>
          <Button
            onClick={() => setShowHint(false)}
            variant="primary"
            className="w-full font-black uppercase"
            size="lg"
          >
            알겠어요! 🎯
          </Button>
        </div>
      </Modal>

      {/* 브루탈 나가기 확인 모달 */}
      <Modal isOpen={showExitModal} onClose={() => setShowExitModal(false)}>
        <div className="p-6 space-y-6 text-center bg-red-400 border-4 border-black">
          <div className="text-6xl">😱</div>
          <div>
            <h3 className="text-2xl font-black text-black mb-2 uppercase">정말 나가시겠어요?</h3>
            <p className="text-lg text-black font-bold">
              지금까지의 진행 상황이 모두 사라집니다!
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowExitModal(false)}
              variant="secondary"
              className="flex-1 font-black uppercase"
              size="lg"
            >
              계속하기 💪
            </Button>
            <Button
              onClick={confirmExit}
              variant="danger"
              className="flex-1 font-black uppercase"
              size="lg"
            >
              나가기 😭
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
