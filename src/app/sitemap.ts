import { MetadataRoute } from 'next';
import { getPocketBaseClient } from '@/lib/pocketbase';
import type { Service, ServiceArea, BlogPost } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pb = await getPocketBaseClient();
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }
  ];

  try {
    const services = await pb.collection('services').getFullList<Service>({ filter: 'is_active = true' });
    services.forEach(service => {
      routes.push({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });

    const areas = await pb.collection('service_areas').getFullList<ServiceArea>({ filter: 'is_active = true' });
    areas.forEach(area => {
      routes.push({
        url: `${baseUrl}/${area.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    // Only add blog if enabled
    const settings = await pb.collection('settings').getFirstListItem('');
    if (settings.blog_enabled) {
      routes.push({
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
      
      const posts = await pb.collection('blog_posts').getFullList<BlogPost>({ filter: 'status = "published"' });
      posts.forEach(post => {
        routes.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.published_at),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      });
    }

  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return routes;
}
