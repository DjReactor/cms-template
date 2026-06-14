export const COLOR_SLOTS = {
  // ── Backgrounds & Surfaces ─────────────────────────────────────────────────
  bg:            { label: 'Page Background',    cssVar: '--sf-bg',            description: 'Outermost site background canvas' },
  surface:       { label: 'Surface',            cssVar: '--sf-surface',       description: 'Cards, panels, form backgrounds' },
  surface_alt:   { label: 'Alternate Surface',  cssVar: '--sf-surface-alt',   description: 'Dark/alt sections, split panels, banners' },
  surface_hover: { label: 'Surface Hover',      cssVar: '--sf-surface-hover', description: 'Background of interactive cards/list items on hover' },
  input_bg:      { label: 'Input Background',   cssVar: '--sf-input-bg',      description: 'Form input and textarea background color' },

  // ── Text ───────────────────────────────────────────────────────────────────
  text:          { label: 'Body Text',          cssVar: '--sf-text',          description: 'Primary readable body text' },
  text_muted:    { label: 'Muted Text',         cssVar: '--sf-text-muted',    description: 'Captions, subtitles, helper text' },
  heading:       { label: 'Heading Text',       cssVar: '--sf-heading',       description: 'H1–H4 heading color' },
  text_on_alt:   { label: 'Text on Alt Surface',cssVar: '--sf-text-on-alt',   description: 'Readable text color when placed on --sf-surface-alt' },

  // ── Borders ────────────────────────────────────────────────────────────────
  border:        { label: 'Border',             cssVar: '--sf-border',        description: 'Section dividers, general lines' },
  input_border:  { label: 'Input Border',       cssVar: '--sf-input-border',  description: 'Input field border, distinct from section dividers' },
  border_focus:  { label: 'Focus Ring',         cssVar: '--sf-border-focus',  description: 'Focus ring color for inputs and interactive elements' },

  // ── Brand & Interactive ────────────────────────────────────────────────────
  brand:         { label: 'Brand / Accent',     cssVar: '--sf-brand',         description: 'CTAs, active links, buttons, badges' },
  brand_hover:   { label: 'Brand Hover',        cssVar: '--sf-brand-hover',   description: 'Darker CTA/button hover and pressed state' },
  brand_text:    { label: 'Brand Text',         cssVar: '--sf-brand-text',    description: 'Text/icons on brand-colored surfaces' },
  accent:        { label: 'Secondary Accent',   cssVar: '--sf-accent',        description: 'Hover states, focus rings, secondary highlights' },
  link:          { label: 'Link Color',         cssVar: '--sf-link',          description: 'Inline text link color, may differ from brand' },

  // ── Semantic States ────────────────────────────────────────────────────────
  success:       { label: 'Success',            cssVar: '--sf-success',       description: 'Form submission confirmations, success banners' },
  error:         { label: 'Error',              cssVar: '--sf-error',         description: 'Form validation errors, destructive action alerts' },
  warning:       { label: 'Warning',            cssVar: '--sf-warning',       description: 'Warning banners and notice states' },
  star:          { label: 'Star Rating',        cssVar: '--sf-star',          description: 'Star rating color — yellow/amber, review components' },

  // ── Overlays & Shadows ─────────────────────────────────────────────────────
  shadow:        { label: 'Shadow',             cssVar: '--sf-shadow',        description: 'Card, panel, and modal elevation shadows — use 8-digit hex for opacity' },
  overlay:       { label: 'Overlay',            cssVar: '--sf-overlay',       description: 'Hero image overlays and modal backdrops — use 8-digit hex for opacity' },
} as const

export type ColorSlotKey = keyof typeof COLOR_SLOTS

export type ColorPaletteColors = Record<ColorSlotKey, string>

export interface ColorPalette {
  id: string
  name: string
  colors: ColorPaletteColors
  sort_order: number
  created: string
  updated: string
}

// Ordered swatch display groups for the UI palette card
// Visual logic: backgrounds → text → borders → brand → semantic → overlays
export const SWATCH_DISPLAY_ORDER: ColorSlotKey[] = [
  // Backgrounds (5)
  'bg', 'surface', 'surface_alt', 'surface_hover', 'input_bg',
  // Text (4)
  'text', 'text_muted', 'heading', 'text_on_alt',
  // Borders (3)
  'border', 'input_border', 'border_focus',
  // Brand (5)
  'brand', 'brand_hover', 'brand_text', 'accent', 'link',
  // Semantic (4)
  'success', 'error', 'warning', 'star',
  // Overlays (2)
  'shadow', 'overlay',
]

export const DEFAULT_PALETTE_COLORS: ColorPaletteColors = {
  // Existing 10 — Forest Dark theme
  brand:         '#B9FF24',
  brand_text:    '#0D1F05',
  accent:        '#7CC504',
  bg:            '#0D1F05',
  surface:       '#162B0B',
  surface_alt:   '#1E3810',
  text:          '#E5F5D5',
  text_muted:    '#7A9E6A',
  border:        '#284B16',
  heading:       '#FFFFFF',
  // New 13
  brand_hover:   '#9ED918',
  shadow:        '#00000066',
  success:       '#22C55E',
  error:         '#EF4444',
  star:          '#FBBF24',
  text_on_alt:   '#E5F5D5',
  overlay:       '#00000099',
  input_bg:      '#162B0B',
  input_border:  '#3A5C20',
  border_focus:  '#B9FF24',
  surface_hover: '#203D12',
  warning:       '#F59E0B',
  link:          '#B9FF24',
}
