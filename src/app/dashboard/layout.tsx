import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth().catch(() => null);
  // if (!user) redirect('/login');

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 font-bold text-xl border-b">Dashboard</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">Overview</Link>
          <Link href="/dashboard/business-info" className="block px-3 py-2 rounded hover:bg-gray-100">Business Info</Link>
          <Link href="/dashboard/services" className="block px-3 py-2 rounded hover:bg-gray-100">Services</Link>
          <Link href="/dashboard/service-areas" className="block px-3 py-2 rounded hover:bg-gray-100">Service Areas</Link>
          <Link href="/dashboard/content" className="block px-3 py-2 rounded hover:bg-gray-100">Site Content</Link>
          <Link href="/dashboard/seo" className="block px-3 py-2 rounded hover:bg-gray-100">SEO Settings</Link>
          <Link href="/dashboard/settings" className="block px-3 py-2 rounded hover:bg-gray-100">Platform Settings</Link>
        </nav>
        <div className="p-4 border-t">
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="w-full text-left px-3 py-2 text-red-600 rounded hover:bg-gray-100">Log Out</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}