import type { BlogIndexProps } from '@/types/template';
import Link from 'next/link';
import { styles } from './theme';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export function BlogIndexPage({ posts, businessInfo, currentPage, totalPages, config }: BlogIndexProps) {
  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className={styles.container}>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className={`${styles.headingBase} text-4xl md:text-5xl font-bold mb-6`}>
            {businessInfo.business_name} Blog
          </h1>
          <p className="text-xl text-slate-600">
            Insights, tips, and news from our team of experts.
          </p>
        </div>

        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {posts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow">
                  {post.cover_image_url ? (
                    <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                      <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-slate-100 flex items-center justify-center">
                      <span className="text-slate-400">No Image</span>
                    </div>
                  )}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.published_at}>
                        {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </time>
                    </div>
                    <h2 className={`${styles.headingBase} text-2xl font-bold mb-4 group-hover:text-[#2D6A4F] transition-colors line-clamp-2`}>
                      {post.title}
                    </h2>
                    <p className="text-slate-600 mb-6 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <span className="font-semibold text-[#2D6A4F] inline-flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                      Read article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                {currentPage > 1 ? (
                  <a href={`/blog?page=${currentPage - 1}`} className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </a>
                ) : (
                  <span className="p-2 rounded-full border border-slate-100 text-slate-300">
                    <ChevronLeft className="w-6 h-6" />
                  </span>
                )}
                
                <span className="font-medium text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                {currentPage < totalPages ? (
                  <a href={`/blog?page=${currentPage + 1}`} className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </a>
                ) : (
                  <span className="p-2 rounded-full border border-slate-100 text-slate-300">
                    <ChevronRight className="w-6 h-6" />
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 text-lg">No posts published yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
