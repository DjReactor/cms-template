import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import type { Service, ServiceArea } from "@/types";
import { notFound } from "next/navigation";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo) return null;

  const pb = await getPocketBaseClient();
  const serviceList = await pb.collection('services').getFullList<Service>({ filter: `slug = "${resolvedParams.slug}"` }).catch(() => []);
  if (serviceList.length === 0) return notFound();
  
  const serviceAreas = await pb.collection('service_areas').getFullList<ServiceArea>({ sort: 'name' }).catch(() => []);

  const template = await loadTemplate(settings.active_template);
  const Component = template.ServiceDetailPage;

  return <Component businessInfo={businessInfo} service={serviceList[0]} serviceAreas={serviceAreas} config={settings.template_config || {}} />;
}