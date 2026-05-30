import { loadTemplate } from "@/lib/template-loader";
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
}