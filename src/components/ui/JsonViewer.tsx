'use client';

import { useState } from 'react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface JsonViewerProps {
  data: any;
  title?: string;
  className?: string;
}

export function JsonViewer({ data, title = 'JSON 데이터', className }: JsonViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPretty, setIsPretty] = useState(true);
  const [copied, setCopied] = useState(false);

  const jsonString = isPretty
    ? JSON.stringify(data, null, 2)
    : JSON.stringify(data);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  const lineCount = jsonString.split('\n').length;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-ink">{title}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPretty(!isPretty)}
            className="px-3 py-1 text-[12px] border-[2px] border-ink bg-bg text-ink hover:bg-accent transition-colors duration-150"
            aria-label={isPretty ? '압축 모드로 전환' : '프리티 모드로 전환'}
          >
            {isPretty ? '압축' : '프리티'}
          </button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="text-[12px]"
            aria-label="JSON 복사"
          >
            {copied ? '복사됨!' : '복사'}
          </Button>
        </div>
      </div>

      {/* JSON Content */}
      <div className="border-[3px] border-ink bg-bg">
        {/* Toggle Button for Mobile */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden w-full p-3 text-left border-b-[3px] border-ink bg-accent text-ink font-medium hover:bg-accent/80 transition-colors duration-150"
          aria-expanded={isExpanded}
          aria-controls="json-content"
        >
          <div className="flex items-center justify-between">
            <span>JSON 보기 ({lineCount}줄)</span>
            <span className="text-[16px]">
              {isExpanded ? '▲' : '▼'}
            </span>
          </div>
        </button>

        {/* JSON Display */}
        <div
          id="json-content"
          className={cn(
            'transition-all duration-300',
            isExpanded || 'hidden md:block'
          )}
        >
          <div className="p-4 max-h-96 overflow-auto">
            <pre
              className="text-[12px] font-mono leading-relaxed text-ink whitespace-pre-wrap break-all"
              aria-label="JSON 데이터"
            >
              {jsonString}
            </pre>
          </div>

          {/* Line Numbers (Desktop only) */}
          <div className="hidden md:block absolute left-0 top-0 p-4 pointer-events-none">
            <div className="text-[10px] font-mono text-ink opacity-40 space-y-[1.5rem]">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i + 1} className="text-right pr-2">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-[12px] text-ink opacity-60">
        <span>크기: {new Blob([jsonString]).size} bytes</span>
        <span className="mx-2">•</span>
        <span>줄 수: {lineCount}</span>
      </div>
    </div>
  );
}