import { getSeoSettings } from '../actions';
import { SeoSettingsForm } from './SeoSettingsForm';

export default async function SeoSettingsPage() {
  const settings = await getSeoSettings();
  
  return (
    <div className="space-y-6">
      <SeoSettingsForm initialData={settings} />
    </div>
  );
}
