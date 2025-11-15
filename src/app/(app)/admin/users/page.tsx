'use client';

import { useState } from 'react';
import { mockUsers } from '@/lib/data';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Shield, User as UserIcon, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
                    <UserIcon className="mr-2 h-4 w-4" />
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
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <Badge variant={user.roles.isAdmin ? 'destructive' : 'secondary'}>
                      {user.roles.isAdmin ? 'Admin' : 'User'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'outline'} className={cn(user.status === 'active' ? 'bg-green-500/20 text-green-700 border-green-400' : 'bg-red-500/20 text-red-700 border-red-400')}>
                      {user.status}
                    </Badge>
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
              <Card key={user.id}>
                  <CardHeader>
                      <div className="flex justify-between items-start">
                          <div>
                              <CardTitle>{user.name}</CardTitle>
                              <CardDescription>{user.phone}</CardDescription>
                          </div>
                          <UserActions user={user} />
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Role</span>
                          <Badge variant={user.roles.isAdmin ? 'destructive' : 'secondary'}>
                              {user.roles.isAdmin ? 'Admin' : 'User'}
                          </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Status</span>
                          <Badge variant={user.status === 'active' ? 'default' : 'outline'} className={cn(user.status === 'active' ? 'bg-green-500/20 text-green-700 border-green-400' : 'bg-red-500/20 text-red-700 border-red-400')}>
                              {user.status}
                          </Badge>
                      </div>
                  </CardContent>
              </Card>
          ))}
      </div>
    </div>
  );
}
