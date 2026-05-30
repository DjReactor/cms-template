import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import { getResolvedCopy } from "@/lib/template";
import type { Service, ServiceArea, Testimonial, SiteContent } from "@/types";

export default async function HomePage() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  
  if (!settings || !businessInfo) return null;

  const pb = await getPocketBaseClient();
  
  const [services, serviceAreas, testimonials, siteContentList] = await Promise.all([
    pb.collection('services').getFullList<Service>({ filter: 'active = true', sort: 'order' }).catch(() => []),
    pb.collection('service_areas').getFullList<ServiceArea>({ sort: 'name' }).catch(() => []),
    pb.collection('testimonials').getFullList<Testimonial>({ filter: 'visible = true', sort: 'order' }).catch(() => []),
    pb.collection('site_content').getFullList<SiteContent>({ filter: 'page = "home"' }).catch(() => [])
  ]);

  const siteContent = siteContentList[0]?.copy_data || {};
  const resolvedCopy = getResolvedCopy('home', siteContent, businessInfo);

  const template = await loadTemplate(settings.active_template);
  const HomePageComponent = template.HomePage;

  return (
    <HomePageComponent
      businessInfo={businessInfo}
      resolvedCopy={resolvedCopy}
      services={services}
      serviceAreas={serviceAreas}
      testimonials={testimonials}
      config={settings.template_config || {}}
    />
  );
}
