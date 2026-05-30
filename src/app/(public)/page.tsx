import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import { resolveCopyObject } from "@/lib/template";
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

  const resolvedCopy = resolveCopyObject({
    hero_h1: `The Best {{business_type}} in {{city}}`,
    hero_subtitle: 'Fast. Reliable. Local.',
    cta_primary: 'Get a Free Quote',
    cta_secondary: 'Call {{phone}}',
    about_heading: `Why {{city}} Trusts {{business_name}}`
  }, businessInfo);

  const template = await loadTemplate(settings.active_template);
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
