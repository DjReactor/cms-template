import type { BusinessInfo, SeoSettings } from '@/types';

export function buildLocalBusinessSchema(
  businessInfo: BusinessInfo,
  seoSettings: SeoSettings | null
) {
  return {
    "@context": "https://schema.org",
    "@type": seoSettings?.schema_business_type || "LocalBusiness",
    "name": businessInfo.business_name,
    "telephone": businessInfo.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessInfo.address,
      "addressLocality": businessInfo.city,
      "addressRegion": businessInfo.state,
      "postalCode": businessInfo.zip,
      "addressCountry": "US"
    }
  };
}

export function generateMetaTitle(pageTitle: string, seoSettings: SeoSettings | null, businessName: string) {
  const separator = seoSettings?.title_separator || '|';
  return `${pageTitle} ${separator} ${businessName}`;
}
