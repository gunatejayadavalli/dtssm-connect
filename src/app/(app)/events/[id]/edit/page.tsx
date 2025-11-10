'use client';

import Link from 'next/link';
import { notFound, useRouter, useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ChevronLeft, Calendar, Info, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DateTimePicker } from '@/components/date-time-picker';
import { mockEvents } from '@/lib/data';
import { useEffect } from 'react';

const eventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  dateFrom: z.date({ required_error: 'Start date is required' }),
  dateTo: z.date({ required_error: 'End date is required' }),
  venue: z.string().min(3, "Venue is required"),
  description: z.string().max(1000, "Description is too long").optional(),
});

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const router = useRouter();
  const event = mockEvents.find(e => e.id === params.id);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
        title: '',
        venue: '',
        description: '',
    },
  });
  
  useEffect(() => {
    if (event) {
        form.reset({
            title: event.title,
            dateFrom: event.dateFrom,
            dateTo: event.dateTo,
            venue: event.venue,
            description: event.description,
        });
    }
  }, [event, form]);

  if (!event) {
    notFound();
  }

  function onSubmit(values: z.infer<typeof eventSchema>) {
    console.log({ ...values, id: event?.id });
    toast({
        title: "Event Updated",
        description: "The event has been successfully updated.",
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
        <h1 className="text-3xl font-bold font-headline">Edit Event</h1>
        <p className="text-muted-foreground">Update the details for the community event.</p>
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
                      <FormLabel>Date To</FormLabel>
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

          <Button type="submit" size="lg" className="w-full">Update Event</Button>
        </form>
      </Form>
    </div>
  );
}
