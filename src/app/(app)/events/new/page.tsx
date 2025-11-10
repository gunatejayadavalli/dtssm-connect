'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ChevronLeft, Calendar, Clock, MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { DateTimePicker } from '@/components/date-time-picker';
import { addMockEvent, mockUsers } from '@/lib/data';
import { useEffect, useState } from 'react';
import { User } from '@/lib/types';

const eventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  dateFrom: z.date({ required_error: 'Start date is required' }),
  dateTo: z.date().optional(),
  venue: z.string().min(3, "Venue is required"),
  description: z.string().max(1000, "Description is too long").optional(),
});

export default function NewEventPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    // In a real app, this would be fetched from auth context
    const user = mockUsers.find(u => u.roles.isAdmin) || mockUsers[0];
    setLoggedInUser(user);
  }, []);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
        title: '',
        venue: '',
        description: '',
    },
  });

  function onSubmit(values: z.infer<typeof eventSchema>) {
    addMockEvent({
        ...values,
        createdBy: loggedInUser?.id,
        isPublished: true,
    });
    toast({
        title: "Event Created",
        description: "The new event has been successfully created.",
    });
    router.push('/events');
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/events">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Create New Event</h1>
        <p className="text-muted-foreground">Fill in the details for the new community event.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Event Title</FormLabel><FormControl><Input placeholder="e.g., Annual Community Picnic" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateFrom"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date From</FormLabel>
                      <DateTimePicker date={field.value} setDate={field.onChange} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateTo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date To (Optional)</FormLabel>
                      <DateTimePicker date={field.value} setDate={field.onChange} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Location</CardTitle></CardHeader>
            <CardContent>
              <FormField control={form.control} name="venue" render={({ field }) => (
                <FormItem><FormLabel>Venue / Location</FormLabel><FormControl><Input placeholder="e.g., Indira Park, Hyderabad" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary" /> Description</CardTitle></CardHeader>
            <CardContent>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Event Description</FormLabel><FormControl><Textarea placeholder="Provide a brief description of the event..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full">Create Event</Button>
        </form>
      </Form>
    </div>
  );
}
