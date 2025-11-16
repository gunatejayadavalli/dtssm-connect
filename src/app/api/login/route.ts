import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/data';

export async function POST(request: Request) {
  const { phone, isNewUser } = await request.json();

  if (!phone || !/^\d{10}$/.test(phone)) {
    return NextResponse.json(
        { success: false, message: 'Please enter a valid 10-digit phone number.' },
        { status: 400 }
    );
  }
  
  // For new user registration, we find them to create a session, but don't check for approval.
  if (isNewUser) {
    const newUser = mockUsers.find(u => u.phone === phone);
    if (newUser) {
       const cookieStore = cookies();
       cookieStore.set('auth_token', JSON.stringify({ id: newUser.id, name: newUser.name, phone: newUser.phone, isApproved: newUser.isApproved }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
       });
       return NextResponse.json({ success: true, message: 'Session created for new user.' });
    } else {
       // This case should ideally not happen if registration and login are transactional.
       return NextResponse.json({ success: false, message: 'Could not find newly registered user.' }, { status: 500 });
    }
  }

  // Standard login flow
  const user = mockUsers.find(u => u.phone === phone);

  if (!user) {
    return NextResponse.json({ success: false, message: 'No user found with this phone number.' }, { status: 404 });
  }

  const cookieStore = cookies();
  
  cookieStore.set('auth_token', JSON.stringify({ id: user.id, name: user.name, phone: user.phone, isApproved: user.isApproved }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return NextResponse.json({ success: true, message: 'Logged in successfully' });
}
