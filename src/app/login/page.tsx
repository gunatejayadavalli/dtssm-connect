'use client';

import { useRouter } from 'next/navigation';
import { AtSign, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // In a real app, you might send the phone number
        body: JSON.stringify({ phone }),
      });

      if (response.ok) {
        toast({
          title: "Login Successful",
          description: "You are now logged in.",
        });
        router.push('/home');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not log in. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
            <div className="mb-4 inline-block">
                <AtSign className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="text-2xl font-headline">DTSSM Connect</CardTitle>
          <CardDescription>
            Enter your mobile number to login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="98765 43210" 
                  required 
                  className="pl-10" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            {/* The OTP field can be conditionally shown after OTP is sent */}
            {/* 
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input id="otp" type="text" placeholder="Enter 6-digit OTP" />
            </div> 
            */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            By continuing, you agree to our{' '}
            <Link href="#" className="underline">
              Terms of Service
            </Link>
            .
          </div>
           <div className="mt-6 text-center text-sm">
            New member?{' '}
            <Link href="/register" className="underline font-medium text-primary">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
