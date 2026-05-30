export interface BusinessHour {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  enabled: boolean;
  open: string;
  close: string;
}

export interface BusinessInfo {
  id: string;
  business_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  business_type: string;
  hours: BusinessHour[];
  emergency_service: 'Yes' | 'No';
  service_radius: number;
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  google_maps_url: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  icon: string;
  cover_image_url: string;
  page_content: any;
  meta_title: string;
  meta_description: string;
  order: number;
  active: boolean;
}

export interface ServiceArea {
  id: string;
  name: string;
  slug: string;
  zip_codes: string;
  meta_title: string;
  meta_description: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_location: string;
  rating: number;
  content: string;
  source: string;
  order: number;
  visible: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  cover_image_url: string;
  author_type: 'human' | 'auto';
  status: 'draft' | 'published';
  published_at: string;
  meta_title: string;
  meta_description: string;
}

export interface MediaItem {
  id: string;
  file: string;
  alt_text: string;
  category: 'general' | 'logo' | 'service' | 'blog' | 'gallery';
  url: string; // resolved full url
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'resolved';
  created: string;
}

export interface AiCallLog {
  id: string;
  call_id: string;
  caller_number: string;
  transcript: string;
  summary: string;
  duration: number;
  sentiment: string;
  created: string;
}

export interface Settings {
  id: string;
  active_template: string;
  template_config: Record<string, any>;
  blog_enabled: boolean;
  retell_enabled: boolean;
  reviews_enabled: boolean;
  updates_enabled: boolean;
  update_channel: string;
  show_powered_by: boolean;
  blog_webhook_secret: string;
  retell_webhook_secret: string;
  reviews_webhook_secret: string;
}

export interface SeoSettings {
  id: string;
  schema_business_type: string;
  title_separator: string;
  enable_breadcrumbs: boolean;
  enable_aggregate_rating: boolean;
  noindex_blog: boolean;
  noindex_service_areas: boolean;
}

export interface Redirect {
  id: string;
  source: string;
  destination: string;
  permanent: boolean;
  hits: number;
}

export interface Seo404Log {
  id: string;
  path: string;
  referrer: string;
  hits: number;
  updated: string;
}

export interface SiteContent {
  id: string;
  page: 'home' | 'about' | 'contact' | 'services_index' | 'blog_index';
  copy_data: Record<string, string>;
  meta_title: string;
  meta_description: string;
}

export interface TemplateMeta {
  id: string;
  current_version: string;
  update_available: boolean;
  last_updated: string;
}

export interface User {
  id: string;
  email: string;
  role: 'business_owner' | 'agency_admin';
  display_name: string;
  verified: boolean;
  must_change_password: boolean;
}
