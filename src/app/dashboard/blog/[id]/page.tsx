import { getBlogPost } from '../actions';
import BlogDetailForm from './BlogDetailForm';
import { notFound } from 'next/navigation';

export default async function BlogPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let post;
  if (id === 'new') {
    post = { id: 'new' };
  } else {
    post = await getBlogPost(id);
    if (!post) {
      notFound();
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {id === 'new' ? 'Create Blog Post' : 'Edit Blog Post'}
        </h1>
        <p className="text-slate-500 mt-2">Write your content, configure SEO, and publish.</p>
      </div>
      
      <BlogDetailForm initialData={post} />
    </div>
  );
}
