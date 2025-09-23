import Link from 'next/link';
import { Button } from '@/components/ui';
import { BackButton } from '@/components/features/BackButton';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-4">
          <div className="text-[80px] font-bold text-ink">404</div>
          <h2 className="text-[32px] font-bold text-ink">페이지를 찾을 수 없습니다</h2>
          <p className="text-[16px] text-ink opacity-70">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full">
              홈으로 이동
            </Button>
          </Link>
          <BackButton className="w-full" />
        </div>
      </div>
    </div>
  );
}