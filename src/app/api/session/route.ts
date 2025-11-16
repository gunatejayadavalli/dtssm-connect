
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { User } from '@/lib/types';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user: Partial<User> = JSON.parse(token.value);
    return NextResponse.json({ user });
  } catch (error) {
    // If cookie is malformed
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
