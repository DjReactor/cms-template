import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import type { ServiceArea } from "@/types";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  
  if (!settings || !businessInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Configuration Missing</h1>
          <p>Please complete the PocketBase seed data step.</p>
        </div>
      </div>
    );
  }

  const pb = await getPocketBaseClient();
  let serviceAreas: ServiceArea[] = [];
  try {
    serviceAreas = await pb.collection('service_areas').getFullList<ServiceArea>({ sort: 'name' });
  } catch(e) {
    console.error('Failed to load service areas', e);
  }

  const template = await loadTemplate(settings.active_template);
  const LayoutComponent = template.Layout;

  return (
    <LayoutComponent
      businessInfo={businessInfo}
      serviceAreas={serviceAreas}
      settings={settings}
      config={settings.template_config || {}}
    >
      {children}
    </LayoutComponent>
  );
}
