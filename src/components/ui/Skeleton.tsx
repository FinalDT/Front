import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-ink opacity-20 border-[3px] border-ink',
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}

// Predefined skeleton components
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 border-[3px] border-ink bg-bg', className)}>
      <div className="space-y-4">
        <Skeleton height="24px" width="60%" />
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="80%" />
        <div className="flex space-x-2 pt-2">
          <Skeleton height="32px" width="80px" />
          <Skeleton height="32px" width="100px" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({
  lines = 3,
  className
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="16px"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonButton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn('h-12 w-32 rounded-[12px]', className)}
    />
  );
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return (
    <Skeleton
      width={size}
      height={size}
      className="rounded-full"
    />
  );
}