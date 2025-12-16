import { useState, ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-auto scroll-smooth-mobile p-3 sm:p-4 md:p-6 pb-safe">
          {children}
        </main>
        
        <footer className="border-t border-border bg-card/50 py-2 px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Pixel Horizon® 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
