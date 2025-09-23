'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Grade } from '@/lib/utils';

interface HomeCTAProps {
  defaultGrade?: Grade;
}

export function HomeCTA({ defaultGrade = '중2' }: HomeCTAProps) {
  const [selectedGrade] = useState<Grade>(defaultGrade);

  return (
    <Link href={`/try?grade=${selectedGrade}`}>
      <Button size="lg">
        사전평가 시작하기
      </Button>
    </Link>
  );
}
