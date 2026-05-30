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
    
    if (!data.title || !data.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pb = await getPocketBaseClient();
    
    // Create blog post
    const post = await pb.collection('blog_posts').create({
      title: data.title,
      slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      content: data.content,
      excerpt: data.excerpt || '',
      status: data.status || 'published',
      published_at: new Date().toISOString(),
      seo_title: data.seo_title || data.title,
      seo_description: data.seo_description || data.excerpt || '',
    });

    return NextResponse.json({ success: true, post: { id: post.id } });
  } catch (error: any) {
    console.error('Blog Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}