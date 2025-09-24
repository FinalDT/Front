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
  },

  logout: () => {
    storage.remove('auth_user_id');
    storage.remove('guestSessionId');
    storage.remove('lastQuiz');
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