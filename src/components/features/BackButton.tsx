'use client';

import { Button } from '@/components/ui';

interface BackButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function BackButton({ className, children = '이전 페이지로' }: BackButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={() => window.history.back()}
      className={className}
    >
      {children}
    </Button>
  );
}
