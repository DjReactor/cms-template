import { Inter, Merriweather } from 'next/font/google';

export const bodyFont = Inter({ subsets: ['latin'], variable: '--font-body' });
export const headingFont = Merriweather({ subsets: ['latin'], weight: ['300', '400', '700'], variable: '--font-heading' });

// We can define standard styles here that components will use.
// Tailwind classes for buttons using the injected accent color.
export const styles = {
  buttonPrimary: 'bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center',
  buttonSecondary: 'bg-white text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-slate-50 transition-colors px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center',
  headingBase: 'font-heading text-slate-900 tracking-tight',
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
};
