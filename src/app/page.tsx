import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import * as jose from 'jose';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (token) {
    try {
      const secret = new TextEncoder().encode('secret-key-change-me');
      await jose.jwtVerify(token.value, secret);
      redirect('/dashboard');
    } catch (e) {
    }
  }

  redirect('/login');
}
