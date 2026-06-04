import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import type { BlogPost } from "@/types";
import { notFound } from "next/navigation";

export default async function BlogPostPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const settings = await getSettings();
  if (!settings.blog_enabled) return notFound();

  const businessInfo = await getBusinessInfo();
  const pb = await getPocketBaseClient();
  
  let post: BlogPost;
  let relatedPosts: BlogPost[] = [];
  
  try {
    const resolvedParams = await params;
    const record = await pb.collection('blog_posts').getFirstListItem<BlogPost>(`slug="${resolvedParams.slug}" && status="published"`);
    post = record;
    
    // Get latest 3 posts excluding current
    const related = await pb.collection('blog_posts').getList<BlogPost>(1, 3, {
      filter: `status="published" && id != "${post.id}"`,
      sort: '-published_at'
    });
    relatedPosts = related.items;
  } catch(e) {
    return notFound();
  }

  const template = await loadTemplate(settings.active_template);
  const BlogPostPageComponent = template.BlogPostPage;

  return (
    <BlogPostPageComponent
      post={post}
      businessInfo={businessInfo}
      relatedPosts={relatedPosts}
      config={settings.template_config || {}}
    />
  );
}