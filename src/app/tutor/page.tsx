'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Button, Card, Badge, Input } from '@/components/ui';

// 채팅 컴포넌트들을 동적 로딩
const ChatBubble = dynamic(() => import('@/components/features').then(mod => ({ default: mod.ChatBubble })), {
  loading: () => (
    <div className="flex items-start space-x-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-300 brutal-card" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  ),
});

const TypingIndicator = dynamic(() => import('@/components/features').then(mod => ({ default: mod.TypingIndicator })), {
  loading: () => (
    <div className="flex items-start space-x-3">
      <div className="w-10 h-10 bg-gray-300 brutal-card animate-pulse" />
      <div className="brutal-card p-4">
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  ),
});

import { session, storage, generateId, delay } from '@/lib/utils';
import { 
  ChatMessage, 
  generateTutorResponse, 
  mockRecommendedActions,
  mockPersonalContext 
} from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function TutorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<ChatMessage | null>(null);
  const [showContextSummary, setShowContextSummary] = useState(false);
  const [personalContext, setPersonalContext] = useState(mockPersonalContext);
  const [showSidebar, setShowSidebar] = useState(true);

  // Initialize component
  useEffect(() => {
    // Check authentication
    if (!session.isAuthenticated()) {
      router.push('/auth');
      return;
    }

    // Load context from URL params
    const contextParam = searchParams.get('ctx');
    if (contextParam === 'latest6') {
      setPersonalContext(mockPersonalContext);
      setShowContextSummary(true);
    }

    // Load saved messages
    const savedMessages = storage.get('tutorMessages');
    if (savedMessages && Array.isArray(savedMessages)) {
      setMessages(savedMessages);
    }

    // Welcome message for first visit
    if (!savedMessages || savedMessages.length === 0) {
      setTimeout(() => {
        const welcomeMessage: ChatMessage = {
          id: generateId(),
          content: "안녕하세요! 저는 여러분의 수학 학습을 도와드리는 AI 튜터입니다. 😊\n\n현재 컨텍스트를 보니 최근 문제들에서 어려움을 겪고 계시는군요. 무엇을 도와드릴까요?",
          sender: 'tutor',
          timestamp: new Date(),
          actions: [
            { label: "이차방정식 설명해주세요", action: "이차방정식이 뭐예요?" },
            { label: "함수 그래프 그리는 법", action: "함수 그래프를 어떻게 그려요?" },
            { label: "분수 계산 도와주세요", action: "분수 계산을 도와주세요" }
          ]
        };
        setMessages([welcomeMessage]);
      }, 1000);
    }

    // Focus input on mount
    inputRef.current?.focus();
  }, [router, searchParams]);

  // Save messages when they change
  useEffect(() => {
    if (messages.length > 0) {
      storage.set('tutorMessages', messages);
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);
    setIsTyping(true);

    // Simulate thinking time
    await delay(Math.random() * 200 + 300);

    // Generate tutor responses
    const tutorResponses = generateTutorResponse(userMessage.content);
    
    // Send responses one by one with streaming effect
    for (let i = 0; i < tutorResponses.length; i++) {
      const responseMessage: ChatMessage = {
        id: generateId(),
        content: tutorResponses[i],
        sender: 'tutor',
        timestamp: new Date(),
        actions: i === tutorResponses.length - 1 ? getQuickActions(userMessage.content) : undefined
      };

      // Add empty message first for streaming effect
      setMessages(prev => [...prev, { ...responseMessage, content: '' }]);
      setCurrentStreamingMessage(responseMessage);

      // Wait for typing animation to complete
      await delay(responseMessage.content.length * 25 + 500);

      // Update with final content
      setMessages(prev => 
        prev.map(msg => 
          msg.id === responseMessage.id 
            ? { ...msg, content: responseMessage.content, actions: responseMessage.actions }
            : msg
        )
      );

      setCurrentStreamingMessage(null);

      // Small delay between multiple responses
      if (i < tutorResponses.length - 1) {
        await delay(300);
      }
    }

    setIsTyping(false);
    setIsSending(false);
  };

  const handleQuickAction = async (action: string) => {
    setInputValue(action);
    // Auto-send after a brief moment
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const getQuickActions = (userMessage: string): Array<{ label: string; action: string }> => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('이차방정식') || message.includes('방정식')) {
      return [
        { label: "예제 문제 풀어보기", action: "이차방정식 예제 문제를 풀어주세요" },
        { label: "근의 공식 설명", action: "근의 공식을 설명해주세요" },
        { label: "인수분해 방법", action: "인수분해 하는 방법을 알려주세요" }
      ];
    }
    
    if (message.includes('함수') || message.includes('그래프')) {
      return [
        { label: "그래프 그리기 연습", action: "함수 그래프 그리기를 연습하고 싶어요" },
        { label: "기울기 구하는 법", action: "기울기를 어떻게 구하나요?" },
        { label: "절편 찾는 법", action: "x절편과 y절편을 어떻게 찾나요?" }
      ];
    }
    
    return [
      { label: "비슷한 문제 더 보기", action: "비슷한 문제를 더 보여주세요" },
      { label: "다른 방법으로 설명", action: "다른 방법으로 설명해주세요" },
      { label: "연습 문제 추천", action: "연습할 수 있는 문제를 추천해주세요" }
    ];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    storage.remove('tutorMessages');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-soft/10 to-accent/5 lg:flex">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-screen">
        {/* Mobile Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-bg/95 backdrop-blur-sm border-b-[3px] border-ink p-4 sticky top-0 z-30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => router.back()}
                className="w-8 h-8 brutal-card bg-bg hover:bg-gray-200 flex items-center justify-center text-[14px] transition-colors"
              >
                ←
              </button>
              <div className="w-12 h-12 brutal-card bg-accent flex items-center justify-center pulse-gentle">
                <span className="text-[20px]">🤖</span>
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-ink">AI 수학 튜터</h2>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-[12px] text-ink/60">온라인</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowContextSummary(!showContextSummary)}
                className="brutal-badge bg-soft text-xs hover:bg-accent/20 transition-colors"
              >
                📊 현황
              </button>
              <button
                onClick={clearChat}
                className="brutal-badge bg-error/20 text-xs hover:bg-error/30 transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
          
          {/* Mobile Context Summary */}
          <AnimatePresence>
            {showContextSummary && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 brutal-card p-4 bg-gradient-to-r from-soft/30 to-accent/10 overflow-hidden"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-[16px]">📈</span>
                  <h3 className="text-[14px] font-bold text-ink">학습 현황</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-[20px] font-bold text-accent">
                      {Math.round((personalContext.recentQuestions.filter(q => q.isCorrect).length / personalContext.recentQuestions.length) * 100)}%
                    </div>
                    <div className="text-[10px] font-medium text-ink/70">정답률</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[20px] font-bold text-info">6</div>
                    <div className="text-[10px] font-medium text-ink/70">분석 문항</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[20px] font-bold text-warning">
                      {personalContext.recentQuestions.filter(q => !q.isCorrect).length}
                    </div>
                    <div className="text-[10px] font-medium text-ink/70">취약점</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t-[2px] border-ink/10">
                  <div className="flex flex-wrap gap-1">
                    {personalContext.recentQuestions.slice(0, 3).map((q, i) => (
                      <span key={i} className={`brutal-badge text-xs ${q.isCorrect ? 'bg-success/20' : 'bg-error/20'}`}>
                        {q.concept}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mobile Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center py-12 space-y-6"
            >
              <div className="w-24 h-24 mx-auto brutal-card bg-accent flex items-center justify-center pulse-gentle">
                <span className="text-[32px]">🤖</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-[20px] font-bold text-ink">안녕하세요! 👋</h3>
                <p className="text-[14px] text-ink/70 max-w-sm mx-auto leading-relaxed">
                  저는 여러분의 수학 학습을 도와드리는 AI 튜터예요. 
                  궁금한 것이 있으면 언제든 물어보세요!
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-[12px] font-medium text-ink">추천 질문:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['이차방정식이 뭐예요?', '함수 그래프 그리는 법', '분수 계산 도와주세요'].map((suggestion, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      onClick={() => handleQuickAction(suggestion)}
                      className="brutal-badge bg-soft hover:bg-accent/20 transition-colors text-xs"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ChatBubble
                  message={message}
                  isStreaming={currentStreamingMessage?.id === message.id}
                  onActionClick={handleQuickAction}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Mobile Input */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-bg/95 backdrop-blur-sm border-t-[3px] border-ink p-4"
        >
          <div className="flex space-x-3">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="수학 질문을 입력하세요..."
              disabled={isTyping}
              className="flex-1 brutal-input"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={cn(
                "brutal-button px-4 transition-all duration-200",
                inputValue.trim() && !isTyping ? "bg-accent hover:bg-accent-light" : "bg-gray-300 cursor-not-allowed"
              )}
            >
              {isTyping ? (
                <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
              ) : (
                '🚀'
              )}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen w-full">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col max-w-4xl">
          {/* Desktop Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-bg/95 backdrop-blur-sm border-b-[3px] border-ink p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 brutal-card bg-accent flex items-center justify-center pulse-gentle">
                  <span className="text-[24px]">🤖</span>
                </div>
                <div>
                  <h1 className="text-[24px] font-bold text-ink">AI 수학 튜터</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                    <span className="text-[14px] text-ink/60">온라인 • 개인화된 학습 지원</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="brutal-badge bg-success text-white">
                  <span className="mr-1">⚡</span>
                  즉시 응답
                </div>
                <button
                  onClick={() => setShowContextSummary(!showContextSummary)}
                  className="brutal-button-outline transition-colors"
                >
                  📊 학습 현황
                </button>
                <button
                  onClick={clearChat}
                  className="brutal-button-outline text-error border-error hover:bg-error hover:text-white transition-colors"
                >
                  🗑️ 초기화
                </button>
              </div>
            </div>
            
            {/* Desktop Context Summary */}
            <AnimatePresence>
              {showContextSummary && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 brutal-card p-6 bg-gradient-to-r from-soft/30 to-accent/10 overflow-hidden"
                >
                  <div className="grid grid-cols-4 gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-[32px] font-bold text-accent mb-1">
                        {Math.round((personalContext.recentQuestions.filter(q => q.isCorrect).length / personalContext.recentQuestions.length) * 100)}%
                      </div>
                      <div className="text-[12px] font-medium text-ink/70">정답률</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[32px] font-bold text-info mb-1">6</div>
                      <div className="text-[12px] font-medium text-ink/70">분석 문항</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[32px] font-bold text-warning mb-1">
                        {personalContext.recentQuestions.filter(q => !q.isCorrect).length}
                      </div>
                      <div className="text-[12px] font-medium text-ink/70">취약 개념</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[20px] font-bold text-ink mb-1">{personalContext.grade}</div>
                      <div className="text-[12px] font-medium text-ink/70">현재 학년</div>
                    </div>
                  </div>
                  <div className="border-t-[2px] border-ink/10 pt-4">
                    <p className="text-[14px] font-medium text-ink mb-2">최근 학습 개념:</p>
                    <div className="flex flex-wrap gap-2">
                      {personalContext.recentQuestions.map((q, i) => (
                        <div key={i} className={`brutal-badge text-xs ${q.isCorrect ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                          <span className="mr-1">{q.isCorrect ? '✅' : '❌'}</span>
                          {q.concept}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Desktop Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && !isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center py-16 space-y-8"
              >
                <div className="w-32 h-32 mx-auto brutal-card bg-accent flex items-center justify-center pulse-gentle">
                  <span className="text-[48px]">🤖</span>
                </div>
                <div className="space-y-4">
                  <h2 className="text-[32px] font-bold text-ink">안녕하세요! 👋</h2>
                  <p className="text-[18px] text-ink/70 max-w-2xl mx-auto leading-relaxed">
                    저는 여러분의 수학 학습을 도와드리는 AI 튜터입니다. 
                    개인화된 컨텍스트를 바탕으로 정확하고 친절한 답변을 드릴게요!
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-[16px] font-medium text-ink">추천 질문:</p>
                  <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
                    {[
                      '이차방정식이 뭐예요?', 
                      '함수 그래프 그리는 법', 
                      '분수 계산 도와주세요',
                      '최근 틀린 문제 설명해주세요',
                      '연습 문제 추천해주세요'
                    ].map((suggestion, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        onClick={() => handleQuickAction(suggestion)}
                        className="brutal-card p-4 hover:bg-accent/20 transition-colors text-[14px] font-medium"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatBubble
                    message={message}
                    isStreaming={currentStreamingMessage?.id === message.id}
                    onActionClick={handleQuickAction}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Desktop Input */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-bg/95 backdrop-blur-sm border-t-[3px] border-ink p-6"
          >
            <div className="flex space-x-4">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="수학 질문을 입력하세요... (Enter로 전송)"
                disabled={isTyping}
                className="flex-1 brutal-input text-[16px] h-14"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={cn(
                  "brutal-button h-14 px-8 text-[16px] transition-all duration-200",
                  inputValue.trim() && !isTyping ? "bg-accent hover:bg-accent-light" : "bg-gray-300 cursor-not-allowed"
                )}
              >
                {isTyping ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                    <span>전송 중...</span>
                  </div>
                ) : (
                  <>
                    <span className="mr-2">🚀</span>
                    전송
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Desktop Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 bg-bg/50 backdrop-blur-sm border-l-[3px] border-ink p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-bold text-ink">추천 액션</h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="w-6 h-6 flex items-center justify-center text-ink/60 hover:text-ink"
                >
                  ✕
                </button>
              </div>

              {mockRecommendedActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="brutal-card p-4 hover:bg-accent/10 transition-colors cursor-pointer"
                  onClick={() => handleQuickAction(action.description)}
                >
                  <h4 className="text-[14px] font-bold text-ink mb-2">{action.title}</h4>
                  <p className="text-[12px] text-ink/70">{action.description}</p>
                </motion.div>
              ))}

              <div className="pt-4 border-t-[2px] border-ink/10">
                <h4 className="text-[16px] font-bold text-ink mb-3">빠른 도움말</h4>
                <div className="space-y-2 text-[12px] text-ink/70">
                  <p>• <strong>Enter</strong>: 메시지 전송</p>
                  <p>• <strong>Shift + Enter</strong>: 줄바꿈</p>
                  <p>• 퀵 액션 버튼으로 빠른 질문</p>
                  <p>• 컨텍스트 정보로 개인화된 답변</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Toggle (when hidden) */}
        {!showSidebar && (
          <motion.button
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => setShowSidebar(true)}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 brutal-card p-3 bg-accent hover:bg-accent-light transition-colors z-30"
          >
            <span className="text-[16px]">📋</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}