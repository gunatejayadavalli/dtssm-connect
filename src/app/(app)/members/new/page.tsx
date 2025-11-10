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
  ChevronLeft,
  Link2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '@/lib/data';
import type { User } from '@/lib/types';


const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dob: z.string().min(1, 'Date of Birth is required'),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Gender is required' }),
  phone: z.string().min(10, 'Phone number must be 10 digits').max(10, 'Phone number must be 10 digits'),
  relationToMember: z.string().min(1, 'Relation is required'),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  presentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  profession: z.string().optional(),
  company: z.string().optional(),
  maritalStatus: z.enum(['Single', 'Married', 'Widowed', 'Divorced'], { required_error: 'Marital status is required' }),
  spouseDetails: z.string().optional(),
  childrenDetails: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function NewMemberPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [openAccordions, setOpenAccordions] = useState<string[]>(['basic-info']);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    // In a real app, you'd fetch the logged-in user's data
    const user = mockUsers.find(u => u.roles.isAdmin) || mockUsers[0];
    setLoggedInUser(user);
  }, []);
  
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      dob: '',
      gender: undefined,
      phone: '',
      city: '',
      maritalStatus: undefined,
      relationToMember: '',
    },
  });

  const { watch, formState: { errors } } = form;
  const maritalStatus = watch('maritalStatus');
  const showFamilyDetails = maritalStatus && ['Married', 'Widowed', 'Divorced'].includes(maritalStatus);

  const accordionFields: Record<string, (keyof FormSchemaType)[]> = {
    'basic-info': ['name', 'dob', 'gender', 'phone', 'relationToMember'],
    'address-info': ['city'],
    'marital-info': ['maritalStatus'],
  };

  const onInvalid = (errors: any) => {
    const errorSections = Object.keys(accordionFields).filter(section => 
      accordionFields[section].some(field => errors[field])
    );
    if (errorSections.length > 0) {
      setOpenAccordions(Array.from(new Set([...openAccordions, ...errorSections])));
    }
  };

  function onSubmit(values: FormSchemaType) {
    console.log({
      ...values,
      registeredBy: loggedInUser?.id
    });
    toast({
        title: "Member Profile Created",
        description: `The profile for ${values.name} has been submitted for approval.`,
    });
    router.push('/members');
  }
  
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/members">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Member Directory
            </Link>
          </Button>
          <h1 className="text-3xl font-bold font-headline mt-4">Add New Member</h1>
          <p className="text-muted-foreground">
            The new member's profile will be submitted for admin approval. Fields marked with * are mandatory.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
            <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions} className="w-full">
              <AccordionItem value="basic-info">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <PersonStanding className="h-5 w-5 text-primary" /> Basic Information
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                  <FormItem>
                    <FormLabel>Registering on behalf of</FormLabel>
                    <Input disabled value={loggedInUser?.name || 'Loading...'} />
                  </FormItem>
                  <FormField control={form.control} name="relationToMember" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={errors.relationToMember ? 'text-destructive' : ''}>
                        <div className="flex items-center gap-1">
                          <Link2 className="h-4 w-4" />
                          Your Relation to the Member *
                        </div>
                      </FormLabel>
                      <FormControl><Input placeholder="e.g., Father, Brother, Friend" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <hr />
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={errors.name ? 'text-destructive' : ''}>Full Name *</FormLabel>
                      <FormControl><Input placeholder="Member's full name" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="dob" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={errors.dob ? 'text-destructive' : ''}>Date of Birth *</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={errors.gender ? 'text-destructive' : ''}>Gender *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={errors.phone ? 'text-destructive' : ''}>Phone Number *</FormLabel>
                       <FormControl>
                        <Input type="tel" placeholder="Member's 10-digit mobile number" {...field} />
                      </FormControl>
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
                      <FormControl><Input placeholder="Father's name" {...field} /></FormControl>
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="motherName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Name</FormLabel>
                      <FormControl><Input placeholder="Mother's name" {...field} /></FormControl>
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
                      <FormControl><Input placeholder="Current address" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="permanentAddress" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permanent Address</FormLabel>
                      <FormControl><Input placeholder="(If different from present)" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={errors.city ? 'text-destructive' : ''}>City / Place *</FormLabel>
                      <FormControl><Input placeholder="e.g., Hyderabad" {...field} /></FormControl>
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
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company / Organization</FormLabel>
                      <FormControl><Input placeholder="Company name" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="marital-info">
                 <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <HeartHandshake className="h-5 w-5 text-primary" /> Marital Status & Family
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                   <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={errors.maritalStatus ? 'text-destructive' : ''}>Marital Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select marital status" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  {maritalStatus === 'Married' && (
                    <FormField control={form.control} name="spouseDetails" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spouse Details</FormLabel>
                        <FormControl><Input placeholder="Spouse Name & details" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  )}
                  {showFamilyDetails && (
                    <FormField
                      control={form.control}
                      name="childrenDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Children Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide names and ages of children."
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
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
