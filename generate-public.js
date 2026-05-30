const fs = require('fs');
const path = require('path');

const baseDir = 'src/app/(public)';

const pages = {
  'contact/page.tsx': `import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import { getResolvedCopy } from "@/lib/template";

export default async function ContactPage() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo) return null;

  const pb = await getPocketBaseClient();
  const siteContentList = await pb.collection('site_content').getFullList({ filter: 'page = "contact"' }).catch(() => []);
  const resolvedCopy = getResolvedCopy('contact', siteContentList[0]?.copy_data || {}, businessInfo);

  const template = await loadTemplate(settings.active_template);
  const Component = template.ContactPage;

  return <Component businessInfo={businessInfo} resolvedCopy={resolvedCopy} config={settings.template_config || {}} />;
}`,

  'services/page.tsx': `import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import { getResolvedCopy } from "@/lib/template";
import type { Service } from "@/types";

export default async function ServicesIndexPage() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo) return null;

  const pb = await getPocketBaseClient();
  const [services, siteContentList] = await Promise.all([
    pb.collection('services').getFullList<Service>({ filter: 'active = true', sort: 'order' }).catch(() => []),
    pb.collection('site_content').getFullList({ filter: 'page = "services_index"' }).catch(() => [])
  ]);

  const resolvedCopy = getResolvedCopy('services_index', siteContentList[0]?.copy_data || {}, businessInfo);

  const template = await loadTemplate(settings.active_template);
  const Component = template.ServicesIndexPage;

  return <Component businessInfo={businessInfo} resolvedCopy={resolvedCopy} services={services} config={settings.template_config || {}} />;
}`,

  'services/[slug]/page.tsx': `import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import type { Service, ServiceArea } from "@/types";
import { notFound } from "next/navigation";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo) return null;

  const pb = await getPocketBaseClient();
  const serviceList = await pb.collection('services').getFullList<Service>({ filter: \`slug = "\${resolvedParams.slug}"\` }).catch(() => []);
  if (serviceList.length === 0) return notFound();
  
  const serviceAreas = await pb.collection('service_areas').getFullList<ServiceArea>({ sort: 'name' }).catch(() => []);

  const template = await loadTemplate(settings.active_template);
  const Component = template.ServiceDetailPage;

  return <Component businessInfo={businessInfo} service={serviceList[0]} serviceAreas={serviceAreas} config={settings.template_config || {}} />;
}`,

  '[area-slug]/page.tsx': `import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import type { Service, ServiceArea } from "@/types";
import { notFound } from "next/navigation";

// Exclude standard routes
const reserved = ['about', 'contact', 'services', 'blog', 'privacy-policy', 'terms-of-service', 'login'];

export default async function ServiceAreaPage({ params }: { params: Promise<{ 'area-slug': string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams['area-slug'];
  if (reserved.includes(slug)) return notFound();

  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo) return null;

  const pb = await getPocketBaseClient();
  const areaList = await pb.collection('service_areas').getFullList<ServiceArea>({ filter: \`slug = "\${slug}"\` }).catch(() => []);
  if (areaList.length === 0) return notFound();
  
  const services = await pb.collection('services').getFullList<Service>({ filter: 'active = true', sort: 'order' }).catch(() => []);

  const template = await loadTemplate(settings.active_template);
  const Component = template.ServiceAreaPage;

  return <Component businessInfo={businessInfo} area={areaList[0]} services={services} config={settings.template_config || {}} />;
}`,

  'blog/page.tsx': `import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import { getResolvedCopy } from "@/lib/template";
import type { BlogPost } from "@/types";
import { notFound } from "next/navigation";

export default async function BlogIndexPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo || !settings.blog_enabled) return notFound();

  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const pb = await getPocketBaseClient();
  const result = await pb.collection('blog_posts').getList<BlogPost>(page, 10, { filter: 'status = "published"', sort: '-published_at' }).catch(() => null);
  
  const siteContentList = await pb.collection('site_content').getFullList({ filter: 'page = "blog_index"' }).catch(() => []);
  const resolvedCopy = getResolvedCopy('blog_index', siteContentList[0]?.copy_data || {}, businessInfo);

  const template = await loadTemplate(settings.active_template);
  const Component = template.BlogIndexPage;

  return <Component 
    businessInfo={businessInfo} 
    resolvedCopy={resolvedCopy} 
    posts={result?.items || []} 
    pagination={{ currentPage: page, totalPages: result?.totalPages || 1, hasNext: page < (result?.totalPages || 1), hasPrev: page > 1 }}
    config={settings.template_config || {}} 
  />;
}`,

  'blog/[slug]/page.tsx': `import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import type { BlogPost } from "@/types";
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo || !settings.blog_enabled) return notFound();

  const pb = await getPocketBaseClient();
  const postList = await pb.collection('blog_posts').getFullList<BlogPost>({ filter: \`slug = "\${resolvedParams.slug}"\` }).catch(() => []);
  if (postList.length === 0) return notFound();

  const recentPosts = await pb.collection('blog_posts').getList<BlogPost>(1, 3, { filter: \`id != "\${postList[0].id}" && status = "published"\`, sort: '-published_at' }).then(r => r.items).catch(() => []);

  const template = await loadTemplate(settings.active_template);
  const Component = template.BlogPostPage;

  return <Component businessInfo={businessInfo} post={postList[0]} recentPosts={recentPosts} config={settings.template_config || {}} />;
}`,

  'privacy-policy/page.tsx': `import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";

export default async function PrivacyPage() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo) return null;

  const template = await loadTemplate(settings.active_template);
  const Component = template.PrivacyPage;

  return <Component businessInfo={businessInfo} content="<p>Privacy Policy Placeholder</p>" config={settings.template_config || {}} />;
}`,

  'terms-of-service/page.tsx': `import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";

export default async function TermsPage() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo) return null;

  const template = await loadTemplate(settings.active_template);
  const Component = template.TermsPage;

  return <Component businessInfo={businessInfo} content="<p>Terms of Service Placeholder</p>" config={settings.template_config || {}} />;
}`
};

for (const [route, code] of Object.entries(pages)) {
  const fullPath = path.join(baseDir, route);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, code);
}
console.log('Public pages generated.');
