import { type ClassValue, clsx } from "clsx";

// Utility function to combine class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Generate UUID for mock data
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Simulate async operations with delay
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Format text for accessibility
export function formatAccessibleText(text: string): string {
  return text.replace(/[_-]/g, ' ').toLowerCase();
}

// Validate grade selection
export type Grade = '중1' | '중2' | '중3';

export function isValidGrade(grade: string): grade is Grade {
  return ['중1', '중2', '중3'].includes(grade);
}

// Local storage helpers
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: (key: string, value: unknown) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore errors
    }
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  }
};

// Session helpers for auth
export const session = {
  isAuthenticated: () => {
    return storage.get('auth_user_id') !== null;
  },

  getUserId: () => {
    return storage.get('auth_user_id');
  },

  login: (userId: string) => {
    storage.set('auth_user_id', userId);
    // 인증 상태 변경 이벤트 발생
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('authChange', { detail: { type: 'login', userId } }));
    }
  },

  logout: () => {
    storage.remove('auth_user_id');
    storage.remove('guestSessionId');
    storage.remove('lastQuiz');
    // 인증 상태 변경 이벤트 발생
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('authChange', { detail: { type: 'logout' } }));
    }
  }
};

// Mock data helpers
export function randomChoice<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('Cannot choose from empty array');
  }
  return array[Math.floor(Math.random() * array.length)]!;
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

// 학기 계산 로직
export type Semester = 1 | 2;

export function getCurrentSemester(date: Date = new Date()): Semester {
  const month = date.getMonth() + 1; // 0-based to 1-based

  // 3월~8월: 1학기, 9월~2월: 2학기
  if (month >= 3 && month <= 8) {
    return 1;
  } else {
    return 2;
  }
}

// 학년을 숫자로 변환 (백엔드 전송용)
export function gradeToNumber(grade: Grade): number {
  switch (grade) {
    case '중1': return 1;
    case '중2': return 2;
    case '중3': return 3;
    default: return 2;
  }
}

// 숫자를 학년으로 변환
export function numberToGrade(num: number): Grade {
  switch (num) {
    case 1: return '중1';
    case 2: return '중2';
    case 3: return '중3';
    default: return '중2';
  }
}

// SVG 이미지 보안 및 정리 함수들
export function sanitizeSvg(svgString: string): string {
  // 기본적인 SVG 정리 - 스크립트 태그와 이벤트 핸들러 제거
  return svgString
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/<iframe/gi, '<div')
    .replace(/<\/iframe>/gi, '</div>')
    .replace(/<object/gi, '<div')
    .replace(/<\/object>/gi, '</div>');
}

// SVG 크기 정규화 함수
export function normalizeSvgSize(svgString: string, maxWidth: number = 500, maxHeight: number = 400): string {
  // SVG에 viewBox와 크기 제한 추가
  if (svgString.includes('<svg')) {
    let normalizedSvg = svgString;

    // 기존 width, height 속성 제거
    normalizedSvg = normalizedSvg.replace(/\s+width="[^"]*"/gi, '');
    normalizedSvg = normalizedSvg.replace(/\s+height="[^"]*"/gi, '');

    // 새로운 크기 제한 추가
    normalizedSvg = normalizedSvg.replace(
      /<svg/i,
      `<svg width="100%" height="100%" style="max-width:${maxWidth}px;max-height:${maxHeight}px;"`
    );

    return normalizedSvg;
  }

  return svgString;
}

// SVG 이미지 전체 처리 함수 (보안 + 정규화)
export function processSvgImage(svgString: string, maxWidth?: number, maxHeight?: number): string {
  if (!svgString || typeof svgString !== 'string') {
    return '';
  }

  const sanitized = sanitizeSvg(svgString);
  const normalized = normalizeSvgSize(sanitized, maxWidth, maxHeight);

  return normalized;
}