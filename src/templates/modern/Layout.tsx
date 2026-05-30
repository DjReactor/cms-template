import type { LayoutProps } from '@/types/template';
import { bodyFont, headingFont } from './theme';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({ children, businessInfo, serviceAreas, settings, config }: LayoutProps) {
  const accentColor = (config['accent_color'] as string) ?? '#2D6A4F';

  return (
    <div
      className={`${bodyFont.variable} ${headingFont.variable} font-sans min-h-screen flex flex-col bg-white text-slate-600`}
      style={{ '--color-accent': accentColor } as React.CSSProperties}
    >
      <Header
        businessInfo={businessInfo}
        serviceAreas={serviceAreas}
        blogEnabled={settings.blog_enabled}
        config={config}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer
        businessInfo={businessInfo}
        services={[]} // Layout does not get services, passing empty array
        serviceAreas={serviceAreas}
        settings={settings}
        config={config}
      />
    </div>
  );
}
