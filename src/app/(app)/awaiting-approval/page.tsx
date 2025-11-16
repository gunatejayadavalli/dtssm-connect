'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { mockUsers } from '@/lib/data';
import { useSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function AwaitingApprovalPage() {
    const { session, isLoading } = useSession();
    const admins = mockUsers.filter(user => user.roles.isAdmin);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                 <Card className="w-full max-w-lg text-center shadow-lg">
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-full mt-2 mx-auto" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-5/6 mx-auto" />
                    </CardContent>
                    <CardFooter className="flex justify-center gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </CardFooter>
                 </Card>
            </div>
        )
    }

    if (!session) {
        redirect('/login');
    }

    if (session?.user?.isApproved) {
        redirect('/home');
    }
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-lg text-center shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Thank You for Registering!</CardTitle>
                    <CardDescription>
                        Your profile has been submitted and is now pending approval from community administrators.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        You will be notified once your profile is approved. You won't be able to access the community features until then.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-center gap-2">
                    <Button asChild>
                        <a href="/api/logout">Logout</a>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">View Admins</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Community Administrators</AlertDialogTitle>
                            </AlertDialogHeader>
                            <ul className="list-disc list-inside text-muted-foreground text-left">
                                {admins.map(admin => (
                                    <li key={admin.id}>{admin.name}</li>
                                ))}
                            </ul>
                            <AlertDialogAction>Close</AlertDialogAction>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
