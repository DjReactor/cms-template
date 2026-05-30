import { getBlogPosts } from './actions';
import { BlogList } from './BlogList';

export default async function BlogPage() {
  const posts = await getBlogPosts();
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Blog</h1>
        <p className="text-slate-500 mt-2">Manage your articles, news, and SEO content.</p>
      </div>
      
      <BlogList initialPosts={posts} />
    </div>
  );
}
