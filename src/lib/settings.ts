import { getPocketBaseClient } from './pocketbase';
import type { Settings, SeoSettings, BusinessInfo } from '@/types';
import { cache } from 'react';

export const getSettings = cache(async (): Promise<Settings | null> => {
  try {
    const pb = await getPocketBaseClient();
    const records = await pb.collection('settings').getFullList<Settings>(1);
    if (records[0]) return records[0];
  } catch (e) {
    // Return mock settings for local preview when DB is off
    return {
      id: 'mock',
      active_template: 'home-services-base',
      template_config: {},
      created: '',
      updated: '',
      collectionId: '',
      collectionName: ''
    } as Settings;
  }
  return null;
});

export const getSeoSettings = cache(async (): Promise<SeoSettings | null> => {
  try {
    const pb = await getPocketBaseClient();
    const records = await pb.collection('seo_settings').getFullList<SeoSettings>(1);
    if (records[0]) return records[0];
  } catch (e) {
    return null;
  }
  return null;
});

export const getBusinessInfo = cache(async (): Promise<BusinessInfo | null> => {
  try {
    const pb = await getPocketBaseClient();
    const records = await pb.collection('business_info').getFullList<BusinessInfo>(1);
    if (records[0]) return records[0];
  } catch (e) {
    // Return mock info for local preview when DB is off
    return {
      id: 'mock',
      name: 'Preview Business Inc.',
      phone: '(555) 123-4567',
      email: 'contact@example.com',
      address: '123 Preview St, City, ST 12345',
      created: '',
      updated: '',
      collectionId: '',
      collectionName: ''
    } as BusinessInfo;
  }
  return null;
});
