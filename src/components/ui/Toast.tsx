'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastViewport() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastComponent({ toast }: { toast: Toast }) {
  const { dismiss } = useToast();

  const variants = {
    default: 'border-ink bg-bg text-ink',
    success: 'border-green-600 bg-green-100 text-green-800',
    warning: 'border-yellow-600 bg-yellow-100 text-yellow-800',
    error: 'border-red-600 bg-red-100 text-red-800'
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'p-4 border-[3px] shadow-[0_4px_0_rgba(0,0,0,1)] animate-in slide-in-from-bottom-2',
        variants[toast.variant || 'default']
      )}
    >
      <div className="flex items-start justify-between space-x-4">
        <div className="flex-1 space-y-1">
          {toast.title && (
            <div className="text-[14px] font-medium leading-[20px]">
              {toast.title}
            </div>
          )}
          {toast.description && (
            <div className="text-[12px] leading-[16px] opacity-80">
              {toast.description}
            </div>
          )}
        </div>

        <button
          onClick={() => dismiss(toast.id)}
          className="text-ink hover:text-accent transition-colors p-1"
          aria-label="토스트 닫기"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
}