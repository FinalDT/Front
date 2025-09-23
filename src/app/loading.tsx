import { Skeleton } from '@/components/ui';

export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
          <h2 className="text-[24px] font-bold text-ink">로딩 중...</h2>
          <p className="text-[16px] text-ink opacity-70">잠시만 기다려주세요</p>
        </div>
      </div>
    </div>
  );
}