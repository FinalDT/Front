'use client';

import { useState } from 'react';
import { Button, Badge } from '@/components/ui';
import { ChatMessage } from '@/lib/mockData';
import { useTyping } from '@/lib/useTyping';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
  onActionClick?: (action: string) => void;
}

export function ChatBubble({ message, isStreaming = false, onActionClick }: ChatBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const { displayedText, isComplete } = useTyping(
    isStreaming ? message.content : '',
    25,
    message.sender === 'tutor' ? 500 : 0
  );

  const isUser = message.sender === 'user';
  const finalText = isStreaming ? displayedText : message.content;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleBookmark = () => {
    // Mock bookmark functionality
    console.log('Bookmarked:', message.content);
  };

  const handleReport = () => {
    // Mock report functionality
    console.log('Reported:', message.content);
  };

  return (
    <div
      className={cn(
        'flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-300',
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-10 h-10 border-[3px] border-ink flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-accent' : 'bg-bg shadow-[0_4px_0_rgba(0,0,0,1)]'
        )}
      >
        <span className="text-[16px]">
          {isUser ? '👤' : '🤖'}
        </span>
      </div>

      {/* Message Container */}
      <div
        className={cn(
          'flex flex-col space-y-2 max-w-[70%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        {/* Message Bubble */}
        <div
          className={cn(
            `
              p-4 border-[3px] border-ink relative
              break-words hyphens-auto
            `,
            isUser
              ? 'bg-accent shadow-[0_6px_0_rgba(0,0,0,1)] rounded-tl-[12px] rounded-bl-[12px] rounded-br-[4px]'
              : 'bg-bg shadow-[0_6px_0_rgba(0,0,0,1)] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px]'
          )}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {/* Message Content */}
          <div className="text-[14px] leading-relaxed text-ink">
            {finalText}
            {isStreaming && !isComplete && (
              <span className="inline-block w-2 h-5 bg-ink ml-1 animate-pulse" />
            )}
          </div>

          {/* Timestamp */}
          <div
            className={cn(
              'text-[10px] text-ink opacity-60 mt-2',
              isUser ? 'text-right' : 'text-left'
            )}
          >
{(() => {
              try {
                // timestamp가 Date 객체가 아닐 경우 Date로 변환
                const timestamp = message.timestamp instanceof Date 
                  ? message.timestamp 
                  : new Date(message.timestamp);
                
                // 유효한 Date 객체인지 확인
                if (isNaN(timestamp.getTime())) {
                  return new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                }
                
                return timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                });
              } catch (error) {
                // 오류 발생시 현재 시간 사용
                return new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                });
              }
            })()}
          </div>

          {/* Message Actions (Desktop) */}
          {showActions && !isUser && (
            <div className="absolute -top-3 right-2 hidden md:flex space-x-1">
              <button
                onClick={handleCopy}
                className="w-8 h-8 bg-bg border-[2px] border-ink hover:bg-accent transition-colors duration-150 flex items-center justify-center"
                title="복사"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <rect x="2" y="2" width="6" height="6" stroke="currentColor" strokeWidth="1" fill="none" />
                  <rect x="4" y="4" width="6" height="6" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
              </button>
              <button
                onClick={handleBookmark}
                className="w-8 h-8 bg-bg border-[2px] border-ink hover:bg-accent transition-colors duration-150 flex items-center justify-center"
                title="북마크"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M2 0h8v12l-4-3-4 3V0z" />
                </svg>
              </button>
              <button
                onClick={handleReport}
                className="w-8 h-8 bg-bg border-[2px] border-ink hover:bg-accent transition-colors duration-150 flex items-center justify-center"
                title="신고"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" fill="none" />
                  <text x="6" y="8" textAnchor="middle" fontSize="8" fill="currentColor">!</text>
                </svg>
              </button>
            </div>
          )}

          {/* Message Tail */}
          <div
            className={cn(
              'absolute w-0 h-0 border-[6px] border-transparent border-solid',
              isUser
                ? 'right-[-9px] bottom-4 border-l-accent border-l-[6px]'
                : 'left-[-9px] bottom-4 border-r-bg border-r-[6px]'
            )}
          />
          <div
            className={cn(
              'absolute w-0 h-0 border-[8px] border-transparent border-solid',
              isUser
                ? 'right-[-11px] bottom-[14px] border-l-ink border-l-[8px]'
                : 'left-[-11px] bottom-[14px] border-r-ink border-r-[8px]'
            )}
          />
        </div>

        {/* Quick Actions */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.actions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                onClick={() => onActionClick?.(action.action)}
                className="text-[12px]"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {/* Mobile Actions */}
        {!isUser && (
          <div className="flex md:hidden space-x-2 mt-1">
            <button
              onClick={handleCopy}
              className="text-[10px] text-ink opacity-60 hover:opacity-100 underline"
            >
              복사
            </button>
            <button
              onClick={handleBookmark}
              className="text-[10px] text-ink opacity-60 hover:opacity-100 underline"
            >
              북마크
            </button>
            <button
              onClick={handleReport}
              className="text-[10px] text-ink opacity-60 hover:opacity-100 underline"
            >
              신고
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Typing indicator component
export function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-300">
      {/* Avatar */}
      <div className="w-10 h-10 border-[3px] border-ink bg-bg shadow-[0_4px_0_rgba(0,0,0,1)] flex items-center justify-center flex-shrink-0">
        <span className="text-[16px]">🤖</span>
      </div>

      {/* Typing Bubble */}
      <div className="p-4 border-[3px] border-ink bg-bg shadow-[0_6px_0_rgba(0,0,0,1)] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] relative">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-ink rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.4s'
              }}
            />
          ))}
        </div>

        {/* Tail */}
        <div className="absolute left-[-9px] bottom-4 w-0 h-0 border-[6px] border-transparent border-solid border-r-bg border-r-[6px]" />
        <div className="absolute left-[-11px] bottom-[14px] w-0 h-0 border-[8px] border-transparent border-solid border-r-ink border-r-[8px]" />
      </div>
    </div>
  );
}