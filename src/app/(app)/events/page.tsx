'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockEvents, mockUsers } from '@/lib/data';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function EventsPage() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would be fetched from auth context
    const user = mockUsers.find(u => u.roles.isAdmin) || mockUsers[0];
    setLoggedInUser(user);
  }, []);

  const upcomingEvents = mockEvents.filter(event => event.dateFrom >= new Date()).sort((a,b) => a.dateFrom.getTime() - b.dateFrom.getTime());
  const pastEvents = mockEvents.filter(event => event.dateFrom < new Date()).sort((a,b) => b.dateFrom.getTime() - a.dateFrom.getTime());

  const formatDateRange = (from: Date, to: Date | undefined) => {
    const fromStr = format(from, 'PPP');
    if (!to || isSameDay(from, to)) {
        return fromStr;
    }
    const toStr = format(to, 'PPP');
    return `${fromStr} to ${toStr}`;
  }
  
  const formatTimeRange = (from: Date, to: Date | undefined) => {
    const fromTime = from && (from.getHours() !== 0 || from.getMinutes() !== 0) ? format(from, 'p') : null;
    
    if (to && isSameDay(from, to)) {
        const toTime = to && (to.getHours() !== 0 || to.getMinutes() !== 0) ? format(to, 'p') : null;
        if (fromTime && toTime) return `${fromTime} to ${toTime}`;
        if (fromTime) return `Starts at ${fromTime}`;
        if (toTime) return `Ends at ${toTime}`;
    } else if (fromTime) {
        return `${fromTime} Onwards`;
    }

    return null;
  }
  
  const handleDelete = (eventId: string) => {
    console.log(`Deleting event ${eventId}`);
    toast({
      title: "Event Deleted",
      description: "The event has been successfully deleted.",
    });
    // Here you would typically refetch the events or remove it from the state
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Community Events</h1>
          <p className="text-muted-foreground">Stay up-to-date with our community's happenings.</p>
        </div>
        {loggedInUser?.roles.isAdmin && (
            <Button asChild>
                <Link href="/events/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                </Link>
            </Button>
        )}
      </div>

      <section>
        <h2 className="text-2xl font-semibold font-headline mb-4">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {upcomingEvents.map((event) => {
              const timeDisplay = formatTimeRange(event.dateFrom, event.dateTo);
              return (
                <Card key={event.id} className="flex flex-col">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{formatDateRange(event.dateFrom, event.dateTo)}</Badge>
                    <CardTitle className="font-headline">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2 text-sm">
                    {timeDisplay && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{timeDisplay}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.venue}</span>
                    </div>
                    <p className="pt-2 line-clamp-3">{event.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                        <Link href={`/events/${event.id}`}>View Details</Link>
                    </Button>
                    {loggedInUser?.roles.isAdmin && (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/events/${event.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
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
                        </div>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No upcoming events scheduled. Please check back later.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold font-headline mb-4">Past Events</h2>
        {pastEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-75 hover:opacity-100 transition-opacity">
                <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">{formatDateRange(event.dateFrom, event.dateTo)}</Badge>
                    <CardTitle className="text-base font-semibold">{event.title}</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                 </CardContent>
                 {loggedInUser?.roles.isAdmin && (
                    <CardFooter>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="w-full">
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
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No past events found.</p>
        )}
      </section>
    </div>
  );
}
