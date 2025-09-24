'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      label: '홈',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="8" height="8" />
          <rect x="13" y="3" width="8" height="8" />
          <rect x="3" y="13" width="8" height="8" />
          <rect x="13" y="13" width="8" height="8" />
        </svg>
      )
    },
    {
      href: '/context',
      label: '학습기록',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="4" width="18" height="2" />
          <rect x="3" y="8" width="14" height="2" />
          <rect x="3" y="12" width="16" height="2" />
          <rect x="3" y="16" width="12" height="2" />
        </svg>
      )
    },
    {
      href: '/tutor',
      label: '튜터',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="12" width="8" height="2" rx="1" />
          <rect x="13" y="8" width="8" height="2" rx="1" />
          <rect x="13" y="12" width="6" height="2" rx="1" />
          <circle cx="7" cy="7" r="4" />
          <circle cx="17" cy="17" r="4" />
        </svg>
      )
    },
    {
      href: '/settings',
      label: '설정',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m16.24-7.76-4.24 4.24m-5.66 5.66L3.76 20.24m16.48 0L16 16m-5.66-5.66L6.1 6.1" />
        </svg>
      )
    }
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-20 h-[calc(100vh-80px)] w-64 bg-bg border-r-[3px] border-ink z-40 transition-transform duration-300',
        'hidden lg:block',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <nav className="p-6 space-y-2">
        {navItems.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={pathname === item.href}
            {...(onClose && { onClick: onClose })}
          />
        ))}
      </nav>
    </aside>
  );
}

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

function SidebarLink({ href, label, icon, isActive, onClick }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      {...(onClick && { onClick })}
      className={cn(
        'flex items-center space-x-3 px-4 py-3 rounded-[8px] border-[3px] transition-all duration-150 hover:shadow-[0_4px_0_rgba(0,0,0,1)] hover:-translate-y-0.5',
        isActive
          ? 'bg-accent border-ink text-ink shadow-[0_4px_0_rgba(0,0,0,1)]'
          : 'bg-bg border-ink text-ink hover:bg-accent'
      )}
    >
      <span className="w-6 h-6 flex-shrink-0">{icon}</span>
      <span className="text-[14px] font-medium leading-[20px]">{label}</span>
    </Link>
  );
}