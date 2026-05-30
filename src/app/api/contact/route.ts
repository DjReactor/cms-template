import { NextResponse } from 'next/server';
import { getAdminPocketBase } from '@/lib/pocketbase-admin';

export async function POST(request: Request) {
  const payload = await request.json();
  const pb = await getAdminPocketBase();

  try {
    await pb.collection('contacts').create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      message: payload.message,
      source: 'website',
      status: 'new'
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
