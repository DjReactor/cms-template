import { cookies } from 'next/headers';
import { getPocketBaseClient } from './pocketbase';

export async function verifySession() {
  const pb = await getPocketBaseClient();
  return pb.authStore.isValid && pb.authStore.model ? pb.authStore.model : null;
}

export async function requireAuth() {
  const user = await verifySession();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAgencyAdmin() {
  const user = await verifySession();
  if (!user || user.role !== 'agency_admin') {
    throw new Error('Forbidden: Requires Agency Admin');
  }
  return user;
}
