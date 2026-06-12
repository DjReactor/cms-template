import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import { buildResolvedCopy } from "@/lib/template";
import type { Service, ServiceArea, Testimonial, MediaItem, BeforeAfterPair } from "@/types";

export default async function HomePageWrapper() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  const pb = await getPocketBaseClient();
  
  let services: Service[] = [];
  let serviceAreas: ServiceArea[] = [];
  let testimonials: Testimonial[] = [];
  let media: MediaItem[] = [];
  let beforeAfterPairs: BeforeAfterPair[] = [];
  
  try {
    services = await pb.collection('services').getFullList<Service>({ filter: 'is_active = true', sort: 'sort_order' });
    serviceAreas = await pb.collection('service_areas').getFullList<ServiceArea>({ filter: 'is_active = true', sort: 'sort_order' });
    testimonials = await pb.collection('testimonials').getFullList<Testimonial>({ filter: 'is_visible = true', sort: 'sort_order' });
    media = await pb.collection('media').getFullList<MediaItem>({ sort: 'sort_order' });
    beforeAfterPairs = await pb.collection('before_after_pairs').getFullList<BeforeAfterPair>({ filter: 'is_active = true', sort: 'sort_order' });
  } catch(e) {}

  const template = await loadTemplate(settings.active_template);
  const copyOverrides = settings.template_config?.copyOverrides || {};
  const resolvedCopy = buildResolvedCopy(template.manifest?.supportedCopyKeys, copyOverrides, businessInfo);

  const HomePageComponent = template.HomePage;

  return (
    <HomePageComponent
      businessInfo={businessInfo}
      resolvedCopy={resolvedCopy}
      services={services}
      serviceAreas={serviceAreas}
      testimonials={testimonials}
      media={media}
      beforeAfterPairs={beforeAfterPairs}
      config={settings.template_config || {}}
    />
  );
}

