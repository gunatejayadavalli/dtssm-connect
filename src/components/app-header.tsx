'use client';

import Link from 'next/link';
import { Menu, AtSign } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import UserNav from '@/components/user-nav';
import DesktopSidebar from './desktop-sidebar';

export default function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 flex flex-col">
            {/* We can re-use the DesktopSidebar component for the mobile sheet content */}
            <DesktopSidebar isMobile onLinkClick={closeMobileMenu} />
          </SheetContent>
        </Sheet>
        <Link href="/home" className="flex items-center gap-2 font-semibold">
            <AtSign className="h-6 w-6 text-primary" />
            <span className="font-headline text-lg">DTSSM</span>
        </Link>
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        {/* Search bar can be added here in the future */}
        <UserNav />
      </div>
    </header>
  );
}
