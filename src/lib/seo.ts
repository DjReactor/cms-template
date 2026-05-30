import type { BusinessInfo, SeoSettings, Service, ServiceArea, BlogPost, Testimonial } from '@/types';

export function buildLocalBusinessSchema(businessInfo: BusinessInfo, seoSettings: SeoSettings | null, testimonials: Testimonial[] = [], services: Service[] = [], serviceAreas: ServiceArea[] = []) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": seoSettings?.schema_business_type || "LocalBusiness",
    "name": businessInfo.business_name,
    "telephone": businessInfo.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessInfo.address,
      "addressLocality": businessInfo.city,
      "postalCode": businessInfo.google_maps_url ? '' : '',
      "addressCountry": "US"
    }
  };

  if (businessInfo.email) {
    schema["email"] = businessInfo.email;
  }

  // Social profiles
  const sameAs = [];
  if (businessInfo.social_facebook) sameAs.push(businessInfo.social_facebook);
  if (businessInfo.social_instagram) sameAs.push(businessInfo.social_instagram);
  if (businessInfo.social_yelp) sameAs.push(businessInfo.social_yelp);
  if (sameAs.length > 0) {
    schema["sameAs"] = sameAs;
  }

  if (businessInfo.year_established) {
    schema["foundingYear"] = businessInfo.year_established.toString();
  }

  // Service Areas
  if (serviceAreas.length > 0) {
    schema["areaServed"] = serviceAreas.map(area => ({
      "@type": "City",
      "name": area.name
    }));
  }

  // Aggregate Rating (from visible testimonials)
  if (seoSettings?.enable_aggregate_rating !== false && testimonials.length >= 3) {
    const totalRating = testimonials.reduce((acc, t) => acc + t.rating, 0);
    const avgRating = totalRating / testimonials.length;
    schema["aggregateRating"] = {
      "@type": "AggregateRating",
      "ratingValue": avgRating.toFixed(1),
      "reviewCount": testimonials.length.toString()
    };
  }

  return schema;
}

export function buildServiceSchema(service: Service, businessInfo: BusinessInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.short_description,
    "provider": {
      "@type": "LocalBusiness",
      "name": businessInfo.business_name
    }
  };
}

export function buildBlogPostingSchema(post: BlogPost, businessInfo: BusinessInfo, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.cover_image_url ? [post.cover_image_url] : [],
    "datePublished": post.published_at,
    "author": {
      "@type": "Organization",
      "name": businessInfo.business_name
    },
    "publisher": {
      "@type": "Organization",
      "name": businessInfo.business_name
    }
  };
}

export function buildBreadcrumbSchema(items: { name: string, item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.item
    }))
  };
}

export function generateMetaTitle(pageTitle: string, seoSettings: SeoSettings | null, businessName: string) {
  const separator = seoSettings?.title_separator || '|';
  return `${pageTitle} ${separator} ${businessName}`;
}
