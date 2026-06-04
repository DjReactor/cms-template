import { getSettings } from '@/lib/settings';
import { getTemplates } from './actions';
import { DesignClient } from './DesignClient';

export const metadata = {
  title: 'Design | Dashboard',
};

export default async function DesignPage() {
  const [settings, templates] = await Promise.all([getSettings(), getTemplates()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Design</h1>
        <p className="text-slate-500 mt-2">
          Choose a template for your website. Changes go live immediately after activation.
        </p>
      </div>

      <DesignClient
        templates={templates}
        activeTemplateId={settings.active_template}
      />
    </div>
  );
}
