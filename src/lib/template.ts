import { BusinessInfo } from '@/types';

/**
 * Resolves standard template variables inside a string.
 * Example: "Welcome to {{business_name}}" -> "Welcome to Apex Plumbing"
 */
export function resolveTemplateTokens(text: string, businessInfo: BusinessInfo): string {
  if (!text) return '';
  
  return text
    .replace(/\{\{business_name\}\}/g, businessInfo.business_name || '')
    .replace(/\{\{city\}\}/g, businessInfo.city || '')
    .replace(/\{\{phone\}\}/g, businessInfo.phone || '')
    .replace(/\{\{business_type\}\}/g, businessInfo.business_type || '');
}

/**
 * Convenience method to resolve multiple strings at once
 */
export function resolveCopyObject(copyMap: Record<string, string>, businessInfo: BusinessInfo): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const [key, value] of Object.entries(copyMap)) {
    resolved[key] = resolveTemplateTokens(value, businessInfo);
  }
  return resolved;
}
