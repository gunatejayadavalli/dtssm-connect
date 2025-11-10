import Link from 'next/link';
import { Search, Filter, Plus } from 'lucide-react';
import { differenceInYears } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockBiodata, mockUsers } from '@/lib/data';
import type { Biodata } from '@/lib/types';

const BiodataCard = ({ biodata }: { biodata: Biodata }) => {
  const user = mockUsers.find(u => u.id === biodata.ownerUserId);
  const age = differenceInYears(new Date(), biodata.dob);

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-20 w-20 border-2 border-primary/20">
          <AvatarImage src={biodata.photos?.[0]} alt={biodata.name} data-ai-hint="profile photo" />
          <AvatarFallback>{biodata.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold font-headline">{biodata.name}</h3>
          <p className="text-sm text-muted-foreground">{age} years old, {biodata.height}</p>
          <p className="text-sm text-muted-foreground">{biodata.city}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">{biodata.about}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">{biodata.education}</Badge>
          <Badge variant="outline">{biodata.profession}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/biodata/${biodata.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function BiodataPage() {
  const activeBiodata = mockBiodata.filter(b => b.isActive);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Biodata Directory</h1>
          <p className="text-muted-foreground">Find profiles of unmarried community members.</p>
        </div>
        <Button asChild>
          <Link href="/biodata/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Biodata
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, profession, education..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {activeBiodata.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {activeBiodata.map((biodata) => (
            <BiodataCard key={biodata.id} biodata={biodata} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-semibold">No Biodata Found</h3>
            <p className="text-muted-foreground mt-2">There are currently no active biodata profiles.</p>
            <Button asChild className="mt-4">
                <Link href="/biodata/new">Create the First One</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
