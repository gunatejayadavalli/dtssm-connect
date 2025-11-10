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
  ChevronLeft,
} from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dob: z.string().min(1, 'Date of Birth is required'),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Gender is required' }),
  phone: z.string().min(1, 'Phone number is required'),
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
}).refine(data => data.phone.length === 10, {
  message: "Phone number must be 10 digits",
  path: ["phone"],
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [openAccordions, setOpenAccordions] = useState<string[]>(['basic-info']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      dob: '',
      gender: undefined,
      phone: '',
      fatherName: '',
      motherName: '',
      presentAddress: '',
      permanentAddress: '',
      city: '',
      profession: '',
      company: '',
      maritalStatus: undefined,
      spouseDetails: '',
      childrenDetails: '',
    },
  });

  const { watch, formState: { errors, isValid } } = form;
  const maritalStatus = watch('maritalStatus');
  const phoneValue = watch('phone');
  const presentAddressValue = watch('presentAddress');
  const permanentAddressValue = watch('permanentAddress');
  const professionValue = watch('profession');
  const companyValue = watch('company');
  const spouseDetailsValue = watch('spouseDetails');
  const childrenDetailsValue = watch('childrenDetails');
  
  const showFamilyDetails = maritalStatus && ['Married', 'Widowed', 'Divorced'].includes(maritalStatus);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSendOtp = () => {
    // Basic validation before sending OTP
    if (phoneValue.length !== 10) {
      form.setError("phone", { type: "manual", message: "Please enter a valid 10-digit phone number." });
      return;
    }
    // In a real app, this would trigger an API call to send OTP
    console.log(`Sending OTP to ${phoneValue}`);
    setIsOtpSent(true);
    setResendTimer(30); // 30 second timer
  };

  const handleVerifyOtp = () => {
    // In a real app, this would verify OTP via an API call
    if (otp === '123456') { // Mock OTP
      console.log('OTP Verified');
      setIsOtpVerified(true);
      setOtp('');
      setIsOtpSent(false); // Hide OTP fields after verification
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      handleSendOtp();
    }
  };

  const accordionFields: Record<string, (keyof FormSchemaType)[]> = {
    'basic-info': ['name', 'dob', 'gender', 'phone'],
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
    if (!isOtpVerified) {
      alert("Please verify your phone number before submitting.");
      return;
    }
    console.log(values);
    // On success, redirect to awaiting approval
    router.push('/awaiting-approval');
  }
  
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
            Your profile will be submitted for admin approval. Fields marked with * are mandatory.
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
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={errors.name ? 'text-destructive' : ''}>Full Name *</FormLabel>
                      <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
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
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your gender" /></SelectTrigger></FormControl>
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
                      <FormLabel className={errors.phone ? 'text-destructive' : ''}>Phone Number (for login) *</FormLabel>
                       <div className="flex items-center gap-2">
                        <FormControl>
                          <Input type="tel" placeholder="Your 10-digit mobile number" {...field} disabled={isOtpVerified || isOtpSent} />
                        </FormControl>
                        {!isOtpSent && !isOtpVerified && (
                          <Button type="button" onClick={handleSendOtp}>Send OTP</Button>
                        )}
                        {isOtpVerified && (
                           <div className="text-sm font-medium text-green-600">Verified</div>
                        )}
                      </div>
                    </FormItem>
                  )} />

                  {isOtpSent && !isOtpVerified && (
                     <div className="space-y-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <div className="flex items-center gap-2">
                            <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" />
                            <Button type="button" onClick={handleVerifyOtp}>Verify OTP</Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0} className="text-primary disabled:text-muted-foreground disabled:cursor-not-allowed">
                                Resend OTP {resendTimer > 0 ? `in ${resendTimer}s` : ''}
                            </button>
                        </p>
                    </div>
                  )}

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
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="motherName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Name</FormLabel>
                      <FormControl><Input placeholder="Your mother's name" {...field} /></FormControl>
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
                      <FormControl><Input placeholder="Your company name" {...field} /></FormControl>
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
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your marital status" /></SelectTrigger></FormControl>
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
                              placeholder="Please provide names and ages of your children."
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="privacy-info">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary" /> Privacy Settings
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">Control who can see your information. 'Consent-based' means others must request to see it. Fields not listed here are public by default.</p>
                  
                  {!!presentAddressValue && (
                     <Card className="p-4">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between">
                                <Label htmlFor={`privacy-presentAddress`} className="font-medium">Present Address</Label>
                                <div className="flex items-center space-x-2">
                                    <Label>Public</Label>
                                    <Switch id={`privacy-presentAddress`} defaultChecked />
                                    <Label>Consent</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                  )}
                  {!!permanentAddressValue && (
                     <Card className="p-4">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between">
                                <Label htmlFor={`privacy-permanentAddress`} className="font-medium">Permanent Address</Label>
                                <div className="flex items-center space-x-2">
                                    <Label>Public</Label>
                                    <Switch id={`privacy-permanentAddress`} defaultChecked />
                                    <Label>Consent</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                  )}
                   {!!phoneValue && (
                     <Card className="p-4">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between">
                                <Label htmlFor={`privacy-phone`} className="font-medium">Phone Number</Label>
                                <div className="flex items-center space-x-2">
                                    <Label>Public</Label>
                                    <Switch id={`privacy-phone`} defaultChecked />
                                    <Label>Consent</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                  )}
                  {maritalStatus === 'Married' && !!spouseDetailsValue && (
                     <Card className="p-4">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between">
                                <Label htmlFor={`privacy-spouseDetails`} className="font-medium">Spouse Details</Label>
                                <div className="flex items-center space-x-2">
                                    <Label>Public</Label>
                                    <Switch id={`privacy-spouseDetails`} defaultChecked />
                                    <Label>Consent</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                  )}
                  {showFamilyDetails && !!childrenDetailsValue && (
                     <Card className="p-4">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between">
                                <Label htmlFor={`privacy-childrenDetails`} className="font-medium">Children Details</Label>
                                <div className="flex items-center space-x-2">
                                    <Label>Public</Label>
                                    <Switch id={`privacy-childrenDetails`} defaultChecked />
                                    <Label>Consent</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                  )}
                  {!!professionValue && (
                     <Card className="p-4">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between">
                                <Label htmlFor={`privacy-profession`} className="font-medium">Profession</Label>
                                <div className="flex items-center space-x-2">
                                    <Label>Public</Label>
                                    <Switch id={`privacy-profession`} defaultChecked />
                                    <Label>Consent</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                  )}
                   {!!companyValue && (
                     <Card className="p-4">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between">
                                <Label htmlFor={`privacy-company`} className="font-medium">Company / Organization</Label>
                                <div className="flex items-center space-x-2">
                                    <Label>Public</Label>
                                    <Switch id={`privacy-company`} defaultChecked />
                                    <Label>Consent</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                  )}

                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Button type="submit" className="w-full" size="lg" disabled={!isOtpVerified || !isValid}>Submit for Approval</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
