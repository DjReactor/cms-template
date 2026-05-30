import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";
import { resolveCopyObject } from "@/lib/template";

export default async function ContactPageWrapper() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();
  
  const resolvedCopy = resolveCopyObject({
    heading: `Contact Us`,
    subheading: `Reach out to {{business_name}} today.`,
  }, businessInfo);

  const template = await loadTemplate(settings.active_template);
  const ContactPageComponent = template.ContactPage;

  return (
    <ContactPageComponent
      businessInfo={businessInfo}
      resolvedCopy={resolvedCopy}
      config={settings.template_config || {}}
    />
  );
}