'use server';

import { getPocketBaseClient } from '@/lib/pocketbase';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getContacts() {
  const pb = await getPocketBaseClient();
  return pb.collection('contacts').getFullList({
    sort: '-created',
  }).catch(() => []);
}

export async function updateContactStatus(id: string, status: string) {
  try {
    await requireAuth();
    const pb = await getPocketBaseClient();
    await pb.collection('contacts').update(id, { status });
    revalidatePath('/dashboard/crm');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateContactNotes(id: string, notes: string) {
  try {
    await requireAuth();
    const pb = await getPocketBaseClient();
    await pb.collection('contacts').update(id, { notes });
    revalidatePath('/dashboard/crm');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteContact(id: string) {
  try {
    await requireAuth();
    const pb = await getPocketBaseClient();
    await pb.collection('contacts').delete(id);
    revalidatePath('/dashboard/crm');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
