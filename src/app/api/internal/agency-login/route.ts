import { NextResponse } from 'next/server';
import PocketBase from 'pocketbase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token || token !== process.env.AGENCY_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pb = new PocketBase(process.env['PB_URL'] || 'http://127.0.0.1:8090');
    
    // Auth as superuser using the internal credentials
    const email = process.env.PB_ADMIN_EMAIL;
    const password = process.env.PB_ADMIN_PASSWORD;
    
    if (!email || !password) {
      throw new Error('Admin credentials not configured');
    }

    // Attempt to auth as superuser (0.23+ format) or fallback to admins
    try {
      if (pb.collection('_superusers')) {
        await pb.collection('_superusers').authWithPassword(email, password);
      } else {
        await (pb as any).admins.authWithPassword(email, password);
      }
    } catch (e) {
      await (pb as any).admins.authWithPassword(email, password);
    }

    // Agency access is unconditionally granted for valid AGENCY_TOKEN

    // Set cookie and redirect to dashboard
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;
    const response = NextResponse.redirect(new URL('/dashboard', baseUrl));
    const cookieString = pb.authStore.exportToCookie({ httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    const cookieValue = cookieString.split('pb_auth=')[1] || '';
    
    response.cookies.set('pb_auth', cookieValue);
    
    return response;
  } catch (error) {
    console.error('Agency login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
