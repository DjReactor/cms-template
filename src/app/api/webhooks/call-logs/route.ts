import { NextResponse } from 'next/server';
import { getPocketBaseClient } from '@/lib/pocketbase';
import { authenticateWebhook } from '@/lib/webhook-auth';

export async function POST(req: Request) {
  const secret = process.env.RETELL_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const payload = await req.text();

  if (!(await authenticateWebhook(req, payload, secret))) {
    return NextResponse.json({ error: 'Unauthorized: Invalid signature or missing API key' }, { status: 401 });
  }

  try {
    const data = JSON.parse(payload);
    
    // Retell AI typical payload structure
    const callData = data.call || data;
    
    if (!callData.call_id) {
      return NextResponse.json({ error: 'Missing call_id' }, { status: 400 });
    }

    const pb = await getPocketBaseClient();
    
    const log = await pb.collection('call_logs').create({
      call_id: callData.call_id,
      caller_number: callData.from_number || 'Unknown',
      duration_seconds: callData.duration_ms ? Math.floor(callData.duration_ms / 1000) : 0,
      transcript: callData.transcript || '',
      summary: callData.call_summary || '',
      recording_url: callData.recording_url || '',
      status: callData.call_status || 'completed',
    });

    // Extract lead if possible
    if (callData.from_number) {
      try {
        await pb.collection('leads').create({
          name: 'Caller ' + callData.from_number,
          phone: callData.from_number,
          source: 'AI Voice Agent',
          status: 'new',
          notes: callData.call_summary || '',
        });
      } catch (e) {
        // Lead might already exist or error out, ignore
      }
    }

    return NextResponse.json({ success: true, log_id: log.id });
  } catch (error: any) {
    console.error('Call Log Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
