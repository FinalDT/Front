'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function TabBar() {
  const pathname = usePathname();

  const tabItems = [
    {
      href: '/dashboard',
      label: '홈',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect x="2" y="2" width="6" height="6" />
          <rect x="10" y="2" width="6" height="6" />
          <rect x="2" y="10" width="6" height="6" />
          <rect x="10" y="10" width="6" height="6" />
        </svg>
      )
    },
    {
      href: '/context',
      label: '컨텍스트',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect x="2" y="3" width="16" height="2" />
          <rect x="2" y="7" width="12" height="2" />
          <rect x="2" y="11" width="14" height="2" />
          <rect x="2" y="15" width="10" height="2" />
        </svg>
      )
    },
    {
      href: '/tutor',
      label: '튜터',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect x="2" y="11" width="6" height="2" rx="1" />
          <rect x="10" y="7" width="6" height="2" rx="1" />
          <rect x="10" y="11" width="5" height="2" rx="1" />
          <circle cx="5" cy="5" r="3" />
          <circle cx="13" cy="15" r="3" />
        </svg>
      )
    },
    {
      href: '/settings',
      label: '설정',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="10" cy="10" r="2" />
          <path d="M10 1v4m0 6v4m7-7h-4m-6 0H1m11.66-5.66-2.83 2.83m-3.66 3.66L2.34 17.66m11.32 0L11 15m-3.66-3.66L4.51 8.51" />
        </svg>
      )
    }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg border-t-[3px] border-ink z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {tabItems.map((item) => (
          <TabBarLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={pathname === item.href}
          />
        ))}
      </div>
    </nav>
  );
}

interface TabBarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

function TabBarLink({ href, label, icon, isActive }: TabBarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center px-3 py-2 min-h-[44px] min-w-[44px] transition-colors duration-150',
        isActive ? 'text-accent' : 'text-ink hover:text-accent'
      )}
    >
      <span className="w-5 h-5 mb-1">{icon}</span>
      <span className="text-[10px] font-medium leading-[12px]">{label}</span>
    </Link>
  );
}