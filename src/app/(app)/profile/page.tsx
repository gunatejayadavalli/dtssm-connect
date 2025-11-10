import { notFound } from 'next/navigation';
import { User as UserIcon, Building, MapPin, Phone, HeartHandshake, Users, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { getMemberById } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => {
    if (!value) return null;
    return (
        <div className="grid grid-cols-3 gap-4 text-sm">
            <dt className="font-medium text-muted-foreground flex items-center gap-2 col-span-1"><Icon className="h-4 w-4" />{label}</dt>
            <dd className="col-span-2">{value}</dd>
        </div>
    );
};

export default function ProfilePage() {
  // In a real app, you'd get the logged-in user's ID
  const user = getMemberById('usr_4'); // Using admin user for demo

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline">My Profile</h1>
            <p className="text-muted-foreground">View and manage your personal information.</p>
        </div>
        <Button variant="outline"><Edit className="mr-2 h-4 w-4" />Edit Profile</Button>
      </div>

      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 text-4xl">
            <AvatarImage src={user.profilePhotoUrl} alt={user.name} data-ai-hint="profile photo" />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold font-headline">{user.name}</h2>
            <p className="text-lg text-muted-foreground">{user.profession}</p>
             <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
                <Badge variant="secondary">{user.maritalStatus}</Badge>
                {user.roles.isAdmin && <Badge variant="destructive">Admin</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <dl className="space-y-4">
              <DetailItem icon={Phone} label="Phone" value={user.phone} />
              <DetailItem icon={UserIcon} label="Gender" value={user.gender} />
              <DetailItem icon={HeartHandshake} label="Date of Birth" value={format(user.dob, 'MMMM d, yyyy')} />
              <DetailItem icon={Users} label="Father's Name" value={user.fatherName} />
              <DetailItem icon={Users} label="Mother's Name" value={user.motherName} />
              {user.maritalStatus === "Married" && <DetailItem icon={Users} label="Spouse Details" value={user.spouseDetails || "Not provided"} />}
            </dl>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Work & Address</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <dl className="space-y-4">
                <DetailItem icon={Building} label="Company" value={user.company} />
                <DetailItem icon={MapPin} label="Present Address" value={user.presentAddress} />
                <DetailItem icon={MapPin} label="Permanent Address" value={user.permanentAddress} />
                <DetailItem icon={MapPin} label="City" value={user.city} />
            </dl>
        </CardContent>
      </Card>

      {user.maritalStatus === 'Single' && (
        <Card>
            <CardHeader><CardTitle>My Biodata</CardTitle></CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-muted-foreground">Manage your biodata profile for matchmaking.</p>
                <Button asChild>
                    <Link href="/biodata/bio_1/edit">Manage My Biodata</Link>
                </Button>
            </CardContent>
        </Card>
      )}

    </div>
  );
}
