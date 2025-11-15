
'use client';

import { notFound, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Building,
  MapPin,
  Phone,
  Lock,
  MessageCircle,
  Users,
  HeartHandshake,
  ChevronLeft,
  Baby,
  Calendar,
  MoreHorizontal,
  Shield,
  User as UserIcon,
  XCircle,
  CheckCircle,
  UserCheck,
} from 'lucide-react';
import { getMemberById, mockUsers } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import type { User as UserType } from '@/lib/types';


const DetailItem = ({ icon: Icon, label, value, isPrivate = false }: { icon: React.ElementType, label: string, value: string | undefined, isPrivate?: boolean }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-4 text-sm">
            <Icon className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
                <p className="font-medium">{label}</p>
                {isPrivate ? (
                     <div className="flex items-center gap-2 text-muted-foreground">
                        <Lock className="h-3 w-3"/>
                        <span>Hidden. Request access to view.</span>
                    </div>
                ) : (
                    <p className="text-muted-foreground">{value}</p>
                )}
            </div>
        </div>
    );
};

export default function MemberDetailPage() {
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const from = searchParams.get('from');
  const { toast } = useToast();

  const initialUser = getMemberById(params.id);
  const [user, setUser] = useState<UserType | undefined>(initialUser);
  
  // This is a mock for the logged-in user. In a real app, this would come from an auth context.
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  useEffect(() => {
    const adminUser = mockUsers.find(u => u.roles.isAdmin) || mockUsers[0];
    setLoggedInUser(adminUser);
  }, []);

  // Sync state if the underlying data changes (e.g., after a mock data update)
  useEffect(() => {
    setUser(getMemberById(params.id));
  }, [params.id]);
  
  if (!user) {
    notFound();
  }
  
  const handleRoleChange = (isAdmin: boolean) => {
    if (!user) return;
    setUser({ ...user, roles: { ...user.roles, isAdmin } });
    toast({
      title: "Role Updated",
      description: "User role has been successfully changed.",
    });
  };

  const handleStatusChange = (status: 'active' | 'blocked') => {
    if (!user) return;
    setUser({ ...user, status });
     toast({
      title: `User ${status === 'blocked' ? 'Blocked' : 'Unblocked'}`,
      description: `The user has been ${status}.`,
    });
  };

  const handleApproveUser = () => {
    if (!user) return;
    setUser({ ...user, isApproved: true });
    toast({
      title: "User Approved",
      description: "The user has been approved and can now access the app.",
    });
  };

  const AdminActions = ({ user }: { user: UserType }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Admin Actions</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            {!user.isApproved && (
                <DropdownMenuItem onClick={handleApproveUser}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Approve User
                </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {user.isApproved && !user.roles.isAdmin && (
                <DropdownMenuItem onClick={() => handleRoleChange(true)}>
                    <Shield className="mr-2 h-4 w-4" />
                    Make Admin
                </DropdownMenuItem>
            )}
            {user.roles.isAdmin && (
                <DropdownMenuItem onClick={() => handleRoleChange(false)}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Make User
                </DropdownMenuItem>
            )}
            {user.status === 'active' ? (
                <DropdownMenuItem className="text-destructive" onClick={() => handleStatusChange('blocked')}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Block User
                </DropdownMenuItem>
            ) : (
                <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Unblock User
                </DropdownMenuItem>
            )}
        </DropdownMenuContent>
    </DropdownMenu>
  );

  
  const isPhonePrivate = user.visibility?.phone !== 'public';
  const registeredByMember = user.registeredBy ? getMemberById(user.registeredBy) : null;
  const wasAddedBySelf = !registeredByMember || registeredByMember.id === user.id;
  
  const backLink = from === 'user-management' ? { href: '/admin/users', text: 'Back to User Management' } : { href: '/members', text: 'Back to Directory' };

  return (
    <div className="space-y-6">
        <Button variant="ghost" asChild>
            <Link href={backLink.href}><ChevronLeft className="mr-2 h-4 w-4" />{backLink.text}</Link>
        </Button>

      <Card>
        <CardHeader className="flex flex-row items-center gap-6 p-6">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 text-4xl">
            <AvatarImage src={user.profilePhotoUrl} alt={user.name} data-ai-hint="profile photo" />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
            <p className="text-lg text-muted-foreground">{user.profession}</p>
            <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
              <MapPin className="h-4 w-4" />
              {user.city}
            </p>
          </div>
          {loggedInUser?.roles.isAdmin && (
            <AdminActions user={user} />
          )}
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
             {!user.isApproved && (
                <Badge variant="destructive" className="bg-amber-500 text-white">Pending Approval</Badge>
            )}
            {user.status === 'blocked' && (
                <Badge variant="destructive">Blocked</Badge>
            )}
            <div className="flex gap-2">
                <Button>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Request Hidden Details
                </Button>
                <Button variant="outline">Share</Button>
            </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem icon={User} label="Gender" value={user.gender} />
            <DetailItem icon={Calendar} label="Date of Birth" value={format(user.dob, 'MMMM d, yyyy')} />
            <DetailItem icon={HeartHandshake} label="Marital Status" value={user.maritalStatus} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5 text-primary" /> Work & Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem icon={Building} label="Company / Organization" value={user.company} />
            <DetailItem icon={MapPin} label="Present Address" value={user.presentAddress} isPrivate />
            <DetailItem icon={Phone} label="Phone Number" value={user.phone} isPrivate={isPhonePrivate} />
          </CardContent>
        </Card>

         <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Family</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem icon={Users} label="Father's Name" value={user.fatherName} isPrivate={user.visibility?.fatherName !== 'public'}/>
            <DetailItem icon={Users} label="Mother's Name" value={user.motherName} isPrivate />
            {user.maritalStatus === "Married" && <DetailItem icon={Users} label="Spouse Details" value={user.spouseDetails || "Details are private"} isPrivate />}
            {user.childrenDetails && <DetailItem icon={Baby} label="Children Details" value={user.childrenDetails} isPrivate />}
          </CardContent>
        </Card>
      </div>
      
       <Card className="bg-secondary/50">
        <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
                {wasAddedBySelf ? (
                    "Profile added by Self."
                ) : (
                    <>
                     Profile added by <Link href={`/members/${registeredByMember?.id}`} className="font-medium text-primary hover:underline">{registeredByMember?.name}</Link>.
                    </>
                )}
            </p>
        </CardContent>
       </Card>

    </div>
  );
}
