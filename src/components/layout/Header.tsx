'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { session } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 클라이언트에서만 인증 상태 확인
    setIsAuthenticated(session.isAuthenticated());
    setIsLoaded(true);
  }, []);

  return (
    <header
      role="banner"
      className="h-20 border-b-[3px] border-border bg-bg sticky top-0 z-50 backdrop-blur-sm"
    >
      <div className="h-full px-4 flex items-center justify-between w-full">
        {/* Logo */}
        <Link
          href="/"
          className="text-[24px] font-bold text-ink hover:text-accent transition-colors duration-150"
        >
          STUDIYA
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {!isLoaded ? (
            // 로딩 중에는 기본 네비게이션 표시
            <>
              <NavLink href="/" current={pathname}>
                홈
              </NavLink>
              <NavLink href="/auth" current={pathname}>
                로그인
              </NavLink>
            </>
          ) : isAuthenticated ? (
            <>
              <NavLink href="/dashboard" current={pathname}>
                홈
              </NavLink>
              <NavLink href="/context" current={pathname}>
                학습기록
              </NavLink>
              <NavLink href="/tutor" current={pathname}>
                튜터
              </NavLink>
              <NavLink href="/settings" current={pathname}>
                설정
              </NavLink>
            </>
          ) : (
            <>
              <NavLink href="/" current={pathname}>
                홈
              </NavLink>
              <NavLink href="/auth" current={pathname}>
                로그인
              </NavLink>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 border-[3px] border-border bg-bg hover:bg-accent-light transition-colors duration-150 text-ink"
          aria-label="메뉴 열기"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect y="3" width="20" height="2" />
            <rect y="9" width="20" height="2" />
            <rect y="15" width="20" height="2" />
          </svg>
        </button>
      </div>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  current: string;
  children: React.ReactNode;
}

function NavLink({ href, current, children }: NavLinkProps) {
  const isActive = current === href;

  return (
    <Link
      href={href}
      className={cn(
        'relative pb-1 text-[16px] font-medium transition-colors duration-150 hover:text-accent',
        isActive
          ? 'text-accent border-b-[4px] border-accent'
          : 'text-ink border-b-[4px] border-transparent'
      )}
    >
      {children}
    </Link>
  );
}