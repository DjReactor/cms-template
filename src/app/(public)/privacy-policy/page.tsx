import { loadTemplate } from "@/lib/template-loader";
import { getSettings, getBusinessInfo } from "@/lib/settings";

export default async function PrivacyPolicyPageWrapper() {
  const settings = await getSettings();
  const businessInfo = await getBusinessInfo();

  const content = `
    <h2>1. Introduction</h2>
    <p>Welcome to ${businessInfo.business_name}. We respect your privacy and are committed to protecting your personal data.</p>
    <h2>2. Data Collection</h2>
    <p>We may collect personal identification information such as your name, email address, phone number, etc. when you fill out forms on our site.</p>
    <h2>3. How We Use Your Data</h2>
    <p>We use your data to provide and improve our services, respond to inquiries, and communicate with you.</p>
    <h2>4. Contact Us</h2>
    <p>If you have any questions, contact us at ${businessInfo.email || 'our contact page'}.</p>
  `;

  const template = await loadTemplate(settings.active_template);
  const PrivacyPageComponent = template.PrivacyPage;

  return (
    <PrivacyPageComponent
      businessInfo={businessInfo}
      pageContent={content}
      config={settings.template_config || {}}
    />
  );
}