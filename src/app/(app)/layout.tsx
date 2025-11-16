
import AppHeader from '@/components/app-header';
import DesktopSidebar from '@/components/desktop-sidebar';
import MobileNav from '@/components/mobile-nav';
import { SessionProvider } from '@/lib/session';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function AppLayoutFallback() {
    return (
        <div className="flex min-h-screen w-full bg-background">
          <div className="hidden md:flex md:flex-col md:fixed md:w-64 border-r bg-card">
             <div className="flex h-16 items-center border-b px-6">
                <Skeleton className="h-6 w-32" />
             </div>
             <div className="flex-1 space-y-2 p-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
             </div>
          </div>
          <div className="flex flex-col w-full md:pl-64">
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 justify-end">
                <Skeleton className="h-9 w-9 rounded-full" />
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <Skeleton className="h-40 w-full" />
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </main>
          </div>
        </div>
    )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AppLayoutFallback />}>
      <SessionProvider>
        <div className="flex min-h-screen w-full bg-background">
          <DesktopSidebar />
          <div className="flex flex-col w-full md:pl-64">
            <AppHeader />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
              {children}
            </main>
            <MobileNav />
          </div>
        </div>
      </SessionProvider>
    </Suspense>
  );
}
