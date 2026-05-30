import { MetadataRoute } from 'next';
import { getSeoSettings } from '@/lib/settings';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  const seoSettings = await getSeoSettings();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/login', '/api/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
