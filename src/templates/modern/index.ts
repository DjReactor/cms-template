import type { TemplatePack } from '@/types/template'

import { Layout }            from './Layout'
import { Header }            from './Header'
import { Footer }            from './Footer'
import { HomePage }          from './HomePage'
import { AboutPage }         from './AboutPage'
import { ContactPage }       from './ContactPage'
import { ServicesIndexPage } from './ServicesIndexPage'
import { ServiceDetailPage } from './ServiceDetailPage'
import { ServiceAreaPage }   from './ServiceAreaPage'
import { BlogIndexPage }     from './BlogIndexPage'
import { BlogPostPage }      from './BlogPostPage'
import { PrivacyPage }       from './PrivacyPage'
import { TermsPage }         from './TermsPage'

import { TemplateManifest } from '@/types'

export const manifest: TemplateManifest = {
  name: "Modern",
  slug: "modern",
  supportedImageKeys: {
    "hero_bg": { 
      label: "Main Hero Background", 
      defaultFallback: "" 
    }
  }
}

const templatePack: TemplatePack = {
  manifest,
  Layout,
  Header,
  Footer,
  HomePage,
  AboutPage,
  ContactPage,
  ServicesIndexPage,
  ServiceDetailPage,
  ServiceAreaPage,
  BlogIndexPage,
  BlogPostPage,
  PrivacyPage,
  TermsPage,
}

export default templatePack
