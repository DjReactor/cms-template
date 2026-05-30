import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { getPocketBaseClient } from "@/lib/pocketbase";
import { getResolvedCopy } from "@/lib/template";

export default async function ContactPage() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo) return null;

  const pb = await getPocketBaseClient();
  const siteContentList = await pb.collection('site_content').getFullList({ filter: 'page = "contact"' }).catch(() => []);
  const resolvedCopy = getResolvedCopy('contact', siteContentList[0]?.copy_data || {}, businessInfo);

  const template = await loadTemplate(settings.active_template);
  const Component = template.ContactPage;

  return <Component businessInfo={businessInfo} resolvedCopy={resolvedCopy} config={settings.template_config || {}} />;
}