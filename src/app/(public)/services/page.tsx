import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import { resolveCopyObject } from "@/lib/template";
import type { Service } from "@/types";

export default async function ServicesIndexPageWrapper() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  const pb = await getPocketBaseClient();
  
  let services: Service[] = [];
  try {
    services = await pb.collection('services').getFullList<Service>({ filter: 'is_active = true', sort: 'sort_order' });
  } catch(e) {}

  const resolvedCopy = resolveCopyObject({
    heading: `Our {{business_type}} Services`,
    intro: `Professional and reliable solutions for your needs.`,
  }, businessInfo);

  const template = await loadTemplate(settings.active_template);
  const ServicesIndexPageComponent = template.ServicesIndexPage;

  return (
    <ServicesIndexPageComponent
      services={services}
      businessInfo={businessInfo}
      resolvedCopy={resolvedCopy}
      config={settings.template_config || {}}
    />
  );
}