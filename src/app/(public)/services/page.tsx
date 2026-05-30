import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import { getResolvedCopy } from "@/lib/template";
import type { Service } from "@/types";

export default async function ServicesIndexPage() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo) return null;

  const pb = await getPocketBaseClient();
  const [services, siteContentList] = await Promise.all([
    pb.collection('services').getFullList<Service>({ filter: 'active = true', sort: 'order' }).catch(() => []),
    pb.collection('site_content').getFullList({ filter: 'page = "services_index"' }).catch(() => [])
  ]);

  const resolvedCopy = getResolvedCopy('services_index', siteContentList[0]?.copy_data || {}, businessInfo);

  const template = await loadTemplate(settings.active_template);
  const Component = template.ServicesIndexPage;

  return <Component businessInfo={businessInfo} resolvedCopy={resolvedCopy} services={services} config={settings.template_config || {}} />;
}