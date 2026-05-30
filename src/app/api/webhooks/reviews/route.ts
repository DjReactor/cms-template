import { NextResponse } from 'next/server';
import { getPocketBaseClient } from '@/lib/pocketbase';
import { authenticateWebhook } from '@/lib/webhook-auth';

export async function POST(req: Request) {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const payload = await req.text();

  if (!authenticateWebhook(req, payload, secret)) {
    return NextResponse.json({ error: 'Unauthorized: Invalid signature or missing API key' }, { status: 401 });
  }

  try {
    const data = JSON.parse(payload);
    
    if (!data.author_name || !data.content || !data.rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pb = await getPocketBaseClient();
    
    const testimonial = await pb.collection('testimonials').create({
      author_name: data.author_name,
      author_photo_url: data.author_photo_url || '',
      title: data.title || '',
      author_location: data.author_location || '',
      rating: data.rating,
      content: data.content,
      source: data.source || 'google',
      is_visible: data.rating >= 4, // Auto-approve 4+ star reviews
      sort_order: 0
    });

    return NextResponse.json({ success: true, testimonial: { id: testimonial.id } });
  } catch (error: any) {
    console.error('Reviews Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
