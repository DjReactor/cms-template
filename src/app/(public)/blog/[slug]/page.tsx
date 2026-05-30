import { loadTemplate } from "@/lib/template-loader";
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
  const postList = await pb.collection('blog_posts').getFullList<BlogPost>({ filter: `slug = "${resolvedParams.slug}"` }).catch(() => []);
  if (postList.length === 0) return notFound();

  const recentPosts = await pb.collection('blog_posts').getList<BlogPost>(1, 3, { filter: `id != "${postList[0].id}" && status = "published"`, sort: '-published_at' }).then(r => r.items).catch(() => []);

  const template = await loadTemplate(settings.active_template);
  const Component = template.BlogPostPage;

  return <Component businessInfo={businessInfo} post={postList[0]} recentPosts={recentPosts} config={settings.template_config || {}} />;
}