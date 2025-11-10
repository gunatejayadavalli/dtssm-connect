import Image from 'next/image';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockEvents } from '@/lib/data';

export default function EventsPage() {
  const upcomingEvents = mockEvents.filter(event => event.date >= new Date()).sort((a,b) => a.date.getTime() - b.date.getTime());
  const pastEvents = mockEvents.filter(event => event.date < new Date()).sort((a,b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Community Events</h1>
        <p className="text-muted-foreground">Stay up-to-date with our community's happenings.</p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold font-headline mb-4">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="flex flex-col">
                {event.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image src={event.imageUrl} alt={event.title} fill className="object-cover rounded-t-lg" data-ai-hint="community event" />
                  </div>
                )}
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">{format(event.date, 'MMMM d, yyyy')}</Badge>
                  <CardTitle className="font-headline">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
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
            ))}
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
                    <Badge variant="outline" className="w-fit mb-2">{format(event.date, 'MMM d, yyyy')}</Badge>
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
