'use client';

import Link from 'next/link';
import { Globe, Bell, Info, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SettingsPage() {
  const appVersion = "1.0.0"; // This would typically come from package.json

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences and account.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Language</CardTitle>
          <CardDescription>Choose your preferred language for the app interface.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select defaultValue="en">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notifications</CardTitle>
          <CardDescription>Control the reminders you receive.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
            <Label htmlFor="reminders-switch" className="flex flex-col space-y-1">
              <span>Quarterly Profile Reminders</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive a reminder every 3 months to review your profile.
              </span>
            </Label>
            <Switch id="reminders-switch" defaultChecked />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary" /> About</CardTitle>
          <CardDescription>Information about the application.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
            <p><strong>App Name:</strong> DTSSM Connect</p>
            <p><strong>Version:</strong> {appVersion}</p>
            <p className="mt-2">For support, please <Link href="/contact" className="underline text-primary">contact us</Link>.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive"><LogOut className="h-5 w-5" /> Logout</CardTitle>
          <CardDescription>You will be returned to the login screen.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" asChild>
            <Link href="/login">Log Out of Your Account</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
