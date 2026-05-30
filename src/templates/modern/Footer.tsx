import type { FooterProps } from '@/types/template';
import Link from 'next/link';
import { styles } from './theme';

export function Footer({ businessInfo, services, serviceAreas, settings, config }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 lg:py-16">
      <div className={`${styles.container} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12`}>
        
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-2xl text-white">
            {businessInfo.business_name || 'My Business'}
          </h2>
          <p className="text-sm text-slate-400 max-w-xs">
            {businessInfo.tagline || businessInfo.short_description}
          </p>
          <div className="space-y-2 text-sm pt-2">
            {businessInfo.phone && <a href={`tel:${businessInfo.phone}`} className="block hover:text-white transition-colors">{businessInfo.phone}</a>}
            {businessInfo.email && <a href={`mailto:${businessInfo.email}`} className="block hover:text-white transition-colors">{businessInfo.email}</a>}
            {businessInfo.address && <p>{businessInfo.address}</p>}
            {businessInfo.license_number && <p className="text-slate-500">License #{businessInfo.license_number}</p>}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            {settings.blog_enabled && <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>}
          </ul>
        </div>

        {services.length > 0 && (
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              {services.map(s => (
                <li key={s.id}><Link href={`/services/${s.slug}`} className="hover:text-white transition-colors">{s.name}</Link></li>
              ))}
            </ul>
          </div>
        )}

        {serviceAreas.length > 0 && (
          <div>
            <h3 className="font-semibold text-white mb-4">Service Areas</h3>
            <ul className="space-y-2 text-sm">
              {serviceAreas.map(a => (
                <li key={a.id}><Link href={`/${a.slug}`} className="hover:text-white transition-colors">{a.name}</Link></li>
              ))}
            </ul>
          </div>
        )}

      </div>

      <div className={`${styles.container} mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500`}>
        <p>© {year} {businessInfo.business_name}. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link>
        </div>
        {settings.show_powered_by && (
          <a href="https://successforce.agency" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
            Powered by SuccessForce
          </a>
        )}
      </div>
    </footer>
  );
}
