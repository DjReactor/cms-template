import { getSettings } from './actions';
import { SettingsForm } from './SettingsForm';

export default async function SettingsPage() {
  const settings = await getSettings();
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-slate-500 mt-2">Manage your notifications and account preferences.</p>
      </div>
      
      <SettingsForm initialData={settings} />
    </div>
  );
}