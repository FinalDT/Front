import { Grade } from './utils';

// Quiz question interface
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  concept: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type?: '객관식' | '주관식' | '서술형';
  image?: string;
  hint?: string;
  isCorrect?: boolean;
  timestamp?: Date | string;
  explanation?: string;
}

// Quiz result interface
export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  estimatedLevel: string;
  conceptScores: Array<{
    concept: string;
    score: number;
    maxScore: number;
  }>;
  weakAreas: string[];
  recommendations: string[];
}

// Mock quiz questions by grade
export const mockQuizQuestions: Record<Grade, QuizQuestion[]> = {
  '중1': [
    {
      id: '1-1',
      question: '다음 중 정수가 아닌 것은?',
      options: ['-3', '0', '1/2', '5'],
      correctAnswer: 2,
      concept: '정수와 유리수',
      difficulty: 'easy',
      type: '객관식'
    },
    {
      id: '1-2',
      question: '(-2) × 3 + 4의 값은?',
      options: ['-2', '-1', '2', '10'],
      correctAnswer: 0,
      concept: '정수의 사칙연산',
      difficulty: 'easy'
    },
    {
      id: '1-3',
      question: '2x + 5 = 11일 때, x의 값은?',
      options: ['2', '3', '8', '16'],
      correctAnswer: 1,
      concept: '일차방정식',
      difficulty: 'medium'
    },
    {
      id: '1-4',
      question: '직선 y = 2x + 1의 기울기는?',
      options: ['1', '2', '-1', '1/2'],
      correctAnswer: 1,
      concept: '일차함수',
      difficulty: 'medium'
    },
    {
      id: '1-5',
      question: '삼각형의 내각의 합은?',
      options: ['90°', '180°', '270°', '360°'],
      correctAnswer: 1,
      concept: '평면도형',
      difficulty: 'easy'
    },
    {
      id: '1-6',
      question: '2⁴의 값은?',
      options: ['8', '16', '32', '64'],
      correctAnswer: 1,
      concept: '거듭제곱',
      difficulty: 'easy'
    }
  ],
  '중2': [
    {
      id: '2-1',
      question: '다음 중 무리수는?',
      options: ['1/3', '0.333...', '√2', '22/7'],
      correctAnswer: 2,
      concept: '유리수와 무리수',
      difficulty: 'medium'
    },
    {
      id: '2-2',
      question: '(x + 2)(x - 3)을 전개하면?',
      options: ['x² - x - 6', 'x² + x - 6', 'x² - x + 6', 'x² + x + 6'],
      correctAnswer: 0,
      concept: '식의 계산',
      difficulty: 'medium'
    },
    {
      id: '2-3',
      question: 'x² - 5x + 6 = 0의 해는?',
      options: ['x = 1, 6', 'x = 2, 3', 'x = -2, -3', 'x = -1, -6'],
      correctAnswer: 1,
      concept: '이차방정식',
      difficulty: 'hard'
    },
    {
      id: '2-4',
      question: '일차함수 y = -2x + 3에서 x가 1만큼 증가할 때 y의 변화량은?',
      options: ['-2', '-1', '1', '2'],
      correctAnswer: 0,
      concept: '일차함수',
      difficulty: 'medium'
    },
    {
      id: '2-5',
      question: '평행사변형의 대각선이 교차하는 점은 각 대각선을 몇 대 몇으로 나누는가?',
      options: ['1:1', '1:2', '2:1', '1:3'],
      correctAnswer: 0,
      concept: '사각형의 성질',
      difficulty: 'medium'
    },
    {
      id: '2-6',
      question: '연립방정식 { x + y = 5, x - y = 1 }의 해는?',
      options: ['x=3, y=2', 'x=2, y=3', 'x=4, y=1', 'x=1, y=4'],
      correctAnswer: 0,
      concept: '연립방정식',
      difficulty: 'medium'
    }
  ],
  '중3': [
    {
      id: '3-1',
      question: '√18을 간단히 하면?',
      options: ['3√2', '2√3', '6√2', '9√2'],
      correctAnswer: 0,
      concept: '제곱근',
      difficulty: 'medium'
    },
    {
      id: '3-2',
      question: 'x² - 4x + 3을 인수분해하면?',
      options: ['(x-1)(x-3)', '(x+1)(x+3)', '(x-1)(x+3)', '(x+1)(x-3)'],
      correctAnswer: 0,
      concept: '인수분해',
      difficulty: 'medium'
    },
    {
      id: '3-3',
      question: '이차함수 y = x² - 2x + 1의 꼭짓점 좌표는?',
      options: ['(1, 0)', '(-1, 0)', '(1, -1)', '(-1, 4)'],
      correctAnswer: 0,
      concept: '이차함수',
      difficulty: 'hard'
    },
    {
      id: '3-4',
      question: '원의 둘레가 6π일 때, 이 원의 넓이는?',
      options: ['9π', '12π', '18π', '36π'],
      correctAnswer: 0,
      concept: '원의 성질',
      difficulty: 'medium'
    },
    {
      id: '3-5',
      question: '삼각형 ABC에서 ∠C = 90°, AB = 5, BC = 3일 때, sin A의 값은?',
      options: ['3/5', '4/5', '3/4', '4/3'],
      correctAnswer: 0,
      concept: '삼각비',
      difficulty: 'hard'
    },
    {
      id: '3-6',
      question: '포물선 y = x² - 4x + 3과 x축과의 교점의 개수는?',
      options: ['0개', '1개', '2개', '3개'],
      correctAnswer: 2,
      concept: '이차함수와 x축의 교점',
      difficulty: 'hard'
    }
  ]
};

// Mock quiz results generator
export function generateMockResult(answers: number[], grade: Grade): QuizResult {
  const questions = mockQuizQuestions[grade];
  
  if (!questions) {
    throw new Error(`No questions found for grade: ${grade}`);
  }
  
  const correctAnswers = answers.filter((answer, index) => {
    const question = questions[index];
    return question && answer === question.correctAnswer;
  }).length;

  const accuracy = (correctAnswers / questions.length) * 100;

  // Concept-based scoring
  const conceptScores = [
    { concept: '수와 연산', score: Math.floor(Math.random() * 3) + 1, maxScore: 3 },
    { concept: '식과 계산', score: Math.floor(Math.random() * 2) + 1, maxScore: 2 },
    { concept: '함수', score: Math.floor(Math.random() * 2) + 1, maxScore: 2 },
    { concept: '기하', score: Math.floor(Math.random() * 2) + 1, maxScore: 2 }
  ];

  // Estimated level based on accuracy
  let estimatedLevel = 'C';
  if (accuracy >= 80) estimatedLevel = 'A';
  else if (accuracy >= 60) estimatedLevel = 'B';

  // Weak areas (concepts with low scores)
  const weakAreas = conceptScores
    .filter(cs => cs.score / cs.maxScore < 0.6)
    .map(cs => cs.concept);

  const recommendations = [
    '기본 개념 복습을 권장합니다.',
    '문제 유형별 연습이 필요합니다.',
    '심화 문제에 도전해보세요.'
  ];

  return {
    totalQuestions: questions.length,
    correctAnswers,
    accuracy: Math.round(accuracy),
    estimatedLevel,
    conceptScores,
    weakAreas,
    recommendations
  };
}

// Guest session data
export interface GuestSession {
  id: string;
  grade: Grade;
  startedAt: Date;
  answers?: number[];
  completed: boolean;
}

// Personal context mock data
export interface PersonalContext {
  recentQuestions: Array<{
    id: string;
    question: string;
    concept: string;
    isCorrect: boolean;
    timestamp: Date;
  }>;
}

export const mockPersonalContext: PersonalContext = {
  recentQuestions: [
    {
      id: 'ctx-1',
      question: '이차방정식 x² - 5x + 6 = 0의 해는?',
      concept: '이차방정식',
      isCorrect: true,
      timestamp: new Date('2024-01-15T10:30:00')
    },
    {
      id: 'ctx-2',
      question: '일차함수 y = 2x + 1의 기울기는?',
      concept: '일차함수',
      isCorrect: false,
      timestamp: new Date('2024-01-15T10:25:00')
    },
    {
      id: 'ctx-3',
      question: '삼각형의 내각의 합은?',
      concept: '평면도형',
      isCorrect: true,
      timestamp: new Date('2024-01-15T10:20:00')
    },
    {
      id: 'ctx-4',
      question: '√18을 간단히 하면?',
      concept: '제곱근',
      isCorrect: false,
      timestamp: new Date('2024-01-15T10:15:00')
    },
    {
      id: 'ctx-5',
      question: '(x + 2)(x - 3)을 전개하면?',
      concept: '식의 계산',
      isCorrect: true,
      timestamp: new Date('2024-01-15T10:10:00')
    },
    {
      id: 'ctx-6',
      question: '원의 둘레가 6π일 때, 이 원의 넓이는?',
      concept: '원의 성질',
      isCorrect: false,
      timestamp: new Date('2024-01-15T10:05:00')
    }
  ]
};

// Chat message interface
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'tutor';
  timestamp: Date;
  isTyping?: boolean;
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

// Mock tutor responses
export const mockTutorResponses: Record<string, string[]> = {
  greeting: [
    "안녕하세요! 저는 여러분의 수학 학습을 도와드리는 AI 튜터입니다. 😊",
    "현재 컨텍스트를 보니 이차방정식과 함수 부분에서 어려움을 겪고 계시는군요.",
    "무엇을 도와드릴까요? 궁금한 개념이나 문제가 있으시면 언제든 말씀해주세요!"
  ],
  이차방정식: [
    "이차방정식은 ax² + bx + c = 0 형태의 방정식입니다.",
    "해를 구하는 방법에는 인수분해, 완전제곱식, 근의 공식이 있어요.",
    "예를 들어 x² - 5x + 6 = 0은 (x-2)(x-3) = 0으로 인수분해할 수 있습니다.",
    "따라서 x = 2 또는 x = 3이 해가 됩니다. 이해되셨나요?"
  ],
  함수: [
    "함수는 x값에 따라 y값이 하나로 정해지는 관계입니다.",
    "일차함수 y = ax + b에서 a는 기울기, b는 y절편을 나타냅니다.",
    "y = 2x + 1에서 기울기는 2, y절편은 1입니다.",
    "기울기가 양수면 증가함수, 음수면 감소함수가 됩니다."
  ],
  제곱근: [
    "제곱근을 간단히 하는 방법을 알려드릴게요!",
    "√18 = √(9×2) = √9 × √2 = 3√2입니다.",
    "완전제곱수를 찾아서 밖으로 빼내는 것이 핵심입니다.",
    "더 연습해보시겠어요?"
  ],
  default: [
    "흥미로운 질문이네요! 조금 더 자세히 설명해주시면 더 구체적으로 도와드릴 수 있습니다.",
    "수학은 단계별로 이해하는 것이 중요합니다. 어떤 부분이 가장 어려우신가요?",
    "천천히 함께 풀어보겠습니다. 먼저 기본 개념부터 확인해볼까요?"
  ]
};

// Generate mock tutor response
export function generateTutorResponse(userMessage: string): string[] {
  const message = userMessage.toLowerCase();

  if (message.includes('안녕') || message.includes('hello') || message.includes('hi')) {
    return mockTutorResponses.greeting || [];
  }

  if (message.includes('이차방정식') || message.includes('방정식')) {
    return mockTutorResponses.이차방정식 || [];
  }

  if (message.includes('함수') || message.includes('기울기')) {
    return mockTutorResponses.함수 || [];
  }

  if (message.includes('제곱근') || message.includes('√')) {
    return mockTutorResponses.제곱근 || [];
  }

  return mockTutorResponses.default || [];
}

// Mock recommended actions
export const mockRecommendedActions = [
  {
    title: "이차방정식 연습",
    description: "기본 인수분해 문제",
    action: "solve_quadratic"
  },
  {
    title: "함수 그래프 그리기",
    description: "일차함수 그래프 연습",
    action: "draw_function"
  },
  {
    title: "개념 정리하기",
    description: "취약 개념 복습",
    action: "review_concepts"
  },
  {
    title: "유사 문제 풀기",
    description: "틀린 문제와 비슷한 유형",
    action: "similar_problems"
  }
];