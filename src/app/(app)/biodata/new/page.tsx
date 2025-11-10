'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ChevronLeft, User, GraduationCap, Briefcase, MapPin, Info, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const biodataSchema = z.object({
  name: z.string().min(2, "Name is required"),
  dob: z.string().nonempty("Date of Birth is required"),
  gender: z.enum(['Male', 'Female']),
  height: z.string().optional(),
  education: z.string().optional(),
  profession: z.string().optional(),
  company: z.string().optional(),
  city: z.string().min(2, "City is required"),
  about: z.string().max(500, "About section is too long").optional(),
});

export default function NewBiodataPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof biodataSchema>>({
    resolver: zodResolver(biodataSchema),
    defaultValues: { name: '', city: '' },
  });

  function onSubmit(values: z.infer<typeof biodataSchema>) {
    console.log(values);
    toast({
        title: "Biodata Created",
        description: "The new biodata profile has been successfully created.",
    });
    // In a real app, redirect after success
    // e.g., router.push('/biodata');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/biodata">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Biodata
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Create New Biodata</h1>
        <p className="text-muted-foreground">Fill in the details for the new profile.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Basic Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="dob" render={({ field }) => (
                  <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="gender" render={({ field }) => (
                  <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>
               <FormField control={form.control} name="height" render={({ field }) => (
                  <FormItem><FormLabel>Height (e.g., 5' 10")</FormLabel><FormControl><Input placeholder="Height" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /> Education & Work</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="education" render={({ field }) => (
                <FormItem><FormLabel>Highest Education</FormLabel><FormControl><Input placeholder="e.g., B.Tech in CSE" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="profession" render={({ field }) => (
                <FormItem><FormLabel>Profession</FormLabel><FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="company" render={({ field }) => (
                <FormItem><FormLabel>Company / Organization</FormLabel><FormControl><Input placeholder="Company Name" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>

           <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Location</CardTitle></CardHeader>
            <CardContent>
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g., Hyderabad" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary" /> About</CardTitle></CardHeader>
            <CardContent>
              <FormField control={form.control} name="about" render={({ field }) => (
                <FormItem><FormLabel>About / Bio</FormLabel><FormControl><Textarea placeholder="Tell us a bit about the person..." className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImagePlus className="h-5 w-5 text-primary" /> Photos</CardTitle>
                <CardDescription>Upload up to 3 photos (optional).</CardDescription>
            </CardHeader>
            <CardContent>
                <Input type="file" multiple accept="image/*" />
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full">Create Biodata Profile</Button>
        </form>
      </Form>
    </div>
  );
}
