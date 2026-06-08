// ── Shared work-profile constants ─────────────────────────────────────────────
// Single source of truth for OnboardingFlow and EinstellungenView.
// Edit here → both screens update automatically.

export type Schwere    = 'leicht' | 'mittel' | 'schwer';
export type Bekleidung = 'leicht' | 'mittel' | 'schwer';
export type Schicht    = 'früh' | 'tag' | 'nacht';

// ── Shift presets ─────────────────────────────────────────────────────────────
// Typical hours for construction (Baugewerbe) and agriculture (Landwirtschaft)
// in Germany. Source: Bundesrahmentarifvertrag Baugewerbe + BAuA data.
export const SCHICHT_PRESETS: Record<Schicht, { start: string; end: string }> = {
  früh:  { start: '06:00', end: '14:00' },  // Frühschicht Bau: 06:00–14:00
  tag:   { start: '07:00', end: '15:30' },  // Normalarbeitszeit Bau: 07:00–15:30
  nacht: { start: '22:00', end: '06:00' },  // Nachtschicht (Straßenbau etc.)
};

export const SCHICHT_LABEL: Record<Schicht, string> = {
  früh:  'Frühschicht',
  tag:   'Tagschicht',
  nacht: 'Nachtschicht',
};

// ── Short display labels (for chips, summaries) ──────────────────────────────
export const SCHWERE_SHORT: Record<Schwere, string> = {
  leicht: 'Leichte Arbeit',
  mittel: 'Mittlere Arbeit',
  schwer: 'Schwere Arbeit',
};

export const BEKLEIDUNG_SHORT: Record<Bekleidung, string> = {
  leicht: 'Leichte Kleidung',
  mittel: 'Arbeitskleidung',
  schwer: 'Schwere Schutzkleidung',
};

// ── Work intensity ────────────────────────────────────────────────────────────
export const SCHWERE_LABEL: Record<Schwere, string> = {
  leicht: 'Stehen, Gehen, Kontrolle, leichte Montagearbeiten',
  mittel: 'Handwerk, Montage, moderate Hebe- und Tragearbeiten',
  schwer: 'Schaufeln, Graben, schwere Hebe- und Tragearbeiten',
};

// ── Clothing ─────────────────────────────────────────────────────────────────
export const BEKLEIDUNG_LABEL: Record<Bekleidung, string> = {
  leicht: 'Atmungsaktive Bekleidung, z. B. T-Shirt, Baumwoll-Arbeitshose',
  mittel: 'Typische Arbeitskleidung, z. B. Hemd, Arbeitshose (Baumwoll-Mix)',
  schwer: 'Schwere Schutzkleidung, z. B. Warnschutzoverall, Wetterschutzanzug',
};
