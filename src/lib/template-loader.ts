import type { TemplatePack } from '@/types/template';

export async function loadTemplate(id: string): Promise<TemplatePack> {
  try {
    const mod = await import(`@/templates/${id}/index`);
    return mod.default as TemplatePack;
  } catch (error) {
    console.error(`Failed to load template '${id}', falling back to 'home-services-base'`, error);
    try {
      const fallback = await import('@/templates/home-services-base/index');
      return fallback.default as TemplatePack;
    } catch (fallbackError) {
      console.error('Even the fallback template failed to load. Ensure home-services-base exists.', fallbackError);
      throw new Error('Template loading failed critically.');
    }
  }
}
