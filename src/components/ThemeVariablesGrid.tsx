'use client';

import { useMemo, useState } from 'react';
import {
  colorPickerHexFromResolved,
  expandShortHexForColorInput,
  getSemanticGroup,
  groupOrderIndex,
  isColorVariableName,
  parseCssBooleanKeyword,
  supportsNativeColorInput,
} from '@/lib/themeVariableGrouping';
import { resolveThemeVariableReferences } from '@/lib/resolveThemeVariableReferences';
import styles from './ThemeVariablesGrid.module.css';

/** `<input type="color">` must have a valid simple color; used only as UI placeholder when theme has no hex yet. */
const COLOR_PICKER_PLACEHOLDER_HEX = '#FFFFFF';

export interface ThemeVariablesGridProps {
  variableKeys: readonly string[];
  values: Readonly<Record<string, string>>;
  /** Full cssVariables map (base theme + current overrides) for resolving `var(--*)` in the value column. */
  varDictionary: Readonly<Record<string, string>>;
  onChange: (key: string, value: string) => void;
}

type Grouped = { group: string; keys: string[] };

export default function ThemeVariablesGrid({
  variableKeys,
  values,
  varDictionary,
  onChange,
}: ThemeVariablesGridProps) {
  const [query, setQuery] = useState('');

  const groupedFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = variableKeys.filter((key) => {
      if (!q) return true;
      const raw = values[key] ?? '';
      const resolved = resolveThemeVariableReferences(raw, varDictionary);
      return (
        key.toLowerCase().includes(q) ||
        raw.toLowerCase().includes(q) ||
        resolved.toLowerCase().includes(q)
      );
    });

    const map = new Map<string, string[]>();
    for (const key of filtered) {
      const g = getSemanticGroup(key);
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(key);
    }

    for (const keys of map.values()) {
      keys.sort((a, b) => a.localeCompare(b));
    }

    const groups: Grouped[] = [...map.entries()].map(([group, keys]) => ({
      group,
      keys,
    }));

    groups.sort((a, b) => {
      const oa = groupOrderIndex(a.group);
      const ob = groupOrderIndex(b.group);
      if (oa !== ob) return oa - ob;
      return a.group.localeCompare(b.group);
    });

    return groups;
  }, [variableKeys, values, varDictionary, query]);

  return (
    <aside className={styles.panel} aria-label="Theme CSS variables">
      <div className={styles.header}>
        <h2 className={styles.title}>Default light — CSS variables</h2>
        <input
          type="search"
          className={styles.search}
          placeholder="Search by variable name or value…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Filter variables"
        />
      </div>
      <div className={styles.scroll}>
        {groupedFiltered.length === 0 ? (
          <p className={styles.empty}>No variables match your search.</p>
        ) : (
          groupedFiltered.map(({ group, keys }) => (
            <details key={group} className={styles.group} open>
              <summary className={styles.groupSummary}>
                {group}
                <span style={{ fontWeight: 400, color: '#666', marginLeft: 6 }}>
                  ({keys.length})
                </span>
              </summary>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={`${styles.th} ${styles.varName}`}>Variable</th>
                      <th className={`${styles.th} ${styles.valueCell}`}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.map((key) => (
                      <tr key={key}>
                        <td className={`${styles.td} ${styles.varName}`}>{key}</td>
                        <td className={`${styles.td} ${styles.valueCell}`}>
                          <ValueEditor
                            variableKey={key}
                            storedValue={values[key] ?? ''}
                            varDictionary={varDictionary}
                            onChange={(v) => onChange(key, v)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))
        )}
      </div>
    </aside>
  );
}

function ValueEditor({
  variableKey,
  storedValue,
  varDictionary,
  onChange,
}: {
  variableKey: string;
  storedValue: string;
  varDictionary: Readonly<Record<string, string>>;
  onChange: (v: string) => void;
}) {
  const resolved = resolveThemeVariableReferences(storedValue, varDictionary);
  const storedBool = parseCssBooleanKeyword(storedValue);
  const resolvedBool = parseCssBooleanKeyword(resolved);
  if (storedBool !== null || resolvedBool !== null) {
    const checked = storedBool ?? resolvedBool ?? false;
    return (
      <label className={styles.booleanRow}>
        <input
          type="checkbox"
          className={styles.booleanCheckbox}
          checked={checked}
          onChange={(e) => onChange(e.target.checked ? 'true' : 'false')}
          aria-label={`${variableKey}: true or false`}
        />
        <span className={styles.booleanValue}>{checked ? 'true' : 'false'}</span>
      </label>
    );
  }

  const colorName = isColorVariableName(variableKey);
  const pickerHex = colorPickerHexFromResolved(resolved);

  if (colorName) {
    /** Empty UI when value is still a var() chain; once the user types a literal, show their input (pickerHex wins when we have a full hex). */
    const storedStillIndirect = /var\s*\(/i.test(storedValue);
    const textValue = pickerHex ?? (storedStillIndirect ? '' : storedValue);
    const showPlaceholder = !pickerHex && storedStillIndirect;

    return (
      <div className={styles.valueRow}>
        <input
          type="color"
          className={`${styles.colorInput}${pickerHex ? '' : ` ${styles.colorInputUnset}`}`}
          value={pickerHex ?? COLOR_PICKER_PLACEHOLDER_HEX}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          title={
            pickerHex
              ? 'Pick color'
              : 'No solid color in theme yet — pick one to set this variable'
          }
          aria-label={pickerHex ? 'Color' : 'Color (unset in theme — pick to set)'}
        />
        <input
          type="text"
          className={styles.textInput}
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          placeholder={showPlaceholder ? 'Enter a color (e.g. #19B394)' : undefined}
          aria-label="CSS color value"
        />
      </div>
    );
  }

  const showColor = supportsNativeColorInput(resolved);

  return (
    <div className={styles.valueRow}>
      {showColor ? (
        <input
          type="color"
          className={styles.colorInput}
          value={expandShortHexForColorInput(resolved)}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          title="Pick color"
          aria-label="Color"
        />
      ) : null}
      <input
        type="text"
        className={styles.textInput}
        value={resolved}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        aria-label="CSS value"
      />
    </div>
  );
}
