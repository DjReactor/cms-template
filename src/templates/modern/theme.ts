import { Inter, Merriweather } from 'next/font/google';

export const bodyFont = Inter({ subsets: ['latin'], variable: '--font-body' });
export const headingFont = Merriweather({ subsets: ['latin'], weight: ['300', '400', '700'], variable: '--font-heading' });

export const ACCENT = '#2D6A4F';

export const styles = {
  buttonPrimary: 'bg-[#2D6A4F] text-white hover:opacity-90 transition-opacity px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center',
  buttonSecondary: 'bg-white text-[#2D6A4F] border border-[#2D6A4F] hover:bg-slate-50 transition-colors px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center',
  headingBase: 'font-heading text-slate-900 tracking-tight',
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
};
