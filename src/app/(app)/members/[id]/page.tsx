import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  Building,
  MapPin,
  Phone,
  Lock,
  MessageCircle,
  Users,
  HeartHandshake,
  ChevronLeft,
  Baby,
  Edit
} from 'lucide-react';
import { getMemberById } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const DetailItem = ({ icon: Icon, label, value, isPrivate = false }: { icon: React.ElementType, label: string, value: string | undefined, isPrivate?: boolean }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-4 text-sm">
            <Icon className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
                <p className="font-medium">{label}</p>
                {isPrivate ? (
                     <div className="flex items-center gap-2 text-muted-foreground">
                        <Lock className="h-3 w-3"/>
                        <span>Hidden. Request access to view.</span>
                    </div>
                ) : (
                    <p className="text-muted-foreground">{value}</p>
                )}
            </div>
        </div>
    );
};

export default function MemberDetailPage({ params }: { params: { id: string } }) {
  const user = getMemberById(params.id);

  if (!user) {
    notFound();
  }
  
  const isPhonePrivate = user.visibility?.phone !== 'public';
  const registeredByMember = user.registeredBy ? getMemberById(user.registeredBy) : null;
  const wasAddedBySelf = !registeredByMember || registeredByMember.id === user.id;

  return (
    <div className="space-y-6">
        <Button variant="ghost" asChild>
            <Link href="/members"><ChevronLeft className="mr-2 h-4 w-4" />Back to Directory</Link>
        </Button>

      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 text-4xl">
            <AvatarImage src={user.profilePhotoUrl} alt={user.name} data-ai-hint="profile photo" />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
            <p className="text-lg text-muted-foreground">{user.profession}</p>
            <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
              <MapPin className="h-4 w-4" />
              {user.city}
            </p>
            <div className="mt-4 flex gap-2 justify-center sm:justify-start">
              <Button>
                <MessageCircle className="mr-2 h-4 w-4" />
                Request Hidden Details
              </Button>
              <Button variant="outline">Share</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem icon={User} label="Gender" value={user.gender} />
            <DetailItem icon={HeartHandshake} label="Date of Birth" value={format(user.dob, 'MMMM d, yyyy')} />
            <DetailItem icon={HeartHandshake} label="Marital Status" value={user.maritalStatus} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5 text-primary" /> Work & Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem icon={Building} label="Company / Organization" value={user.company} />
            <DetailItem icon={MapPin} label="Present Address" value={user.presentAddress} isPrivate />
            <DetailItem icon={Phone} label="Phone Number" value={user.phone} isPrivate={isPhonePrivate} />
          </CardContent>
        </Card>

         <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Family</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem icon={Users} label="Father's Name" value={user.fatherName} isPrivate={user.visibility?.fatherName !== 'public'}/>
            <DetailItem icon={Users} label="Mother's Name" value={user.motherName} isPrivate />
            {user.maritalStatus === "Married" && <DetailItem icon={Users} label="Spouse Details" value={user.spouseDetails || "Details are private"} isPrivate />}
            {user.childrenDetails && <DetailItem icon={Baby} label="Children Details" value={user.childrenDetails} isPrivate />}
          </CardContent>
        </Card>
      </div>
      
       <Card className="bg-secondary/50">
        <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Edit className="h-4 w-4" />
                {wasAddedBySelf ? (
                    "Profile added by Self."
                ) : (
                    <>
                     Profile added by <Link href={`/members/${registeredByMember?.id}`} className="font-medium text-primary hover:underline">{registeredByMember?.name}</Link>.
                    </>
                )}
            </p>
        </CardContent>
       </Card>

    </div>
  );
}
