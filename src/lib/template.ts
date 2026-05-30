import type { BusinessInfo, ServiceArea, ResolvedCopy } from '@/types';

export function resolveVariables(text: string, vars: Record<string, string>): string {
  if (!text) return '';
  return text.replace(/\{\{([^{}]+)\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    return vars[trimmedKey] !== undefined ? vars[trimmedKey] : match;
  });
}

export function getResolvedCopy(
  page: string,
  copyData: Record<string, string> | null,
  businessInfo: BusinessInfo,
  area?: ServiceArea
): ResolvedCopy {
  if (!copyData) return {};
  
  const vars: Record<string, string> = {
    business_name: businessInfo.business_name || '',
    phone: businessInfo.phone || '',
    city: businessInfo.city || '',
    service_area: area ? area.name : businessInfo.city || '',
  };

  const resolved: ResolvedCopy = {};
  for (const [key, value] of Object.entries(copyData)) {
    resolved[key] = resolveVariables(value, vars);
  }
  
  return resolved;
}
