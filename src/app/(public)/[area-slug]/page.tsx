import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import { buildResolvedCopy, resolveTemplateTokens } from "@/lib/template";
import type { Service, ServiceArea, MediaItem } from "@/types";
import { notFound } from "next/navigation";

export default async function ServiceAreaPageWrapper({ params }: { params: Promise<{ 'area-slug': string }> }) {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  const pb = await getPocketBaseClient();
  
  let area: ServiceArea;
  let services: Service[] = [];
  let media: MediaItem[] = [];
  
  try {
    const resolvedParams = await params;
    const record = await pb.collection('service_areas').getFirstListItem<ServiceArea>(`slug="${resolvedParams['area-slug']}" && is_active=true`);
    area = record;
    services = await pb.collection('services').getFullList<Service>({ filter: 'is_active = true', sort: 'sort_order' });
    media = await pb.collection('media').getFullList<MediaItem>({ sort: 'sort_order' });
  } catch(e) {
    return notFound();
  }

  const template = await loadTemplate(settings.active_template);
  const copyOverrides = settings.template_config?.copyOverrides || {};

  // Build template-wide resolvedCopy from manifest + user overrides
  const resolvedCopy = buildResolvedCopy(template.manifest?.supportedCopyKeys, copyOverrides, businessInfo);

  // Area-specific h1/intro: use DB overrides if set, otherwise fall back to token-resolved defaults
  resolvedCopy.h1 = resolveTemplateTokens(
    area.custom_h1 || `{{business_type}} in ${area.name}`,
    businessInfo
  );
  resolvedCopy.intro = resolveTemplateTokens(
    area.custom_intro || `Professional {{business_type}} services serving ${area.name} and surrounding areas.`,
    businessInfo
  );

  const ServiceAreaPageComponent = template.ServiceAreaPage;

  return (
    <ServiceAreaPageComponent
      area={area}
      businessInfo={businessInfo}
      services={services}
      media={media}
      resolvedCopy={resolvedCopy}
      config={settings.template_config || {}}
    />
  );
}