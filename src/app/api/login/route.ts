import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { User } from '@/lib/types';

export async function POST(request: Request) {
  const { phone } = await request.json();

  if (!phone || !/^\d{10}$/.test(phone)) {
    return NextResponse.json(
        { success: false, message: 'Please enter a valid 10-digit phone number.' },
        { status: 400 }
    );
  }
  
  // For this mock implementation, we accept any 10-digit number and log the user in.
  // In a real app, you would verify the phone number here.
  const user = { id: 'usr_mock', name: 'Test User', phone };

  const cookieStore = cookies();
  
  // We'll store a mock user object or ID in the cookie for the frontend to use.
  cookieStore.set('auth_token', JSON.stringify({ id: user.id, name: user.name, phone: user.phone }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return NextResponse.json({ success: true, message: 'Logged in successfully' });
}
