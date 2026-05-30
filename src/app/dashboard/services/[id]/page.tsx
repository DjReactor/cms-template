import { getService } from '../actions';
import ServiceDetailForm from './ServiceDetailForm';
import { notFound } from 'next/navigation';

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const service = await getService(id);
  
  if (!service) {
    notFound();
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Service</h1>
        <p className="text-slate-500 mt-2">Update the content and SEO details for {service.name}.</p>
      </div>
      
      <ServiceDetailForm initialData={service} />
    </div>
  );
}
