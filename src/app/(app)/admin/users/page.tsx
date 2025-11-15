'use client';

import { useState } from 'react';
import { mockUsers } from '@/lib/data';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Shield, User as UserIcon, XCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const { toast } = useToast();

  const handleRoleChange = (userId: string, isAdmin: boolean) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, roles: { ...user.roles, isAdmin } } : user
    ));
    toast({
      title: "Role Updated",
      description: "User role has been successfully changed.",
    });
  };

  const handleStatusChange = (userId: string, status: 'active' | 'blocked') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status } : user
    ));
     toast({
      title: `User ${status === 'blocked' ? 'Blocked' : 'Unblocked'}`,
      description: `The user has been ${status}.`,
    });
  };
  
  const UserActions = ({ user }: { user: User }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">User Actions</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            {!user.roles.isAdmin && (
                <DropdownMenuItem onClick={() => handleRoleChange(user.id, true)}>
                    <Shield className="mr-2 h-4 w-4" />
                    Make Admin
                </DropdownMenuItem>
            )}
            {user.roles.isAdmin && (
                <DropdownMenuItem onClick={() => handleRoleChange(user.id, false)}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Make User
                </DropdownMenuItem>
            )}
            {user.status === 'active' ? (
                <DropdownMenuItem className="text-destructive" onClick={() => handleStatusChange(user.id, 'blocked')}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Block User
                </DropdownMenuItem>
            ) : (
                <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Unblock User
                </DropdownMenuItem>
            )}
        </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">User Management</h1>
        <p className="text-muted-foreground">Manage roles and status of all registered users.</p>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow 
                  key={user.id}
                  className={cn(user.status === 'blocked' && 'bg-destructive/10 hover:bg-destructive/20')}
                >
                  <TableCell className="font-medium">
                     <div className="flex items-center gap-2">
                        {user.roles.isAdmin ? <Shield className="h-5 w-5 text-destructive" /> : <UserIcon className="h-5 w-5 text-muted-foreground" />}
                        <span>{user.name}</span>
                     </div>
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell className="text-right">
                    <UserActions user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
          {users.map(user => (
              <Card 
                key={user.id}
                className={cn(user.status === 'blocked' && 'bg-destructive/10 border-destructive/20')}
              >
                  <CardHeader>
                      <div className="flex justify-between items-start">
                          <div>
                              <CardTitle className="flex items-center gap-2">
                                {user.roles.isAdmin ? <Shield className="h-5 w-5 text-destructive" /> : <UserIcon className="h-5 w-5 text-muted-foreground" />}
                                {user.name}
                              </CardTitle>
                              <CardDescription className="mt-1">{user.phone}</CardDescription>
                          </div>
                          <UserActions user={user} />
                      </div>
                  </CardHeader>
              </Card>
          ))}
      </div>
    </div>
  );
}
