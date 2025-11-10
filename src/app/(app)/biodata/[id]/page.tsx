import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Lock,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Calendar as CalendarIcon,
  Scaling,
  Info,
} from 'lucide-react';
import { differenceInYears } from 'date-fns';

import { getBiodataById, getMemberById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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

export default function BiodataDetailPage({ params }: { params: { id: string } }) {
  const biodata = getBiodataById(params.id);

  if (!biodata) {
    notFound();
  }
  
  const owner = getMemberById(biodata.ownerUserId);
  const age = differenceInYears(new Date(), biodata.dob);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/biodata" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Biodata Directory
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
             <CardContent className="p-0">
               <Carousel className="w-full">
                 <CarouselContent>
                    {(biodata.photos && biodata.photos.length > 0) ? biodata.photos.map((photo, index) => (
                      <CarouselItem key={index}>
                        <Image src={photo} alt={`${biodata.name}'s photo ${index + 1}`} width={400} height={500} className="w-full h-auto object-cover rounded-t-lg" data-ai-hint="person portrait" />
                      </CarouselItem>
                    )) : (
                       <CarouselItem>
                         <div className="bg-secondary flex items-center justify-center h-[400px] rounded-t-lg">
                           <User className="w-24 h-24 text-muted-foreground" />
                         </div>
                       </CarouselItem>
                    )}
                  </CarouselContent>
                  {(biodata.photos && biodata.photos.length > 1) && (
                    <>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </>
                  )}
               </Carousel>
             </CardContent>
          </Card>
          <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Request Hidden Details
                </Button>
                <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Profile
                </Button>
                <Button variant="destructive" className="w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    Mark as Married
                </Button>
              </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <h1 className="text-3xl font-bold font-headline">{biodata.name}</h1>
                </CardHeader>
                <CardContent className="space-y-4">
                    <DetailItem icon={CalendarIcon} label="Age" value={`${age} years old`} />
                    <DetailItem icon={Scaling} label="Height" value={biodata.height} />
                    <DetailItem icon={MapPin} label="City" value={biodata.city} />
                </CardContent>
            </Card>

            {biodata.about && (
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary" /> About</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{biodata.about}</p>
                </CardContent>
            </Card>
            )}

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /> Education & Work</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <DetailItem icon={GraduationCap} label="Education" value={biodata.education} />
                    <DetailItem icon={Briefcase} label="Profession" value={biodata.profession} />
                    <DetailItem icon={Briefcase} label="Company" value={biodata.company} isPrivate={biodata.visibility?.company !== 'public'} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Family & Cultural</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <DetailItem icon={User} label="Gotram" value={biodata.gotram} isPrivate />
                    <DetailItem icon={User} label="Caste / Sub-caste" value={biodata.caste} isPrivate />
                </CardContent>
            </Card>
        </div>
      </div>
       <Card className="bg-secondary/50">
        <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
                {owner ? (
                     <>
                     Biodata submitted by <Link href={`/members/${owner.id}`} className="font-medium text-primary hover:underline">{owner.name}</Link>.
                    </>
                ) : (
                    "Biodata submitter information not available."
                )}
            </p>
        </CardContent>
       </Card>
    </div>
  );
}
