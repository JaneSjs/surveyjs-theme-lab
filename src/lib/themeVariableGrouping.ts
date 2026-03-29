/** Semantic groups for `--sjs2-*` CSS variables (matches naming in default-light theme). */

export const THEME_VARIABLE_GROUP_ORDER: string[] = [
  'Base units',
  'Text case',
  'Layout',
  'Color palette',
  'Radius — form',
  'Radius — components',
  'Radius — other',
  'Typography',
  'Brand & accent (project)',
  'Utility surfaces & shadows',
  'Semantic colors — background',
  'Semantic colors — foreground',
  'Semantic colors — borders',
  'Data visualization',
  'Component colors',
  'Border geometry (width, offset, blur, spread)',
  'Shadow & border effects',
  'Miscellaneous',
];

export function getSemanticGroup(cssVarName: string): string {
  const name = cssVarName.replace(/^--sjs2-/, '');

  if (name.startsWith('base-unit')) return 'Base units';
  if (name.startsWith('text-case')) return 'Text case';
  if (name.startsWith('is-panelless')) return 'Layout';
  if (name.startsWith('palette-')) return 'Color palette';

  if (name.startsWith('radius-form')) return 'Radius — form';
  if (name.startsWith('radius-component')) return 'Radius — components';
  if (name.startsWith('radius-')) return 'Radius — other';

  if (name.startsWith('typography-')) return 'Typography';

  if (name.startsWith('color-project-')) return 'Brand & accent (project)';
  if (name.startsWith('color-utility-')) return 'Utility surfaces & shadows';
  if (name.startsWith('color-bg-')) return 'Semantic colors — background';
  if (name.startsWith('color-fg-')) return 'Semantic colors — foreground';
  if (name.startsWith('color-border-')) return 'Semantic colors — borders';
  if (name.startsWith('color-data-')) return 'Data visualization';
  if (name.startsWith('color-component-')) return 'Component colors';

  if (
    name.startsWith('border-width-') ||
    name.startsWith('border-offset-') ||
    name.startsWith('border-blur-') ||
    name.startsWith('border-spread-')
  ) {
    return 'Border geometry (width, offset, blur, spread)';
  }
  if (name.startsWith('border-effect-')) return 'Shadow & border effects';
  if (name.startsWith('shadow-')) return 'Shadow & border effects';

  return 'Miscellaneous';
}

export function groupOrderIndex(group: string): number {
  const i = THEME_VARIABLE_GROUP_ORDER.indexOf(group);
  return i === -1 ? THEME_VARIABLE_GROUP_ORDER.length : i;
}

/** Hex colors suitable for `<input type="color">` (3- or 6-digit, no alpha). */
export function supportsNativeColorInput(value: string): boolean {
  const v = value.trim();
  return /^#[0-9a-fA-F]{6}$/.test(v) || /^#[0-9a-fA-F]{3}$/.test(v);
}

export function expandShortHexForColorInput(value: string): string {
  const v = value.trim();
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    const r = v[1];
    const g = v[2];
    const b = v[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return v;
}

export function isColorVariableName(cssVarName: string): boolean {
  return cssVarName.toLowerCase().includes('color');
}

/** Theme CSS keywords like `--sjs2-is-panelless`: `"true"` / `"false"`. */
export function parseCssBooleanKeyword(value: string): boolean | null {
  const t = value.trim().toLowerCase();
  if (t === 'true') return true;
  if (t === 'false') return false;
  return null;
}

/**
 * If the resolved value can drive `<input type="color">`, returns 6-digit `#RRGGBB`.
 * Returns null when still indirect (`var(`), relative color syntax, or not parseable as a solid RGB hex.
 */
export function colorPickerHexFromResolved(resolved: string): string | null {
  const v = resolved.trim();
  if (!v) return null;
  if (/var\s*\(/i.test(v)) return null;
  if (/rgba?\(\s*from\b/i.test(v) || /hsla?\(\s*from\b/i.test(v)) return null;

  if (supportsNativeColorInput(v)) {
    return expandShortHexForColorInput(v).toUpperCase();
  }

  const rgbComma = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(v);
  const rgbSpace = /^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/|\s*\)|\s*,)/i.exec(v);
  const m = rgbComma || rgbSpace;
  if (m) {
    const r = Math.round(Math.min(255, Math.max(0, Number(m[1]))));
    const g = Math.round(Math.min(255, Math.max(0, Number(m[2]))));
    const b = Math.round(Math.min(255, Math.max(0, Number(m[3]))));
    if (![r, g, b].every((n) => Number.isFinite(n))) return null;
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  return null;
}
