'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, SkeletonCard } from '@/components/ui';
import { session, storage } from '@/lib/utils';
import { mockPersonalContext } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [hasQuizResults, setHasQuizResults] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Check authentication
    if (!session.isAuthenticated()) {
      window.location.href = '/auth';
      return;
    }

    // Load user data
    const userId = session.getUserId();
    const userQuizResults = storage.get('userQuizResults');
    const quizStreak = storage.get('quizStreak') || 0;

    setUserName(`수학러버${userId?.slice(-4)}`);
    setHasQuizResults(!!userQuizResults);

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);

    setTimeout(() => setIsLoading(false), 800);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-soft/10 to-accent/5 p-4">
        <div className="max-w-7xl mx-auto pt-8 space-y-8">
          <div className="space-y-4">
            <div className="h-12 bg-gray-300 rounded w-96 animate-pulse" />
            <div className="h-6 bg-gray-300 rounded w-64 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const recentActivities = [
    {
      id: '1',
      type: 'quiz',
      title: '사전평가 완료! 🎉',
      description: '중2 수학 평가 (5문항) • 75% 정답률',
      timestamp: '2시간 전',
      icon: '📝',
      color: 'bg-success/20 border-success'
    },
    {
      id: '2',
      type: 'tutor',
      title: 'AI 튜터와 대화',
      description: '이차방정식 개념 질문 • 3개 답변',
      timestamp: '3시간 전',
      icon: '💬',
      color: 'bg-info/20 border-info'
    },
    {
      id: '3',
      type: 'context',
      title: '학습 분석 업데이트',
      description: '최근 6문항 상세 분석 완료',
      timestamp: '1일 전',
      icon: '📊',
      color: 'bg-warning/20 border-warning'
    }
  ];

  const learningStats = {
    totalQuestions: 24,
    correctAnswers: 18,
    accuracy: 75,
    currentStreak: storage.get('quizStreak') || 3,
    conceptsMastered: 8,
    studyTime: '2시간 30분',
    weeklyGoal: 85,
    weakAreas: ['이차방정식', '함수', '도형']
  };

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return '밤늦게까지 공부하시는군요! 🌙';
    if (hour < 12) return '좋은 아침이에요! ☀️';
    if (hour < 18) return '좋은 오후예요! ☀️';
    if (hour < 22) return '좋은 저녁이에요! 🌅';
    return '늦은 시간까지 수고하세요! 🌙';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-soft/10 to-accent/5">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto p-6 pt-8"
      >
        {/* Hero Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="grid grid-cols-12 h-full">
                {[...Array(48)].map((_, i) => (
                  <div key={i} className="border-r border-ink h-full"></div>
                ))}
              </div>
            </div>
            
            <div className="relative z-10 space-y-4">
              {/* Greeting Badge */}
              <div className="inline-flex items-center space-x-2 brutal-badge bg-accent text-ink">
                <span className="text-sm">👋</span>
                <span className="font-bold text-sm">{greeting()}</span>
              </div>
              
              {/* Main Greeting */}
              <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-[800] text-ink leading-tight">
                안녕하세요, <br className="md:hidden" />
                <span className="text-accent underline decoration-[4px] underline-offset-8">
                  {userName}
                </span>님! 
              </h1>
              
              <p className="text-[18px] md:text-[20px] text-ink/70 max-w-2xl leading-relaxed font-medium">
                오늘도 즐겁게 학습해보세요! 현재 <strong className="text-ink">정답률 {learningStats.accuracy}%</strong>로 
                꾸준히 성장하고 있어요. 🚀
              </p>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Link href="/try">
                  <button className="brutal-button bg-accent hover:bg-accent-light">
                    <span className="mr-2">🎯</span>
                    새 평가 시작
                  </button>
                </Link>
                <Link href="/tutor">
                  <button className="brutal-button-outline">
                    <span className="mr-2">💬</span>
                    튜터와 대화
                  </button>
                </Link>
                <Link href="/context">
                  <button className="brutal-button-outline">
                    <span className="mr-2">📊</span>
                    학습 분석
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Total Questions */}
            <div className="brutal-card p-6 text-center group hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 brutal-card bg-info flex items-center justify-center text-[20px] group-hover:bounce-gentle">
                📝
              </div>
              <div className="text-[28px] md:text-[32px] font-bold text-ink mb-1">
                {learningStats.totalQuestions}
              </div>
              <div className="text-[12px] font-medium text-ink/70">총 문제 수</div>
            </div>

            {/* Accuracy */}
            <div className="brutal-card p-6 text-center group hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 brutal-card bg-accent flex items-center justify-center text-[20px] group-hover:bounce-gentle">
                🎯
              </div>
              <div className="text-[28px] md:text-[32px] font-bold text-accent mb-1">
                {learningStats.accuracy}%
              </div>
              <div className="text-[12px] font-medium text-ink/70">정답률</div>
              <div className="mt-2">
                <div className="brutal-progress h-2">
                  <div 
                    className="brutal-progress-fill h-full"
                    style={{ width: `${learningStats.accuracy}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="brutal-card p-6 text-center group hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 brutal-card bg-warning flex items-center justify-center text-[20px] group-hover:bounce-gentle">
                🔥
              </div>
              <div className="text-[28px] md:text-[32px] font-bold text-ink mb-1">
                {learningStats.currentStreak}
              </div>
              <div className="text-[12px] font-medium text-ink/70">연속 정답</div>
            </div>

            {/* Study Time */}
            <div className="brutal-card p-6 text-center group hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 brutal-card bg-success flex items-center justify-center text-[20px] group-hover:bounce-gentle">
                ⏱️
              </div>
              <div className="text-[16px] md:text-[20px] font-bold text-ink mb-1">
                {learningStats.studyTime}
              </div>
              <div className="text-[12px] font-medium text-ink/70">총 학습 시간</div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Personal Context Preview - Large */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="brutal-card p-8 h-full bg-gradient-to-br from-soft/30 to-accent/10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 brutal-card bg-info flex items-center justify-center text-[20px]">
                      📊
                    </div>
                    <div>
                      <h3 className="text-[24px] font-bold text-ink">개인화 학습 분석</h3>
                      <p className="text-[14px] text-ink/70">최근 활동 기반 맞춤 피드백</p>
                    </div>
                  </div>
                  <div className="brutal-badge bg-accent text-ink">
                    6문항 분석
                  </div>
                </div>

                {/* Context Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Recent Questions */}
                  <div className="space-y-3">
                    <h4 className="text-[16px] font-bold text-ink mb-3">최근 학습 문항</h4>
                    {mockPersonalContext.recentQuestions.slice(0, 4).map((question, index) => (
                      <div
                        key={question.id}
                        className="flex items-center space-x-3 p-3 brutal-card bg-bg/50 hover:bg-bg transition-colors"
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold",
                          question.isCorrect 
                            ? "bg-success text-white" 
                            : "bg-error text-white"
                        )}>
                          {question.isCorrect ? '✓' : '✗'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-medium text-ink truncate">
                            {question.concept}
                          </div>
                          <div className="text-[12px] text-ink/60">
                            {new Date(question.timestamp).toLocaleDateString('ko-KR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Weak Areas */}
                  <div className="space-y-3">
                    <h4 className="text-[16px] font-bold text-ink mb-3">집중 학습 영역</h4>
                    <div className="space-y-3">
                      {learningStats.weakAreas.map((area, index) => (
                        <div key={index} className="brutal-card p-4 bg-warning/10 border-warning/50">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-[16px]">⚠️</span>
                            <span className="text-[14px] font-bold text-ink">{area}</span>
                          </div>
                          <p className="text-[12px] text-ink/70">
                            추가 연습이 필요한 개념입니다
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t-[2px] border-ink/10">
                  <Link href="/context">
                    <Button className="brutal-button w-full bg-info hover:bg-info/80 text-white">
                      <span className="mr-2">📈</span>
                      상세 분석 보기
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Tutor Card */}
          <motion.div variants={itemVariants}>
            <div className="brutal-card p-8 h-full bg-gradient-to-br from-accent/20 to-bg relative overflow-hidden">
              {/* Background Icon */}
              <div className="absolute top-4 right-4 text-[120px] text-accent/10 transform rotate-12">
                🤖
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 brutal-card bg-accent flex items-center justify-center text-[24px] pulse-gentle">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold text-ink">AI 수학 튜터</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <span className="text-[12px] text-ink/60">온라인 • 즉시 응답</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[14px] text-ink/70 leading-relaxed">
                    개인화된 학습기록을 바탕으로 맞춤형 설명과 연습 문제를 받아보세요.
                  </p>

                  {/* Quick Question Suggestions */}
                  <div className="space-y-3">
                    <div className="text-[12px] font-medium text-ink">💡 추천 질문:</div>
                    {[
                      "이차방정식 쉽게 푸는 법",
                      "함수 그래프 그리는 방법",
                      "최근 틀린 문제 해설"
                    ].map((question, i) => (
                      <div key={i} className="brutal-badge bg-soft/50 hover:bg-accent/20 transition-colors text-xs cursor-pointer">
                        {question}
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/tutor">
                  <Button className="brutal-button w-full bg-accent hover:bg-accent-light">
                    <span className="mr-2">💬</span>
                    튜터와 대화하기
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activities */}
        <motion.div variants={itemVariants}>
          <div className="brutal-card p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 brutal-card bg-warning flex items-center justify-center text-[20px]">
                    📋
                  </div>
                  <h3 className="text-[24px] font-bold text-ink">최근 활동</h3>
                </div>
                <button className="brutal-badge bg-soft hover:bg-accent/20 transition-colors text-xs">
                  전체보기
                </button>
              </div>

              {recentActivities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="brutal-card p-6 hover:transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-[20px] border-[3px]",
                            activity.color
                          )}>
                            {activity.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[14px] font-bold text-ink leading-tight">
                              {activity.title}
                            </h4>
                            <p className="text-[12px] text-ink/60 mt-1">
                              {activity.timestamp}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-[13px] text-ink/70 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-6">
                  <div className="w-24 h-24 mx-auto brutal-card bg-soft/50 flex items-center justify-center text-[32px]">
                    📝
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[20px] font-bold text-ink">아직 기록이 없어요</h4>
                    <p className="text-[14px] text-ink/70 max-w-md mx-auto">
                      첫 번째 퀴즈를 풀거나 AI 튜터와 대화를 시작해보세요!
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Link href="/try">
                      <Button className="brutal-button bg-accent">
                        사전평가 시작
                      </Button>
                    </Link>
                    <Link href="/tutor">
                      <Button className="brutal-button-outline">
                        튜터 체험하기
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Weekly Goal Progress */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="brutal-card p-6 bg-gradient-to-r from-success/20 to-accent/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-[24px]">🎯</span>
                <div>
                  <h4 className="text-[18px] font-bold text-ink">주간 목표</h4>
                  <p className="text-[12px] text-ink/70">정답률 85% 달성하기</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[20px] font-bold text-ink">{learningStats.accuracy}%</div>
                <div className="text-[12px] text-ink/60">현재 진행률</div>
              </div>
            </div>
            
            <div className="brutal-progress h-4">
              <div 
                className="brutal-progress-fill h-full transition-all duration-1000 ease-out"
                style={{ width: `${(learningStats.accuracy / learningStats.weeklyGoal) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between mt-2 text-[12px] text-ink/60">
              <span>0%</span>
              <span className="font-bold text-accent">목표: {learningStats.weeklyGoal}%</span>
              <span>100%</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}