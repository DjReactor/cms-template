import { getRedirects } from '../actions';
import { RedirectsTable } from './RedirectsTable';

export default async function RedirectsPage() {
  const redirects = await getRedirects();
  
  return (
    <div className="space-y-6">
      <RedirectsTable initialData={redirects} />
    </div>
  );
}
