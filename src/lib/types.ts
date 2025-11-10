export type Visibility = 'public' | 'private' | 'consent-based';

export type User = {
  id: string;
  name: string;
  fatherName: string;
  motherName?: string;
  dob: Date;
  gender: 'Male' | 'Female' | 'Other';
  presentAddress?: string;
  permanentAddress?: string;
  city: string;
  profession: string;
  company?: string;
  maritalStatus: 'Single' | 'Married' | 'Widowed' | 'Divorced';
  spouseDetails?: string;
  childrenDetails?: string;
  phone: string;
  profilePhotoUrl?: string;
  isApproved: boolean;
  registeredBy?: string;
  roles: {
    isAdmin: boolean;
  };
  visibility: {
    [key: string]: Visibility;
  };
  lastReviewedAt?: Date;
  reminderOptOut?: boolean;
};

export type Biodata = {
  id: string;
  ownerUserId: string;
  name: string;
  dob: Date;
  gender: 'Male' | 'Female';
  height?: string;
  education?: string;
  profession?: string;
  company?: string;
  city: string;
  about?: string;
  gotram?: string;
  caste?: string;
  photos?: string[];
  isActive: boolean;
  visibility: {
    [key: string]: Visibility;
  };
};

export type CommunityEvent = {
    id: string;
    title: string;
    dateFrom: Date;
    dateTo: Date;
    venue: string;
    description: string;
    createdBy?: string;
    isPublished?: boolean;
};

export type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
};
