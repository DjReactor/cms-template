import BusinessInfoForm from './BusinessInfoForm';
import { getBusinessInfo } from '@/lib/settings';

export default async function BusinessInfoPage() {
  const data = await getBusinessInfo();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Business Information</h1>
        <p className="text-gray-500 mt-2">Manage your core business details that appear across the site.</p>
      </div>
      
      <BusinessInfoForm initialData={data} />
    </div>
  );
}