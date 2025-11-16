'use client';

import Link from 'next/link';
import { AtSign } from 'lucide-react';

import UserNav from '@/components/user-nav';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
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
