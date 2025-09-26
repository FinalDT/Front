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
    }
  },

  // 퀴즈 데이터 무효화
  invalidateQuiz: (grade?: string) => {
    if (typeof window === 'undefined') {
      // 서버 사이드에서만 실행
    }
  },

  // 특정 경로 무효화
  invalidatePath: (path: string) => {
    if (typeof window === 'undefined') {
      // 서버 사이드에서만 실행
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

// 새로운 백엔드 API 타입들
export interface APIResponse {
  success: boolean;
  message?: string;
  generated_questions: Question[];
  total_generated: number;
  concepts_used: number;
  grade_info: GradeInfo;
  retrieval_strategy?: string;
  target_accuracy_range?: string;
  validation?: ValidationInfo;
  status_code?: number;
}

export interface Question {
  assessmentItemID: string;    // 문제 ID
  concept_name: string;        // 개념명
  question_text: string;       // 문제 내용
  choices: string[];           // 선택지 (4개)
  answer: string;              // 정답 (①, ②, ③, ④)
  explanation: string;         // 해설
  svg_content: string | null;  // SVG 그림 (도형 문제시)
  skip: boolean;               // 건너뛰기 여부
  id: string;                  // 문제 ID (중복)
  metadata: {
    grade: number;             // 학년 (7=중1, 8=중2, 9=중3)
    term: string;              // 학기 ("1학기", "2학기")
    concept_name: string;      // 개념명
    chapter_name: string;      // 단원명
    difficulty_band: string;   // 난이도 (상/중/하)
    knowledge_tag: string;     // 지식 태그
    unit_name: string;         // 단원명
  };
}

export interface GradeInfo {
  korean_grade: number;        // 한국식 학년 (1, 2, 3)
  international_grade: number; // 국제식 학년 (7, 8, 9)
  grade_description: string;   // 학년 설명 ("중학교 2학년")
}

export interface ValidationInfo {
  validation_passed: boolean;
  validation_errors?: string[];
}

// 기존 문제 생성 API 관련 타입들 (호환성 유지)
export interface GenerateQuestionsRequest {
  grade: number;
  semester: number;
}

export interface GenerateQuestionsResponse {
  questions: QuizQuestion[];
  success: boolean;
  message?: string;
}

// QuizQuestion 임포트 (mockData에서)
import { QuizQuestion, mockQuizQuestions } from './mockData';
import { numberToGrade } from './utils';

/**
 * API Question을 기존 QuizQuestion 형태로 변환
 * @param apiQuestion - API에서 받은 Question 객체
 * @returns QuizQuestion 형태로 변환된 객체
 */
export function convertApiQuestionToQuizQuestion(apiQuestion: Question): QuizQuestion {
  // 정답 문자열을 인덱스로 변환 (① → 0, ② → 1, ③ → 2, ④ → 3)
  const answerIndex = convertAnswerToIndex(apiQuestion.answer);
  
  // 난이도 변환 (상/중/하 → easy/medium/hard)
  const difficulty = convertDifficulty(apiQuestion.metadata.difficulty_band);
  
  // 학년 변환 (7=중1, 8=중2, 9=중3)
  const grade = convertGrade(apiQuestion.metadata.grade);
  
  return {
    id: apiQuestion.assessmentItemID,
    question: apiQuestion.question_text,
    options: apiQuestion.choices,
    correctAnswer: answerIndex,
    concept: apiQuestion.concept_name,
    difficulty: difficulty,
    type: '객관식', // API에서 항상 객관식으로 제공
    ...(apiQuestion.svg_content && { imageSvg: apiQuestion.svg_content }),
    imageAlt: `${apiQuestion.concept_name} 관련 문제 이미지`,
    hint: apiQuestion.explanation,
    explanation: apiQuestion.explanation,
    timestamp: new Date()
  };
}

/**
 * 정답 문자열을 인덱스로 변환
 * @param answer - 정답 문자열 (①, ②, ③, ④)
 * @returns 인덱스 (0, 1, 2, 3)
 */
function convertAnswerToIndex(answer: string): number {
  const answerMap: Record<string, number> = {
    '①': 0,
    '②': 1,
    '③': 2,
    '④': 3
  };
  
  return answerMap[answer] ?? 0;
}

/**
 * 난이도 변환
 * @param difficultyBand - API 난이도 (상/중/하)
 * @returns QuizQuestion 난이도 (hard/medium/easy)
 */
function convertDifficulty(difficultyBand: string): 'easy' | 'medium' | 'hard' {
  switch (difficultyBand) {
    case '상':
      return 'hard';
    case '중':
      return 'medium';
    case '하':
      return 'easy';
    default:
      return 'medium';
  }
}

/**
 * 학년 변환
 * @param grade - API 학년 (7, 8, 9)
 * @returns 한국식 학년 (중1, 중2, 중3)
 */
function convertGrade(grade: number): '중1' | '중2' | '중3' {
  switch (grade) {
    case 7:
      return '중1';
    case 8:
      return '중2';
    case 9:
      return '중3';
    default:
      return '중2';
  }
}

/**
 * 백엔드에서 문제 생성 API 호출 (새로운 API 사용)
 * @param grade - 학년 (1, 2, 3)
 * @param semester - 학기 (1, 2) - 현재 API에서는 사용하지 않음
 * @returns Promise<QuizQuestion[]>
 */
export async function generateQuestions(
  grade: number,
  semester: number
): Promise<QuizQuestion[]> {
  try {
    // 새로운 백엔드 API 엔드포인트
    const apiUrl = 'http://localhost:7071/api/create_by_view_rag_personalized';
    
    const response = await fetch(`${apiUrl}?grade=${grade}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // 항상 최신 문제 생성
    });

    if (!response.ok) {
      throw new Error(`문제 생성 실패: ${response.status} ${response.statusText}`);
    }

    const result: APIResponse = await response.json();

    if (!result.success || !result.generated_questions) {
      throw new Error(result.message || '문제 생성에 실패했습니다.');
    }

    // API 응답을 기존 QuizQuestion 형태로 변환
    const convertedQuestions = result.generated_questions.map(convertApiQuestionToQuizQuestion);
    
    return convertedQuestions;
  } catch (error) {
    console.error('문제 생성 API 호출 실패:', error);
    
    // API 호출 실패 시 기존 mock 데이터로 폴백
    console.warn('API 호출 실패로 인해 mock 데이터를 사용합니다.');
    return getFallbackQuestions(grade);
  }
}

/**
 * API 호출 실패 시 사용할 폴백 문제 데이터
 * @param grade - 학년 (1, 2, 3)
 * @returns QuizQuestion[] - mock 데이터
 */
function getFallbackQuestions(grade: number): QuizQuestion[] {
  const gradeKey = numberToGrade(grade);
  const mockQuestions = mockQuizQuestions[gradeKey];
  
  if (!mockQuestions || mockQuestions.length === 0) {
    // 기본 문제가 없으면 중2 문제 사용
    return mockQuizQuestions['중2'] || [];
  }
  
  return mockQuestions;
}
