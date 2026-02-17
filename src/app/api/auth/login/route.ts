import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as jose from 'jose';

const secret = new TextEncoder().encode('secret-key-change-me');

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = db.users.find((u) => u.email === email && u.passwordHash === password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const alg = 'HS256';
    const jwt = await new jose.SignJWT({ sub: user.id, name: user.name, email: user.email })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(secret);

    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });

    response.cookies.set('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7200,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
