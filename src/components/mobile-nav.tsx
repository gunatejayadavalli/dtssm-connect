'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Users, BookUser, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/types';

const navItems: NavItem[] = [
  { href: '/home', label: 'Home', icon: LayoutGrid },
  { href: '/members', label: 'Members', icon: Users },
  { href: '/biodata', label: 'Biodata', icon: BookUser },
  { href: '/events', label: 'Events', icon: Calendar },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="bg-background/80 backdrop-blur-sm border-t">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors text-muted-foreground hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
