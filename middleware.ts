import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    addCorsHeaders(response);
    return response;
  }

  // Handle regular requests
  const response = NextResponse.next();
  addCorsHeaders(response);
  return response;
}

function addCorsHeaders(response: NextResponse) {
  // Get the origin from the request headers or use a default value
  const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
}

// Configure middleware to run on API routes
export const config = {
  matcher: '/api/:path*',
};