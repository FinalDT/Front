'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Modal } from '@/components/ui';
import { AnimatedQuizTimer } from './AnimatedQuizTimer';
import { QuizQuestion, mockQuizQuestions } from '@/lib/mockData';
import { Grade, storage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CuteQuizProps {
  sessionId: string;
}

export function CuteQuiz({ sessionId }: CuteQuizProps) {
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

  // Load session and questions
  useEffect(() => {
    const session = storage.get('guestSession');
    if (!session || session.id !== sessionId) {
      router.push('/try');
      return;
    }

    setGrade(session.grade);
    setQuestions(mockQuizQuestions[session.grade as Grade]);

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

    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    storage.set('quizAnswers', newAnswers);

    // Show feedback
    setTimeout(() => {
      setShowFeedback(true);
      setIsLoading(false);
      
      // Auto-advance after correct answer with celebration
      if (isCorrect) {
        setTimeout(() => {
          handleNext();
        }, 2000); // 2초로 늘려서 축하 애니메이션 충분히 보여주기
      }
    }, 500);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setFeedbackType(null);
    setSelectedAnswer(null);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz completed - 부드러운 완료 처리
      setIsLoading(true);
      
      setTimeout(() => {
        // 완전한 세션 데이터 저장
        const session = storage.get('guestSession');
        if (session) {
          session.answers = answers;
          session.completed = true;
          storage.set('guestSession', session);
          storage.set('lastQuiz', answers);
        }
        storage.set('quizCompleted', true);
        
        // 올바른 파라미터로 이동
        router.push(`/results-teaser?session=${sessionId}`);
      }, 800); // 800ms 후 이동으로 부드러운 전환
    }
  };

  const handleTimeUp = () => {
    if (showFeedback) return;
    
    setHearts(prev => Math.max(0, prev - 1));
    storage.set('quizHearts', Math.max(0, hearts - 1));
    setStreak(0);
    storage.set('quizStreak', 0);
    
    // Auto-select random answer or skip
    setFeedbackType('wrong');
    setShowFeedback(true);
    
    setTimeout(() => {
      handleNext();
    }, 2000);
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

  // Animation variants
  const questionVariants = {
    enter: { opacity: 0, x: 100, scale: 0.9, rotateY: 15 },
    center: { opacity: 1, x: 0, scale: 1, rotateY: 0 },
    exit: { opacity: 0, x: -100, scale: 0.9, rotateY: -15 }
  };

  const answerVariants = {
    idle: { scale: 1, rotate: 0 },
    hover: { scale: 1.01, rotate: 0 }, // hover 효과 줄임
    selected: { scale: 1.02, rotate: 0 }, // selected 효과도 줄임
    correct: { scale: 1.1, rotate: [0, 5, -5, 0] },
    wrong: { scale: 0.95, rotate: [0, -10, 10, -5, 5, 0] }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-soft-light/30 to-accent-light/10">
      {/* Header Bar */}
      <div className="sticky top-0 z-40 bg-bg/95 backdrop-blur-sm border-b-[3px] border-border">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          {/* Progress & Hearts */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleExit}
              className="w-8 h-8 brutal-card bg-bg hover:bg-accent-light flex items-center justify-center text-[14px] rounded-full"
            >
              ✕
            </button>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-[20px] ${i < hearts ? '' : 'opacity-30'}`}>
                  {i < hearts ? '❤️' : '🤍'}
                </span>
              ))}
            </div>
          </div>

          {/* Question Progress */}
          <div className="flex-1 mx-6">
            <div className="brutal-progress h-4">
              <motion.div
                className="brutal-progress-fill h-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="text-center mt-2 text-[12px] font-bold text-ink">
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center space-x-2">
            <span className="text-[20px]">🔥</span>
            <span className="text-[18px] font-bold text-accent">{streak}</span>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="w-full">
        <AnimatedQuizTimer
          duration={45}
          onTimeUp={handleTimeUp}
          isActive={isTimerActive && !showFeedback}
          questionNumber={currentQuestion}
          className="w-full"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              variants={questionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94],
                staggerChildren: 0.1
              }}
              className="space-y-8"
            >
              {/* Question Card */}
              <div className="brutal-card p-8 text-center bg-bg rounded-4xl">
                {/* Question Type Badge */}
                <div className="inline-flex items-center space-x-2 brutal-badge bg-soft-light mb-6 rounded-full">
                  <span className="text-sm">📝</span>
                  <span className="font-bold text-sm">{question.type || '객관식'}</span>
                </div>

                {/* Question Text */}
                <h2 className="text-[24px] md:text-[32px] font-bold text-ink mb-6 leading-tight">
                  {question.question}
                </h2>

                {/* Question Image/Math */}
                {question.image && (
                  <div className="mb-6 p-4 brutal-card bg-soft/30">
                    <div className="text-[18px] font-mono text-ink">
                      {question.image}
                    </div>
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="grid gap-4">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    variants={answerVariants}
                    initial="idle"
                    whileHover={(!showFeedback && !isLoading) ? "hover" : "idle"}
                    animate={
                      showFeedback
                        ? index === question.correctAnswer
                          ? "correct"
                          : index === selectedAnswer
                          ? "wrong"
                          : "idle"
                        : selectedAnswer === index
                        ? "selected"
                        : "idle"
                    }
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showFeedback || isLoading}
                    className={cn(
                      "brutal-card p-6 text-left transition-all duration-200 text-[18px] font-medium rounded-3xl",
                      selectedAnswer === index && !showFeedback && "bg-accent-light border-accent border-[4px]",
                      showFeedback && index === question.correctAnswer && "bg-success text-white border-success",
                      showFeedback && index === selectedAnswer && index !== question.correctAnswer && "bg-error text-white border-error",
                      !showFeedback && "hover:bg-accent-light/30 cursor-pointer",
                      (showFeedback || isLoading) && "cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Option Letter */}
                      <div className={cn(
                        "w-10 h-10 rounded-full border-[3px] border-border flex items-center justify-center font-bold",
                        selectedAnswer === index && !showFeedback && "bg-accent text-white border-accent",
                        showFeedback && index === question.correctAnswer && "bg-white text-success border-success",
                        showFeedback && index === selectedAnswer && index !== question.correctAnswer && "bg-white text-error border-error",
                        !selectedAnswer && !showFeedback && "bg-soft-light text-ink"
                      )}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      
                      {/* Option Text */}
                      <span className="flex-1">{option}</span>
                      
                      {/* Feedback Icons */}
                      {showFeedback && (
                        <div className="text-[24px]">
                          {index === question.correctAnswer ? '✅' : 
                           index === selectedAnswer ? '❌' : ''}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center pt-6">
                {!showFeedback && (
                  <>
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null || isLoading}
                      className={cn(
                        "brutal-button h-14 px-8 text-[16px] font-bold",
                        selectedAnswer !== null ? "bg-accent" : "bg-gray-300 cursor-not-allowed"
                      )}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin w-4 h-4 border-2 border-ink border-t-transparent rounded-full" />
                          <span>확인 중...</span>
                        </div>
                      ) : (
                        "정답 확인 ✨"
                      )}
                    </Button>
                    
                    <Button
                      onClick={handleHint}
                      className="brutal-button-outline h-14 px-6 text-[16px]"
                    >
                      💡 힌트
                    </Button>
                    
                    <Button
                      onClick={handleSkip}
                      className="brutal-button-outline h-14 px-6 text-[16px]"
                    >
                      ⏭️ 건너뛰기
                    </Button>
                  </>
                )}

                {showFeedback && feedbackType === 'wrong' && (
                  <Button
                    onClick={handleNext}
                    className="brutal-button bg-accent h-14 px-8 text-[16px] font-bold"
                  >
                    다음 문제 ➡️
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 backdrop-blur-sm"
            onClick={handleNext} // 배경 클릭 시 다음 문제로
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="brutal-card bg-bg p-8 m-4 max-w-md text-center space-y-6 relative rounded-4xl"
              onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 중단
            >
              {/* 닫기 버튼 */}
              <button
                onClick={handleNext}
                className="absolute top-4 right-4 w-8 h-8 brutal-card bg-bg hover:bg-accent-light flex items-center justify-center text-[14px] transition-colors rounded-full"
              >
                ✕
              </button>
              <div className="text-[64px]">
                {feedbackType === 'correct' ? '🎉' : '💤'}
              </div>
              
              <div>
                <h3 className="text-[24px] font-bold text-ink mb-2">
                  {feedbackType === 'correct' ? '정답이에요! ✨' : '아쉬워요! 💪'}
                </h3>
                <p className="text-[16px] text-ink/70">
                  {feedbackType === 'correct' 
                    ? `좋아요! ${question.concept} 개념을 잘 이해하고 있네요!`
                    : `${question.concept} 개념을 다시 한 번 살펴보세요.`
                  }
                </p>
              </div>

              {feedbackType === 'correct' && (
                <div className="space-y-2">
                  <div className="brutal-badge bg-success text-white">
                    +10 XP 획득!
                  </div>
                  {streak > 0 && (
                    <div className="brutal-badge bg-warning">
                      🔥 {streak + 1} 연속 정답!
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Modal */}
      <Modal isOpen={showHint} onClose={() => setShowHint(false)}>
        <div className="p-6 space-y-4">
          <h3 className="text-[20px] font-bold text-ink">💡 힌트</h3>
          <p className="text-[16px] text-ink/70 leading-relaxed">
            {question.hint || `${question.concept} 개념을 떠올려보세요. 차근차근 접근해보면 답을 찾을 수 있어요!`}
          </p>
          <Button
            onClick={() => setShowHint(false)}
            className="brutal-button w-full"
          >
            알겠어요! 🎯
          </Button>
        </div>
      </Modal>

      {/* Exit Confirmation Modal */}
      <Modal isOpen={showExitModal} onClose={() => setShowExitModal(false)}>
        <div className="p-6 space-y-6 text-center">
          <div className="text-[48px]">😢</div>
          <div>
            <h3 className="text-[20px] font-bold text-ink mb-2">정말 나가시겠어요?</h3>
            <p className="text-[14px] text-ink/70">
              지금까지의 진행 상황이 저장되지 않아요.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowExitModal(false)}
              className="brutal-button-outline flex-1"
            >
              계속하기 💪
            </Button>
            <Button
              onClick={confirmExit}
              className="brutal-button bg-error text-white flex-1"
            >
              나가기 😭
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
