import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import type { BlogPost } from "@/types";
import { notFound } from "next/navigation";

export default async function BlogIndexPageWrapper({ searchParams }: { searchParams: { page?: string } }) {
  const settings = await getSettings();
  if (!settings.blog_enabled) return notFound();

  const businessInfo = await getBusinessInfo();
  const pb = await getPocketBaseClient();
  
  const page = parseInt(searchParams.page || '1');
  const perPage = 12;
  
  let posts: BlogPost[] = [];
  let totalPages = 1;
  
  try {
    const result = await pb.collection('blog_posts').getList<BlogPost>(page, perPage, { 
      filter: 'status = "published"',
      sort: '-published_at'
    });
    posts = result.items;
    totalPages = result.totalPages;
  } catch(e) {}

  const template = await loadTemplate(settings.active_template);
  const BlogIndexPageComponent = template.BlogIndexPage;

  return (
    <BlogIndexPageComponent
      posts={posts}
      businessInfo={businessInfo}
      currentPage={page}
      totalPages={totalPages}
      config={settings.template_config || {}}
    />
  );
}