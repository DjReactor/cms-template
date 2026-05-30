import type { ReactNode } from 'react';
import type { BusinessInfo, Service, ServiceArea, Testimonial, BlogPost, Settings } from './index';

export type TemplateConfig = Record<string, any>;
export type ResolvedCopy = Record<string, string>;

export interface LayoutProps {
  children: ReactNode;
  businessInfo: BusinessInfo;
  serviceAreas: ServiceArea[];
  settings: Settings;
  config: TemplateConfig;
}

export interface HeaderProps {
  businessInfo: BusinessInfo;
  serviceAreas: ServiceArea[];
  blogEnabled: boolean;
  config: TemplateConfig;
}

export interface FooterProps {
  businessInfo: BusinessInfo;
  services: Service[];
  serviceAreas: ServiceArea[];
  settings: Settings;
  config: TemplateConfig;
}

export interface HomePageProps {
  businessInfo: BusinessInfo;
  resolvedCopy: ResolvedCopy;
  services: Service[];
  serviceAreas: ServiceArea[];
  testimonials: Testimonial[];
  config: TemplateConfig;
}

export interface AboutPageProps {
  businessInfo: BusinessInfo;
  resolvedCopy: ResolvedCopy;
  testimonials: Testimonial[];
  config: TemplateConfig;
}

export interface ContactPageProps {
  businessInfo: BusinessInfo;
  resolvedCopy: ResolvedCopy;
  config: TemplateConfig;
}

export interface ServicesIndexProps {
  businessInfo: BusinessInfo;
  resolvedCopy: ResolvedCopy;
  services: Service[];
  config: TemplateConfig;
}

export interface ServiceDetailProps {
  businessInfo: BusinessInfo;
  service: Service;
  serviceAreas: ServiceArea[];
  config: TemplateConfig;
}

export interface ServiceAreaProps {
  businessInfo: BusinessInfo;
  area: ServiceArea;
  services: Service[];
  config: TemplateConfig;
}

export interface BlogIndexProps {
  businessInfo: BusinessInfo;
  resolvedCopy: ResolvedCopy;
  posts: BlogPost[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  config: TemplateConfig;
}

export interface BlogPostProps {
  businessInfo: BusinessInfo;
  post: BlogPost;
  recentPosts: BlogPost[];
  config: TemplateConfig;
}

export interface StaticPageProps {
  businessInfo: BusinessInfo;
  content: string; // pre-rendered HTML
  config: TemplateConfig;
}

export interface TemplatePack {
  Layout: React.ComponentType<LayoutProps>;
  Header: React.ComponentType<HeaderProps>;
  Footer: React.ComponentType<FooterProps>;
  HomePage: React.ComponentType<HomePageProps>;
  AboutPage: React.ComponentType<AboutPageProps>;
  ContactPage: React.ComponentType<ContactPageProps>;
  ServicesIndexPage: React.ComponentType<ServicesIndexProps>;
  ServiceDetailPage: React.ComponentType<ServiceDetailProps>;
  ServiceAreaPage: React.ComponentType<ServiceAreaProps>;
  BlogIndexPage: React.ComponentType<BlogIndexProps>;
  BlogPostPage: React.ComponentType<BlogPostProps>;
  PrivacyPage: React.ComponentType<StaticPageProps>;
  TermsPage: React.ComponentType<StaticPageProps>;
}
