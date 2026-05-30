import { NextResponse } from 'next/server';
import { getAdminPocketBase } from '@/lib/pocketbase-admin';

export async function POST(request: Request) {
  const payload = await request.json();
  const pb = await getAdminPocketBase();

  try {
    // Stub: create call log in PB
    if (payload.call) {
      await pb.collection('ai_call_logs').create({
        call_id: payload.call.call_id,
        caller_number: payload.call.from_number,
        transcript: payload.call.transcript,
        summary: payload.call.call_analysis?.call_summary,
        duration: payload.call.duration_ms,
        sentiment: payload.call.call_analysis?.user_sentiment
      });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}