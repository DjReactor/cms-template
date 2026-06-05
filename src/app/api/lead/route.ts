import { NextResponse } from 'next/server';
import { getAdminPocketBase } from '@/lib/pocketbase-admin';
import { getSettings } from '@/lib/settings';

export async function POST(request: Request) {
  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const {
    name, email, phone, message, source,
    address_street, address_city, address_state, address_zip, address_full,
  } = payload;

  // --- Validate required fields ---
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }
  if (!email?.trim()) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }
  if (!phone?.trim()) {
    return NextResponse.json({ error: 'Phone is required.' }, { status: 400 });
  }

  const pb = await getAdminPocketBase();

  // --- Save to PocketBase ---
  let lead: any;
  try {
    lead = await pb.collection('contacts').create({
      name:           name.trim(),
      email:          email.trim(),
      phone:          phone.trim(),
      message:        message?.trim()        || '',
      address_street: address_street?.trim() || '',
      address_city:   address_city?.trim()   || '',
      address_state:  address_state?.trim()  || '',
      address_zip:    address_zip?.trim()    || '',
      address_full:   address_full?.trim()   || '',
      source:         source                 || 'website',
      status:         'new',
    });
  } catch (err) {
    console.error('[/api/lead] Failed to save contact:', err);
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 });
  }

  // --- Fire webhook (non-blocking — never fail the user request) ---
  fireWebhook(lead).catch((err) =>
    console.error('[/api/lead] Webhook dispatch failed:', err)
  );

  return NextResponse.json({ success: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook dispatcher — fires and forgets
// ─────────────────────────────────────────────────────────────────────────────
async function fireWebhook(lead: any): Promise<void> {
  const settings = await getSettings();
  const webhookUrl = (settings as any).lead_webhook_url;
  if (!webhookUrl) return;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const secret = (settings as any).lead_webhook_secret;
  if (secret) {
    headers['Authorization'] = `Bearer ${secret}`;
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      event: 'lead.created',
      lead: {
        id:             lead.id,
        name:           lead.name,
        email:          lead.email,
        phone:          lead.phone,
        message:        lead.message,
        address_street: lead.address_street,
        address_city:   lead.address_city,
        address_state:  lead.address_state,
        address_zip:    lead.address_zip,
        address_full:   lead.address_full,
        source:         lead.source,
        status:         lead.status,
        created:        lead.created,
      },
    }),
  });

  if (!res.ok) {
    console.warn(`[fireWebhook] Webhook returned ${res.status} from ${webhookUrl}`);
  }
}
