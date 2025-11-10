import type { User, Biodata, CommunityEvent } from '@/lib/types';

export const mockUsers: User[] = [
  {
    id: 'usr_1',
    name: 'Arjun Sharma',
    fatherName: 'Rajesh Sharma',
    city: 'Hyderabad',
    profession: 'Software Engineer',
    profilePhotoUrl: 'https://picsum.photos/seed/user1/200/200',
    maritalStatus: 'Single',
    dob: new Date('1992-05-15'),
    gender: 'Male',
    phone: '9876543210',
    isApproved: true,
    roles: { isAdmin: false },
    visibility: {
      phone: 'consent-based',
      fatherName: 'public'
    }
  },
  {
    id: 'usr_2',
    name: 'Priya Singh',
    fatherName: 'Amit Singh',
    city: 'Mumbai',
    profession: 'Doctor',
    profilePhotoUrl: 'https://picsum.photos/seed/user2/200/200',
    maritalStatus: 'Married',
    spouseDetails: 'Ravi Singh (Businessman)',
    childrenDetails: 'Aarav (5 years), Riya (2 years)',
    dob: new Date('1988-11-20'),
    gender: 'Female',
    phone: '9876543211',
    isApproved: true,
    registeredBy: 'usr_4',
    roles: { isAdmin: false },
     visibility: {
      phone: 'private',
      fatherName: 'public'
    }
  },
  {
    id: 'usr_3',
    name: 'Rohan Verma',
    fatherName: 'Sanjay Verma',
    city: 'Delhi',
    profession: 'Architect',
    profilePhotoUrl: 'https://picsum.photos/seed/user3/200/200',
    maritalStatus: 'Single',
    dob: new Date('1994-01-30'),
    gender: 'Male',
    phone: '9876543212',
    isApproved: false,
    registeredBy: 'usr_1',
    roles: { isAdmin: false },
     visibility: {
      phone: 'consent-based',
      fatherName: 'public'
    }
  },
  {
    id: 'usr_4',
    name: 'Admin User',
    fatherName: 'Admin Father',
    city: 'Bengaluru',
    profession: 'Community Manager',
    profilePhotoUrl: 'https://picsum.photos/seed/user4/200/200',
    maritalStatus: 'Married',
    spouseDetails: 'Admin Spouse',
    childrenDetails: 'One child',
    dob: new Date('1985-02-10'),
    gender: 'Female',
    phone: '9999999999',
    isApproved: true,
    registeredBy: 'usr_4',
    roles: { isAdmin: true },
    visibility: {
      phone: 'public',
      fatherName: 'public'
    }
  },
];

export const mockBiodata: Biodata[] = [
  {
    id: 'bio_1',
    ownerUserId: 'usr_1',
    name: 'Arjun Sharma',
    dob: new Date('1992-05-15'),
    gender: 'Male',
    height: "5'10\"",
    education: 'B.Tech in Computer Science',
    profession: 'Software Engineer',
    company: 'Tech Solutions Inc.',
    city: 'Hyderabad',
    about: 'Loves trekking and photography. Looking for a simple and understanding partner.',
    isActive: true,
    visibility: {
      company: 'consent-based',
      about: 'public'
    },
    photos: [
      'https://picsum.photos/seed/bio1_1/400/500',
      'https://picsum.photos/seed/bio1_2/400/500',
    ]
  },
  {
    id: 'bio_2',
    ownerUserId: 'usr_4', // Now owned by admin user for testing
    name: 'Sneha Reddy',
    dob: new Date('1995-08-22'),
    gender: 'Female',
    height: "5'5\"",
    education: 'M.A. in English Literature',
    profession: 'Teacher',
    company: 'Global Public School',
    city: 'Chennai',
    about: 'Passionate about reading and classical dance. Family-oriented and values traditions.',
    isActive: true,
    visibility: {
      company: 'public',
      about: 'public'
    },
    photos: [
      'https://picsum.photos/seed/bio2_1/400/500'
    ]
  },
];


export const mockEvents: CommunityEvent[] = [
    {
        id: 'evt_1',
        title: 'Annual Community Picnic',
        date: new Date('2024-09-15'),
        time: '11:00 AM - 4:00 PM',
        venue: 'Indira Park, Hyderabad',
        description: 'Join us for a day of fun, food, and games at the annual community picnic. All families are welcome. Please bring a dish to share.',
        imageUrl: 'https://picsum.photos/seed/event1/800/400'
    },
    {
        id: 'evt_2',
        title: 'Ugadi Celebrations 2024',
        date: new Date('2024-04-09'),
        time: '6:00 PM onwards',
        venue: 'Community Hall, Main Street',
        description: 'Celebrate the Telugu New Year with traditional festivities, cultural programs, and a special Ugadi Pachadi feast.',
        imageUrl: 'https://picsum.photos/seed/event2/800/400'
    },
    {
        id: 'evt_3',
        title: 'Charity Blood Donation Camp',
        date: new Date('2024-10-02'),
        time: '9:00 AM - 5:00 PM',
        venue: 'Red Cross Building, Downtown',
        description: 'Give the gift of life. Our community is organizing a blood donation camp. Your participation can save lives.',
        imageUrl: 'https://picsum.photos/seed/event3/800/400'
    }
]

export const getMemberById = (id: string) => mockUsers.find(u => u.id === id);
export const getBiodataById = (id: string) => mockBiodata.find(b => b.id === id);
