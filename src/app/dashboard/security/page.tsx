import { requireAuth } from '@/lib/auth';
import { getApiKeys } from './actions';
import { SecurityClient } from './SecurityClient';

export const dynamic = 'force-dynamic';

export default async function SecurityPage() {
  const user = await requireAuth();
  
  let apiKeys: any[] = [];
  if (user.role === 'agency_admin') {
    apiKeys = await getApiKeys();
  }

  return (
    <div className="max-w-4xl">
      <SecurityClient userRole={user.role} apiKeys={apiKeys} />
    </div>
  );
}
