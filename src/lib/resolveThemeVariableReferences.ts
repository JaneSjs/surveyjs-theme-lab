/**
 * Expands `var(--token)` references using a flat cssVariables map (Survey theme style).
 * Runs repeatedly until stable so chains like var(--a) → var(--b) → #fff collapse.
 * Unknown tokens are left as `var(--token)`. Supports `var(--token, fallback)`.
 */
const VAR_WITH_FALLBACK = /var\(\s*(--[a-zA-Z0-9-]+)\s*(?:,\s*([^)]+?))?\s*\)/g;

export function resolveThemeVariableReferences(
  input: string,
  vars: Readonly<Record<string, string>>
): string {
  let s = input;
  const maxPasses = 64;
  for (let pass = 0; pass < maxPasses; pass++) {
    let changed = false;
    const next = s.replace(VAR_WITH_FALLBACK, (match, name: string, fallback?: string) => {
      const resolved = vars[name];
      if (resolved !== undefined && resolved !== '') {
        changed = true;
        return resolved;
      }
      if (fallback !== undefined && fallback.trim() !== '') {
        changed = true;
        return fallback.trim();
      }
      return match;
    });
    s = next;
    if (!changed) break;
  }
  return s;
}
