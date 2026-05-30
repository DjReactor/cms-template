import { NextResponse } from 'next/server';
import { getPocketBaseClient } from '@/lib/pocketbase';

export async function GET(req: Request) {
  // Allow super admin dashboard to ping health without auth, but maybe check a secret if needed
  // For now, simple health ping
  
  try {
    const pb = await getPocketBaseClient();
    // Verify DB connection
    await pb.collection('settings').getFirstListItem('');
    
    return NextResponse.json({
      status: 'healthy',
      version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'degraded',
      version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
