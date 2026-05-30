'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SEOLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const tabs = [
    { name: 'Overview', href: '/dashboard/seo' },
    { name: 'Settings', href: '/dashboard/seo/settings' },
    { name: 'Redirects', href: '/dashboard/seo/redirects' },
    { name: '404 Logs', href: '/dashboard/seo/404s' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">SEO & Visibility</h1>
        <p className="text-slate-500 mt-2">Manage your search engine presence, metadata, and track broken links.</p>
      </div>
      
      <div className="flex space-x-1 border-b border-slate-200">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                isActive 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
      
      <div>{children}</div>
    </div>
  );
}
