
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { mockUsers } from '@/lib/data';

export default function AwaitingApprovalPage() {
    const approvalImage = PlaceHolderImages.find(img => img.id === 'awaiting-approval');
    const admins = mockUsers.filter(user => user.roles.isAdmin);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-lg text-center shadow-lg">
                <CardHeader>
                    {approvalImage && (
                        <div className="flex justify-center mb-4">
                            <Image
                                src={approvalImage.imageUrl}
                                alt={approvalImage.description}
                                width={200}
                                height={150}
                                className="rounded-lg"
                                data-ai-hint={approvalImage.imageHint}
                            />
                        </div>
                    )}
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
                        <Link href="/login">Back to Login</Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">View Admins</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Community Administrators</AlertDialogTitle>
                            </AlertDialogHeader>
                            <ul className="list-disc list-inside text-muted-foreground">
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
