import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { password } = await request.json();
  
  // In production, this should come from env var
  const validPassword = process.env.ADMIN_PASSWORD || 'changeme';
  
  if (password === validPassword) {
    // Set authentication cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ success: false }, { status: 401 });
}
