import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import { getResolvedCopy } from "@/lib/template";
import type { Testimonial, SiteContent } from "@/types";
import { generateMetaTitle } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo) return {};

  const pb = await getPocketBaseClient();
  const siteContentList = await pb.collection('site_content').getFullList<SiteContent>({ filter: 'page = "about"' }).catch(() => []);
  const metaTitle = siteContentList[0]?.meta_title || "About Us";
  const seoSettings = await pb.collection('seo_settings').getFullList(1).then(r => r[0]).catch(() => null);

  return {
    title: generateMetaTitle(metaTitle, seoSettings, businessInfo.business_name),
    description: siteContentList[0]?.meta_description || `Learn more about ${businessInfo.business_name}.`,
  };
}

export default async function AboutPage() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo) return null;

  const pb = await getPocketBaseClient();
  const [testimonials, siteContentList] = await Promise.all([
    pb.collection('testimonials').getFullList<Testimonial>({ filter: 'visible = true', sort: 'order' }).catch(() => []),
    pb.collection('site_content').getFullList<SiteContent>({ filter: 'page = "about"' }).catch(() => [])
  ]);

  const siteContent = siteContentList[0]?.copy_data || {};
  const resolvedCopy = getResolvedCopy('about', siteContent, businessInfo);

  const template = await loadTemplate(settings.active_template);
  const AboutPageComponent = template.AboutPage;

  return (
    <AboutPageComponent
      businessInfo={businessInfo}
      resolvedCopy={resolvedCopy}
      testimonials={testimonials}
      config={settings.template_config || {}}
    />
  );
}
