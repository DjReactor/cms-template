import { getServices } from './actions';
import ServicesList from './ServicesList';

export default async function ServicesPage() {
  const services = await getServices();
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Services</h1>
        <p className="text-slate-500 mt-2">Manage the services you provide. Drag to reorder how they appear on the site.</p>
      </div>
      
      <ServicesList initialServices={services} />
    </div>
  );
}