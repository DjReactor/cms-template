import { MetadataRoute } from 'next';
import { getPocketBaseClient } from '@/lib/pocketbase';
import type { Service, ServiceArea, BlogPost } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pb = await getPocketBaseClient();
  const domain = process.env.SITE_URL || 'http://localhost:3000';

  const [services, areas, posts] = await Promise.all([
    pb.collection('services').getFullList<Service>({ filter: 'active = true' }).catch(() => []),
    pb.collection('service_areas').getFullList<ServiceArea>().catch(() => []),
    pb.collection('blog_posts').getFullList<BlogPost>({ filter: 'status = "published"' }).catch(() => []),
  ]);

  const routes = ['', '/about', '/contact', '/services', '/blog'].map((route) => ({
    url: `${domain}${route}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${domain}/services/${s.slug}`,
    lastModified: new Date(),
  }));

  const areaRoutes = areas.map((a) => ({
    url: `${domain}/${a.slug}`,
    lastModified: new Date(),
  }));

  const postRoutes = posts.map((p) => ({
    url: `${domain}/blog/${p.slug}`,
    lastModified: new Date(p.published_at || new Date()),
  }));

  return [...routes, ...serviceRoutes, ...areaRoutes, ...postRoutes];
}
