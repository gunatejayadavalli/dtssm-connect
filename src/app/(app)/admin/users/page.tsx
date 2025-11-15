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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  const RoleDisplay = ({ user }: { user: User }) => (
    <div className="flex items-center gap-2">
      {user.roles.isAdmin ? <Shield className="h-5 w-5 text-destructive" /> : <UserIcon className="h-5 w-5 text-muted-foreground" />}
      <span className="capitalize">{user.roles.isAdmin ? 'Admin' : 'User'}</span>
    </div>
  );

  const StatusDisplay = ({ user }: { user: User }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-2">
            <span className={cn("h-3 w-3 rounded-full", user.status === 'active' ? 'bg-green-500' : 'bg-red-500')}></span>
            <span className="capitalize md:hidden">{user.status}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="capitalize">{user.status}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
                    <RoleDisplay user={user} />
                  </TableCell>
                  <TableCell>
                    <StatusDisplay user={user} />
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
                          <RoleDisplay user={user} />
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Status</span>
                          <StatusDisplay user={user} />
                      </div>
                  </CardContent>
              </Card>
          ))}
      </div>
    </div>
  );
}
