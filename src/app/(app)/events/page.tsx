'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockEvents, mockUsers } from '@/lib/data';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';

export default function EventsPage() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    // In a real app, this would be fetched from auth context
    const user = mockUsers.find(u => u.roles.isAdmin) || mockUsers[0];
    setLoggedInUser(user);
  }, []);

  const upcomingEvents = mockEvents.filter(event => event.dateFrom >= new Date()).sort((a,b) => a.dateFrom.getTime() - b.dateFrom.getTime());
  const pastEvents = mockEvents.filter(event => event.dateFrom < new Date()).sort((a,b) => b.dateFrom.getTime() - a.dateFrom.getTime());

  const formatDateRange = (from: Date, to: Date) => {
    const fromStr = format(from, 'PPP');
    const toStr = format(to, 'PPP');
    if (fromStr === toStr) {
        return fromStr;
    }
    return `${fromStr} to ${toStr}`;
  }
  
  const formatTimeRange = (from?: Date, to?: Date) => {
    const fromTime = from && (from.getHours() !== 0 || from.getMinutes() !== 0) ? format(from, 'p') : null;
    const toTime = to && (to.getHours() !== 0 || to.getMinutes() !== 0) ? format(to, 'p') : null;

    if (fromTime && toTime) return `${fromTime} to ${toTime}`;
    if (fromTime) return `Starts at ${fromTime}`;
    if (toTime) return `Ends at ${toTime}`;
    return null;
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
                  {event.imageUrl && (
                    <div className="relative h-48 w-full">
                      <Image src={event.imageUrl} alt={event.title} fill className="object-cover rounded-t-lg" data-ai-hint="community event" />
                    </div>
                  )}
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
                    <p className="pt-2">{event.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">View Details</Button>
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
