import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import type { Service, ServiceArea } from "@/types";
import { notFound } from "next/navigation";

// Exclude standard routes
const reserved = ['about', 'contact', 'services', 'blog', 'privacy-policy', 'terms-of-service', 'login'];

export default async function ServiceAreaPage({ params }: { params: Promise<{ 'area-slug': string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams['area-slug'];
  if (reserved.includes(slug)) return notFound();

  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo) return null;

  const pb = await getPocketBaseClient();
  const areaList = await pb.collection('service_areas').getFullList<ServiceArea>({ filter: `slug = "${slug}"` }).catch(() => []);
  if (areaList.length === 0) return notFound();
  
  const services = await pb.collection('services').getFullList<Service>({ filter: 'active = true', sort: 'order' }).catch(() => []);

  const template = await loadTemplate(settings.active_template);
  const Component = template.ServiceAreaPage;

  return <Component businessInfo={businessInfo} area={areaList[0]} services={services} config={settings.template_config || {}} />;
}