import AppHeader from '@/components/app-header';
import DesktopSidebar from '@/components/desktop-sidebar';
import MobileNav from '@/components/mobile-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
