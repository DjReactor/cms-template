import { NextResponse } from 'next/server';
import { getAdminPocketBase } from '@/lib/pocketbase-admin';
import crypto from 'crypto';

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('x-hub-signature-256');

  const pb = await getAdminPocketBase();
  const settingsList = await pb.collection('settings').getFullList(1).catch(() => []);
  const secret = settingsList[0]?.blog_webhook_secret;

  if (!secret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 400 });

  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  if (signature !== digest) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  try {
    const data = JSON.parse(payload);
    // Stub: create blog post in PB
    await pb.collection('blog_posts').create({
      title: data.title,
      slug: data.slug,
      content: data.content,
      status: 'draft',
      author_type: 'auto'
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}