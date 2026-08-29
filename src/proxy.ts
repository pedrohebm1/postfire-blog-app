import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authFetch } from './app/lib/authFetch';
import { decodeToken, verifyToken } from './app/lib/jwt';

const developmentOrigins = [
  process.env.NEXT_PUBLIC_AWS_S3_CLOUD_ENDPOINT,
  'http://localhost:',
  'http://127.0.0.1:'
]

const getAllowedOrigins = (origin: string | null) => {
  if (process.env.NODE_ENV === 'development') {
    return origin && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:') || developmentOrigins.includes(origin));
  }

  const productionOrigins = [
    'https://seu-app-producao.com',
    'https://seu-painel-adm.com',
  ];
  
  return origin && productionOrigins.includes(origin);
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle CORS for /api
  if (pathname.startsWith('/api')) {
    const origin = req.headers.get('origin');
    const response = NextResponse.next();

    if (origin && getAllowedOrigins(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }

    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }

    return response;
  }

  const protectedRoutes = ['/post/create', '/post/edit', '/settings'];
  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = req.cookies.get("Authorization")?.value?.toString() || null;

    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    // Forward the authenticated payload via request headers
    const payload: any = decodeToken(token);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-username', payload.username);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/post/create',
    '/post/edit',
    '/settings',
  ],
};