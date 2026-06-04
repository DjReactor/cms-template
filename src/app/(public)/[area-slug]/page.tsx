import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import { resolveCopyObject } from "@/lib/template";
import type { Service, ServiceArea } from "@/types";
import { notFound } from "next/navigation";

export default async function ServiceAreaPageWrapper({ params }: { params: Promise<{ 'area-slug': string }> }) {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  const pb = await getPocketBaseClient();
  
  let area: ServiceArea;
  let services: Service[] = [];
  
  try {
    const resolvedParams = await params;
    const record = await pb.collection('service_areas').getFirstListItem<ServiceArea>(`slug="${resolvedParams['area-slug']}" && is_active=true`);
    area = record;
    services = await pb.collection('services').getFullList<Service>({ filter: 'is_active = true', sort: 'sort_order' });
  } catch(e) {
    return notFound();
  }

  const resolvedCopy = resolveCopyObject({
    h1: area.custom_h1 || `{{business_type}} in ${area.name}`,
    intro: area.custom_intro || `Professional {{business_type}} services serving ${area.name} and surrounding areas.`,
  }, businessInfo);

  const template = await loadTemplate(settings.active_template);
  const ServiceAreaPageComponent = template.ServiceAreaPage;

  return (
    <ServiceAreaPageComponent
      area={area}
      businessInfo={businessInfo}
      services={services}
      resolvedCopy={resolvedCopy}
      config={settings.template_config || {}}
    />
  );
}