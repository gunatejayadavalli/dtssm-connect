import Link from 'next/link';
import { Users, BookUser, Calendar, User, ArrowRight, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const quickNavItems = [
  {
    title: 'Find Members',
    href: '/members',
    icon: Users,
    description: 'Search the community directory.',
  },
  {
    title: 'Find Biodata',
    href: '/biodata',
    icon: BookUser,
    description: 'Browse profiles of unmarried members.',
  },
  {
    title: 'My Profile',
    href: '/profile',
    icon: User,
    description: 'View and manage your information.',
  },
  {
    title: 'Community Events',
    href: '/events',
    icon: Calendar,
    description: 'See upcoming official events.',
  },
];

export default function HomePage() {
  const showReviewBanner = true; // This would be based on user's lastReviewedAt

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome to DTSSM Connect</h1>
        <p className="text-muted-foreground">Your central place for community connection.</p>
      </div>

      {showReviewBanner && (
        <Alert className="bg-primary/10 border-primary/20">
            <Bell className="h-4 w-4" />
            <AlertTitle className="font-semibold text-primary">Your Quarterly Profile Review is Due!</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p>Please take a moment to review your profile and ensure all details are up to date.</p>
                <Button asChild size="sm" className="mt-2 sm:mt-0">
                    <Link href="/review">Review Now</Link>
                </Button>
            </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {quickNavItems.map((item) => (
          <Card key={item.title} className="hover:shadow-lg transition-shadow group">
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <item.icon className="h-8 w-8 text-primary" />
                    <CardTitle className="font-headline">{item.title}</CardTitle>
                  </div>
                   <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                 <Button variant="link" className="p-0 h-auto mt-4" asChild>
                    <Link href={item.href}>Go to {item.title}</Link>
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
