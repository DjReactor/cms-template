import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import { resolveCopyObject } from "@/lib/template";
import type { ServiceArea } from "@/types";

export default async function AboutPageWrapper() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  const pb = await getPocketBaseClient();
  
  let serviceAreas: ServiceArea[] = [];
  try {
    serviceAreas = await pb.collection('service_areas').getFullList<ServiceArea>({ filter: 'is_active = true', sort: 'sort_order' });
  } catch(e) {}

  const resolvedCopy = resolveCopyObject({
    heading: `About {{business_name}}`,
  }, businessInfo);

  const template = await loadTemplate(settings.active_template);
  const AboutPageComponent = template.AboutPage;

  return (
    <AboutPageComponent
      businessInfo={businessInfo}
      serviceAreas={serviceAreas}
      resolvedCopy={resolvedCopy}
      config={settings.template_config || {}}
    />
  );
}
