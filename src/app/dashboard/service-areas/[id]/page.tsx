import { getServiceArea } from '../actions';
import ServiceAreaDetailForm from './ServiceAreaDetailForm';
import { notFound } from 'next/navigation';

export default async function ServiceAreaDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const area = await getServiceArea(id);
  
  if (!area) {
    notFound();
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Service Area</h1>
        <p className="text-slate-500 mt-2">Update the content and SEO details for {area.name}.</p>
      </div>
      
      <ServiceAreaDetailForm initialData={area} />
    </div>
  );
}
