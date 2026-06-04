import type { BlogPostProps } from '@/types/template';
import { styles } from './theme';
import { BlockNoteRenderer } from '@/components/shared/BlockNoteRenderer';
import Link from 'next/link';
import { Calendar, User } from 'lucide-react';

export function BlogPostPage({ post, businessInfo, relatedPosts, config }: BlogPostProps) {
  return (
    <article className="bg-white">
      {/* Hero */}
      <div className="pt-16 pb-12 bg-slate-50 border-b border-slate-200">
        <div className={`${styles.container} max-w-4xl text-center`}>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500 mb-6 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>
                {post.author_type === 'auto' ? `Published by ${businessInfo.business_name}` : `By ${businessInfo.business_name}`}
              </span>
            </div>
          </div>
          
          <h1 className={`${styles.headingBase} text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-slate-900 leading-tight`}>
            {post.title}
          </h1>
        </div>
      </div>

      <div className={`${styles.container} max-w-4xl py-16`}>
        {post.cover_image_url && (
          <div className="rounded-3xl overflow-hidden mb-16 shadow-lg -mt-24 relative z-10 border-4 border-white">
            <img src={post.cover_image_url} alt={post.title} className="w-full h-auto aspect-video object-cover" />
          </div>
        )}

        <div className="prose prose-lg prose-slate max-w-none mx-auto">
          {post.content && <BlockNoteRenderer content={post.content} />}
        </div>
      </div>

      {/* CTA Footer */}
      <div className="bg-slate-900 text-center py-20 text-white mt-12">
        <div className={`${styles.container} max-w-3xl`}>
          <h2 className={`${styles.headingBase} text-3xl md:text-4xl font-bold mb-6 text-white`}>
            Need Professional Assistance?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Contact {businessInfo.business_name} today to speak with our experts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className={styles.buttonPrimary}>
              Contact Us Now
            </Link>
            {businessInfo.phone && (
              <a href={`tel:${businessInfo.phone}`} className={`${styles.buttonSecondary} bg-transparent text-white border-white hover:bg-white/10`}>
                Call {businessInfo.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-slate-50 py-20 border-t border-slate-200">
          <div className={styles.container}>
            <h3 className={`${styles.headingBase} text-3xl font-bold text-center mb-12`}>
              More from {businessInfo.business_name}
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map(related => (
                <Link key={related.id} href={`/blog/${related.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all">
                  {related.cover_image_url && (
                    <div className="aspect-[3/2] overflow-hidden">
                      <img src={related.cover_image_url} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <h4 className="font-bold text-lg mb-2 text-slate-900 group-hover:text-[#2D6A4F] transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                    <p className="text-slate-500 text-sm">
                      {new Date(related.published_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
