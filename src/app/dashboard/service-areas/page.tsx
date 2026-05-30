import { getServiceAreas } from './actions';
import ServiceAreasList from './ServiceAreasList';

export default async function ServiceAreasPage() {
  const areas = await getServiceAreas();
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Service Areas</h1>
        <p className="text-slate-500 mt-2">Manage the cities and neighborhoods you serve. Drag to reorder.</p>
      </div>
      
      <ServiceAreasList initialAreas={areas} />
    </div>
  );
}