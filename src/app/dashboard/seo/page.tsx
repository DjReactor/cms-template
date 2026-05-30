import SeoForm from './SeoForm';
import { getSeoSettings } from '@/lib/settings';

export default async function SeoPage() {
  const data = await getSeoSettings();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">SEO Settings</h1>
        <p className="text-gray-500 mt-2">Manage technical SEO configurations and structured data.</p>
      </div>
      
      <SeoForm initialData={data} />
    </div>
  );
}