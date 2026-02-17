import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const secret = new TextEncoder().encode('secret-key-change-me');

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/api/projects') || request.nextUrl.pathname.startsWith('/api/tasks')) {
        if (!token) {
            if (request.nextUrl.pathname.startsWith('/api/')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const { payload } = await jose.jwtVerify(token, secret);
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-user-id', payload.sub as string);

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });

        } catch (err) {
            if (request.nextUrl.pathname.startsWith('/api/')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/api/projects/:path*', '/api/tasks/:path*'],
};
