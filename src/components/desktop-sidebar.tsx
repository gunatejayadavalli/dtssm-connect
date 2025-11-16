'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AtSign, LayoutGrid, Users, BookUser, Calendar, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem, User } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import { useEffect, useState } from 'react';
import { SheetHeader, SheetTitle } from './ui/sheet';

const navItems: NavItem[] = [
  { href: '/home', label: 'Home', icon: LayoutGrid },
  { href: '/members', label: 'Members', icon: Users },
  { href: '/biodata', label: 'Biodata', icon: BookUser },
  { href: '/events', label: 'Events', icon: Calendar },
];

interface DesktopSidebarProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export default function DesktopSidebar({ isMobile = false, onLinkClick }: DesktopSidebarProps) {
  const pathname = usePathname();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    // In a real app, you'd get this from an auth context
    const user = mockUsers.find(u => u.roles.isAdmin) || mockUsers[0];
    setLoggedInUser(user);
  }, []);

  const getVisibleNavItems = () => {
    return navItems;
  }

  const visibleNavItems = getVisibleNavItems();

  return (
    <div
      className={cn(
        'h-full bg-card text-card-foreground',
        isMobile ? 'flex flex-col' : 'hidden md:flex md:flex-col md:fixed md:w-64 border-r'
      )}
    >
      {isMobile ? (
        <SheetHeader className="p-4 border-b">
           <SheetTitle className="sr-only">Main Menu</SheetTitle>
           <Link href="/home" className="flex items-center gap-2 font-semibold text-left">
              <AtSign className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl">DTSSM Connect</span>
            </Link>
        </SheetHeader>
      ) : (
        <div className="flex h-16 items-center border-b px-6">
            <Link href="/home" className="flex items-center gap-2 font-semibold">
            <AtSign className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl">DTSSM Connect</span>
            </Link>
        </div>
      )}
      <nav className="flex-1 space-y-2 p-4">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
                isActive && 'bg-primary/10 text-primary font-medium'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
