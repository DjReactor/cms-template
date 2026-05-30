import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";

export default async function TermsPage() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  if (!settings || !businessInfo) return null;

  const template = await loadTemplate(settings.active_template);
  const Component = template.TermsPage;

  return <Component businessInfo={businessInfo} content="<p>Terms of Service Placeholder</p>" config={settings.template_config || {}} />;
}