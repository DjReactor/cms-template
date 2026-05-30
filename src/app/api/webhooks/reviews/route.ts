import { NextResponse } from 'next/server';
import { getAdminPocketBase } from '@/lib/pocketbase-admin';

export async function POST(request: Request) {
  const payload = await request.json();
  const pb = await getAdminPocketBase();

  try {
    if (payload.rating >= 4) {
      await pb.collection('testimonials').create({
        author_name: payload.reviewer_name || 'Anonymous',
        rating: payload.rating,
        content: payload.text,
        source: payload.source || 'Google',
        visible: false
      });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}
