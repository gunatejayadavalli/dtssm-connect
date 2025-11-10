'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  PersonStanding,
  Users,
  MapPin,
  Briefcase,
  HeartHandshake,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date (YYYY-MM-DD)."),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  fatherName: z.string().min(2, "Father's name is required."),
  motherName: z.string().optional(),
  presentAddress: z.string().min(5, "Address is required."),
  permanentAddress: z.string().optional(),
  city: z.string().min(2, "City is required."),
  profession: z.string().min(2, "Profession is required."),
  company: z.string().optional(),
  maritalStatus: z.enum(['Single', 'Married', 'Widowed', 'Divorced']),
});

export default function RegisterPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      fatherName: '',
      presentAddress: '',
      city: '',
      profession: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // On success, redirect to awaiting approval
    window.location.href = '/awaiting-approval';
  }
  
  const formFields = [
      { name: 'name', label: 'Full Name' },
      { name: 'fatherName', label: "Father's Name" },
      { name: 'motherName', label: "Mother's Name" },
      { name: 'dob', label: 'Date of Birth' },
      { name: 'gender', label: 'Gender' },
      { name: 'presentAddress', label: 'Present Address' },
      { name: 'permanentAddress', label: 'Permanent Address' },
      { name: 'city', label: 'City / Place' },
      { name: 'profession', label: 'Profession' },
      { name: 'company', label: 'Company / Organization' },
      { name: 'maritalStatus', label: 'Marital Status' },
      { name: 'spouseDetails', label: 'Spouse Details (if married)' },
      { name: 'phone', label: 'Phone Number' },
  ]

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/login">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
          <h1 className="text-3xl font-bold font-headline mt-4">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Your profile will be submitted for admin approval.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Accordion type="multiple" defaultValue={['basic-info']} className="w-full">
              <AccordionItem value="basic-info">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <PersonStanding className="h-5 w-5 text-primary" /> Basic Information
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="dob" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your gender" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (for login)</FormLabel>
                      <FormControl><Input type="tel" placeholder="Your 10-digit mobile number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="family-info">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" /> Family Details
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                  <FormField control={form.control} name="fatherName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father's Name</FormLabel>
                      <FormControl><Input placeholder="Your father's name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="motherName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Name</FormLabel>
                      <FormControl><Input placeholder="Your mother's name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="address-info">
                 <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" /> Address
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                  <FormField control={form.control} name="presentAddress" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Present Address</FormLabel>
                      <FormControl><Input placeholder="Your current address" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="permanentAddress" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permanent Address</FormLabel>
                      <FormControl><Input placeholder="(If different from present)" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City / Place</FormLabel>
                      <FormControl><Input placeholder="e.g., Hyderabad" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="work-info">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-primary" /> Work Details
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                   <FormField control={form.control} name="profession" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profession</FormLabel>
                      <FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company / Organization</FormLabel>
                      <FormControl><Input placeholder="Your company name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="marital-info">
                 <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <HeartHandshake className="h-5 w-5 text-primary" /> Marital Status
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                   <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your marital status" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/* Conditional Spouse Details field would go here */}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="privacy-info">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary" /> Privacy Settings
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">Control who can see your information. 'Consent-based' means others must request to see it.</p>
                  {formFields.map(field => (
                    <Card key={field.name} className="p-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor={`privacy-${field.name}`} className="font-medium">{field.label}</Label>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor={`privacy-${field.name}-public`}>Public</Label>
                                <Switch id={`privacy-${field.name}`} defaultChecked />
                                <Label htmlFor={`privacy-${field.name}-consent`}>Consent</Label>
                            </div>
                        </div>
                    </Card>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Button type="submit" className="w-full" size="lg">Submit for Approval</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
