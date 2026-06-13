'use server';

import { getPocketBaseClient } from '@/lib/pocketbase';

export async function getCallLogs() {
  const pb = await getPocketBaseClient();
  return pb.collection('ai_call_logs').getFullList({
    sort: '-id',
  }).catch(() => []);
}
