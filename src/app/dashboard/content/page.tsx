import ContentForm from './ContentForm';
import { getPocketBaseClient } from '@/lib/pocketbase';

export default async function ContentPage() {
  const pb = await getPocketBaseClient();
  const content = await pb.collection('site_content').getFullList({ filter: 'page="home"' }).catch(() => []);
  const initialData = content[0]?.copy_data || {};

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Site Content</h1>
        <p className="text-gray-500 mt-2">Override specific text blocks on your site. If left blank, the template defaults will be used.</p>
      </div>
      
      <ContentForm initialData={initialData} />
    </div>
  );
}