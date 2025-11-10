'use client';

import { Search, Filter, Plus, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockUsers } from '@/lib/data';
import type { User } from '@/lib/types';


const MemberCard = ({ user }: { user: User }) => (
  <Card className="hover:border-primary transition-colors">
    <Link href={`/members/${user.id}`}>
        <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src={user.profilePhotoUrl} alt={user.name} data-ai-hint="profile avatar" />
                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
                <h3 className="text-lg font-semibold font-headline">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.profession}</p>
                <p className="text-sm text-muted-foreground">{user.city}</p>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{user.maritalStatus}</Badge>
                {user.roles.isAdmin && <Badge variant="destructive">Admin</Badge>}
            </div>
        </CardContent>
    </Link>
  </Card>
);

export default function MembersPage() {
  const [filter, setFilter] = useState<'all' | 'mine'>('all');
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    // In a real app, you'd fetch the logged-in user's data
    const user = mockUsers.find(u => u.roles.isAdmin) || mockUsers[0];
    setLoggedInUser(user);
  }, []);

  const displayedUsers = useMemo(() => {
    const approvedUsers = mockUsers.filter(user => user.isApproved);
    if (filter === 'mine' && loggedInUser) {
      return approvedUsers.filter(user => user.registeredBy === loggedInUser.id);
    }
    return approvedUsers;
  }, [filter, loggedInUser]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Member Directory</h1>
          <p className="text-muted-foreground">Find and connect with community members.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
              <Link href="/members/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Member
              </Link>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, city, profession..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        {filter === 'all' ? (
           <Button variant="outline" onClick={() => setFilter('mine')}>
             <UserIcon className="mr-2 h-4 w-4" />
             View My Members
           </Button>
        ) : (
           <Button onClick={() => setFilter('all')}>View All Members</Button>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedUsers.map((user) => (
          <MemberCard key={user.id} user={user} />
        ))}
      </div>
       {displayedUsers.length === 0 && (
          <Card className="text-center py-12 md:col-span-2 lg:col-span-3 xl:col-span-4">
              <CardContent>
                <h3 className="text-xl font-semibold">No Members Found</h3>
                <p className="text-muted-foreground mt-2">
                    {filter === 'mine' ? "You haven't added any members yet." : "There are currently no approved members."}
                </p>
              </CardContent>
          </Card>
      )}
    </div>
  );
}
