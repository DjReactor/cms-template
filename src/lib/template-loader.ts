import type { TemplatePack } from '@/types/template';

// Cache for loaded templates
const templateCache = new Map<string, TemplatePack>();

export async function loadTemplate(id: string): Promise<TemplatePack> {
  if (templateCache.has(id)) {
    return templateCache.get(id)!;
  }

  try {
    // Dynamic import of the requested template.
    // Next.js static analysis will bundle everything in src/templates/*/index.ts
    const module = await import(`@/templates/${id}`);
    const pack = module.default as TemplatePack;
    
    if (!pack) {
      throw new Error(`Template ${id} does not have a default export.`);
    }

    templateCache.set(id, pack);
    return pack;
  } catch (error) {
    console.error(`Failed to load template '${id}'. Falling back to 'modern'.`, error);
    
    // Fallback to modern
    if (id !== 'modern') {
      return loadTemplate('modern');
    }
    
    throw new Error('Critical: Base template "modern" is missing or broken.');
  }
}
