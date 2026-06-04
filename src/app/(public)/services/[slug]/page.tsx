import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import type { Service, ServiceArea, BeforeAfterPair } from "@/types";
import { notFound } from "next/navigation";

export default async function ServiceDetailPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  const pb = await getPocketBaseClient();
  
  let service: Service;
  let serviceAreas: ServiceArea[] = [];
  let beforeAfterPairs: BeforeAfterPair[] = [];
  
  try {
    const resolvedParams = await params;
    const record = await pb.collection('services').getFirstListItem<Service>(`slug="${resolvedParams.slug}" && is_active=true`);
    service = record;
    serviceAreas = await pb.collection('service_areas').getFullList<ServiceArea>({ filter: 'is_active = true', sort: 'sort_order' });
    beforeAfterPairs = await pb.collection('before_after_pairs').getFullList<BeforeAfterPair>({ filter: 'is_active = true', sort: 'sort_order' });
  } catch(e) {
    return notFound();
  }

  const template = await loadTemplate(settings.active_template);
  const ServiceDetailPageComponent = template.ServiceDetailPage;

  return (
    <ServiceDetailPageComponent
      service={service}
      businessInfo={businessInfo}
      serviceAreas={serviceAreas}
      beforeAfterPairs={beforeAfterPairs}
      config={settings.template_config || {}}
    />
  );
}