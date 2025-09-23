'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { GradeSelector } from '@/components/features/GradeSelector';
import { Grade } from '@/lib/utils';

interface HomePageProps {
  defaultGrade?: Grade;
}

export function HomePage({ defaultGrade = '중2' }: HomePageProps) {
  const [selectedGrade, setSelectedGrade] = useState<Grade>(defaultGrade);

  return (
    <div className="space-y-6">
      <GradeSelector
        value={selectedGrade}
        onChange={setSelectedGrade}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={`/try?grade=${selectedGrade}`}>
          <Button size="lg" className="w-full sm:w-auto">
            내 수준 파악해보기
          </Button>
        </Link>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            document.getElementById('features')?.scrollIntoView({
              behavior: 'smooth'
            });
          }}
          className="w-full sm:w-auto"
        >
          둘러보기
        </Button>
      </div>

    </div>
  );
}
