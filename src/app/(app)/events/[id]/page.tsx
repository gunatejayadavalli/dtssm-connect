import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Info,
  ChevronLeft,
  Edit,
  Trash2,
} from 'lucide-react';
import { format, isSameDay } from 'date-fns';

import { getMemberById, mockEvents, mockUsers } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const formatFullDateTime = (date: Date) => {
    const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
    return format(date, hasTime ? 'PPP p' : 'PPP');
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = mockEvents.find(e => e.id === params.id);
  const loggedInUser = mockUsers.find(u => u.roles.isAdmin) || mockUsers[0]; // Mock logged in user

  if (!event) {
    notFound();
  }

  const handleDelete = (eventId: string) => {
    console.log(`Deleting event ${eventId}`);
    // In a real app, you would redirect or show a toast.
  };

  const createdBy = event.createdBy ? getMemberById(event.createdBy) : null;
  
  const isSingleDayEvent = isSameDay(event.dateFrom, event.dateTo);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/events"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to All Events
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">
            {event.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 text-muted-foreground">
            <Calendar className="h-5 w-5 mt-1" />
            <div className="grid gap-1">
              <div>
                  <p className="font-medium text-foreground">From</p>
                  <p>{formatFullDateTime(event.dateFrom)}</p>
              </div>
               <div>
                  <p className="font-medium text-foreground">To</p>
                  <p>{formatFullDateTime(event.dateTo)}</p>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4 text-muted-foreground">
            <MapPin className="h-5 w-5 mt-1" />
            <div>
              <p className="font-medium text-foreground">Venue</p>
              <p>{event.venue}</p>
            </div>
          </div>
          {event.description && (
             <div className="flex items-start gap-4 text-muted-foreground">
                <Info className="h-5 w-5 mt-1" />
                 <div>
                    <p className="font-medium text-foreground">About this event</p>
                    <p className="whitespace-pre-wrap">{event.description}</p>
                 </div>
            </div>
          )}
        </CardContent>
        {loggedInUser?.roles.isAdmin && (
            <CardFooter className="border-t pt-4 flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href={`/events/${event.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Event
                    </Link>
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the event "{event.title}".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(event.id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        )}
      </Card>
      
      {createdBy && (
        <Card className="bg-secondary/50">
            <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                    Event created by <Link href={`/members/${createdBy.id}`} className="font-medium text-primary hover:underline">{createdBy.name}</Link>.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
