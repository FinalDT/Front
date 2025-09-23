'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { TabBar } from './TabBar';
import { session } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 클라이언트에서만 인증 상태 확인
    setIsAuthenticated(session.isAuthenticated());
    setIsLoaded(true);
  }, []);

  // Pages that don't need sidebar
  const noSidebarPages = ['/', '/try', '/quiz', '/results-teaser', '/auth'];
  const showSidebar = isLoaded && isAuthenticated && !noSidebarPages.includes(pathname);

  // Pages that don't need tab bar
  const noTabBarPages = ['/', '/try', '/quiz', '/results-teaser', '/auth'];
  const showTabBar = isLoaded && isAuthenticated && !noTabBarPages.includes(pathname);

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <div className="flex">
        {showSidebar && <Sidebar />}

        <main
          className={`
            flex-1 min-h-[calc(100vh-80px)]
            ${showSidebar ? 'lg:ml-64' : ''}
            ${showTabBar ? 'pb-16 lg:pb-0' : ''}
          `}
        >
          {children}
        </main>
      </div>

      {showTabBar && <TabBar />}
    </div>
  );
}