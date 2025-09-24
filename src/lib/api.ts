// API 호출 유틸리티 - 캐시 정책 표준화

export interface ApiOptions extends RequestInit {
  revalidate?: number;
  tags?: string[];
}

/**
 * 정적 데이터 페칭 (거의 변하지 않는 데이터)
 * - 기본 캐시, 무효화는 태그로 관리
 */
export async function fetchStatic<T>(url: string, options?: ApiOptions): Promise<T> {
  const response = await fetch(url, {
    ...options,
    cache: 'force-cache',
    next: {
      tags: options?.tags || ['static'],
    }
  });
  
  if (!response.ok) {
    throw new Error(`Static fetch failed: ${response.status}`);
  }
  
  return response.json();
}

/**
 * 주기적 갱신 데이터 페칭 (5분마다 갱신)
 * - 사용자 대시보드, 학습 진도 등
 */
export async function fetchPeriodic<T>(url: string, options?: ApiOptions): Promise<T> {
  const response = await fetch(url, {
    ...options,
    next: {
      revalidate: options?.revalidate || 300, // 5분
      tags: options?.tags || ['periodic'],
    }
  });
  
  if (!response.ok) {
    throw new Error(`Periodic fetch failed: ${response.status}`);
  }
  
  return response.json();
}

/**
 * 실시간 데이터 페칭 (항상 최신)
 * - 채팅 메시지, 실시간 알림 등
 */
export async function fetchRealtime<T>(url: string, options?: ApiOptions): Promise<T> {
  const response = await fetch(url, {
    ...options,
    cache: 'no-store',
    next: {
      tags: options?.tags || ['realtime'],
    }
  });
  
  if (!response.ok) {
    throw new Error(`Realtime fetch failed: ${response.status}`);
  }
  
  return response.json();
}

/**
 * 사용자별 데이터 페칭 (1분마다 갱신)
 * - 개인화 컨텍스트, 설정 등
 */
export async function fetchUserData<T>(url: string, userId: string, options?: ApiOptions): Promise<T> {
  const response = await fetch(url, {
    ...options,
    next: {
      revalidate: options?.revalidate || 60, // 1분
      tags: options?.tags || [`user:${userId}`, 'user-data'],
    }
  });
  
  if (!response.ok) {
    throw new Error(`User data fetch failed: ${response.status}`);
  }
  
  return response.json();
}

/**
 * 퀴즈/문제 데이터 페칭 (10분마다 갱신)
 * - 문제 세트, 난이도별 문제 등
 */
export async function fetchQuizData<T>(url: string, grade: string, options?: ApiOptions): Promise<T> {
  const response = await fetch(url, {
    ...options,
    next: {
      revalidate: options?.revalidate || 600, // 10분
      tags: options?.tags || [`quiz:${grade}`, 'quiz-data'],
    }
  });
  
  if (!response.ok) {
    throw new Error(`Quiz data fetch failed: ${response.status}`);
  }
  
  return response.json();
}

// 캐시 무효화 유틸리티
export const cacheUtils = {
  // 사용자 데이터 무효화
  invalidateUser: (userId: string) => {
    if (typeof window === 'undefined') {
      // 서버 사이드에서만 실행
      console.log(`Invalidating user: ${userId}`);
    }
  },
  
  // 퀴즈 데이터 무효화
  invalidateQuiz: (grade?: string) => {
    if (typeof window === 'undefined') {
      // 서버 사이드에서만 실행
      console.log(`Invalidating quiz: ${grade || 'all'}`);
    }
  },
  
  // 특정 경로 무효화
  invalidatePath: (path: string) => {
    if (typeof window === 'undefined') {
      // 서버 사이드에서만 실행
      console.log(`Invalidating path: ${path}`);
    }
  }
};

// 타입 안전한 API 응답 검증 (zod 스키마 사용 예정)
export function validateResponse<T>(data: unknown, validator?: (data: unknown) => data is T): T {
  if (validator && !validator(data)) {
    throw new Error('Invalid API response format');
  }
  return data as T;
}
