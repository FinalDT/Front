// Backend API utilities for SQL Server integration

export interface BackendQuizData {
  sessionInfo: {
    session_id: string;
    learnerID: string;
    testID: string;
    grade: string;
    gender: string;
    school: string;
  };
  answers: BackendAnswer[];
}

export interface BackendAnswer {
  ts: string;
  session_id: string;
  learnerID: string;
  testID: string;
  assessmentItemID: string;
  is_correct: 0 | 1;
  seq_in_session: number;
  session_idx: 0 | 1;
  grade: string;
  gender: string;
  school: string;
  processed_at: string;
}

// Configuration constants
export const BACKEND_CONFIG = {
  LEARNER_ID: 'A070000011',
  TEST_ID: 'A070000043',  // 사전평가용 고정
  GENDER: 'M',
  SCHOOL: 'S01',
  BASE_URL: 'http://localhost:3001' // 백엔드 URL
};

/**
 * Generate session_id in required format
 * Format: rt-YYYYMMDD:first6:learnerID:0
 */
export function generateSessionId(learnerID: string = BACKEND_CONFIG.LEARNER_ID): string {
  const now = new Date();
  const dateString = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  return `rt-${dateString}:first6:${learnerID}:0`;
}

/**
 * Generate assessmentItemID from testID and question index
 * Rule: A070{last 3 digits of testID}{question number 001-006}
 */
export function generateAssessmentItemID(testID: string, questionIndex: number): string {
  const testNumber = testID.slice(-3); // Get last 3 digits (e.g., "043")
  const questionNumber = String(questionIndex + 1).padStart(3, '0'); // Convert to "001", "002", etc.
  return `A070${testNumber}${questionNumber}`;
}

/**
 * Transform frontend quiz data to backend format
 */
export function transformQuizDataForBackend(frontendData: {
  sessionId: string;
  grade: string;
  startTime: Date;
  answers: Array<{
    questionIndex: number;
    selectedAnswer: number;
    correctAnswer: number;
    submittedAt: Date;
  }>;
}): BackendQuizData {
  const sessionId = generateSessionId();
  const testID = BACKEND_CONFIG.TEST_ID;

  // Create session info
  const sessionInfo = {
    session_id: sessionId,
    learnerID: BACKEND_CONFIG.LEARNER_ID,
    testID: testID,
    grade: frontendData.grade,
    gender: BACKEND_CONFIG.GENDER,
    school: BACKEND_CONFIG.SCHOOL
  };

  // Transform each answer
  const answers: BackendAnswer[] = frontendData.answers.map((answer) => {
    const assessmentItemID = generateAssessmentItemID(testID, answer.questionIndex);
    const isCorrect = answer.selectedAnswer === answer.correctAnswer ? 1 : 0;
    const now = new Date();

    return {
      ts: answer.submittedAt.toISOString().replace('T', ' ').slice(0, 23), // SQL Server datetime format
      session_id: sessionId,
      learnerID: BACKEND_CONFIG.LEARNER_ID,
      testID: testID,
      assessmentItemID: assessmentItemID,
      is_correct: isCorrect,
      seq_in_session: answer.questionIndex + 1,
      session_idx: 0, // Always 0 for new users
      grade: frontendData.grade,
      gender: BACKEND_CONFIG.GENDER,
      school: BACKEND_CONFIG.SCHOOL,
      processed_at: now.toISOString().replace('T', ' ').slice(0, 23) // SQL Server datetime format
    };
  });

  return {
    sessionInfo,
    answers
  };
}

/**
 * Send quiz data to backend
 */
export async function sendQuizDataToBackend(backendData: BackendQuizData): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/api/quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData)
    });

    if (!response.ok) {
      throw new Error(`Backend API failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    return true;
  } catch (error) {
    // 백엔드 실패해도 프론트엔드는 계속 동작하도록
    return false;
  }
}