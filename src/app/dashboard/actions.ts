'use server';

import { getPocketBaseClient } from '@/lib/pocketbase';
import { revalidatePath } from 'next/cache';

export async function updateBusinessInfo(data: any) {
  try {
    const pb = await getPocketBaseClient();
    const records = await pb.collection('business_info').getFullList(1).catch(() => []);
    if (records.length > 0) {
      await pb.collection('business_info').update(records[0].id, data);
    } else {
      await pb.collection('business_info').create(data);
    }
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSeoSettings(data: any) {
  try {
    const pb = await getPocketBaseClient();
    const records = await pb.collection('seo_settings').getFullList(1).catch(() => []);
    if (records.length > 0) {
      await pb.collection('seo_settings').update(records[0].id, data);
    } else {
      await pb.collection('seo_settings').create(data);
    }
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSiteContent(page: string, copyData: any) {
  try {
    const pb = await getPocketBaseClient();
    const records = await pb.collection('site_content').getFullList({ filter: `page = "${page}"` }).catch(() => []);
    
    if (records.length > 0) {
      await pb.collection('site_content').update(records[0].id, { copy_data: copyData });
    } else {
      await pb.collection('site_content').create({ page, copy_data: copyData });
    }
    
    revalidatePath(`/${page === 'home' ? '' : page}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
