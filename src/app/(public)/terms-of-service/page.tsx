import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";

export default async function TermsOfServicePageWrapper() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();

  const content = `
    <h2>1. Terms</h2>
    <p>By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use.</p>
    <h2>2. Use License</h2>
    <p>Permission is granted to temporarily download one copy of the materials on ${businessInfo.business_name}'s web site for personal, non-commercial transitory viewing only.</p>
    <h2>3. Disclaimer</h2>
    <p>The materials on ${businessInfo.business_name}'s web site are provided "as is". We make no warranties, expressed or implied.</p>
    <h2>4. Limitations</h2>
    <p>In no event shall ${businessInfo.business_name} or its suppliers be liable for any damages arising out of the use or inability to use the materials on our Internet site.</p>
  `;

  const template = await loadTemplate(settings.active_template);
  const TermsPageComponent = template.TermsPage;

  return (
    <TermsPageComponent
      businessInfo={businessInfo}
      pageContent={content}
      config={settings.template_config || {}}
    />
  );
}