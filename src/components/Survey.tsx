'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import 'survey-core/survey-core.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import * as SurveyTheme from 'survey-core/themes';
import defaultLightTheme from '@/default-light';
import ThemeVariablesGrid from '@/components/ThemeVariablesGrid';
import pageStyles from '@/components/Survey.module.css';
import { buildCompleteDefaultLightTheme } from '@/lib/buildCompleteTheme';
import { surveyJson } from "./surveyJson";
/** Keys from DefaultLight at runtime, minus variables commented out in default-light.ts (not present in its cssVariables object). */
function getTrackedThemeVariableKeys(): string[] {
  const base = SurveyTheme.DefaultLight.cssVariables as Record<string, string>;
  const snap = defaultLightTheme.cssVariables as Record<string, string>;
  const snapKeys = new Set(Object.keys(snap));
  return Object.keys(base)
    .filter((key) => snapKeys.has(key))
    .sort();
}

function buildInitialCssValues(trackedKeys: string[]): Record<string, string> {
  const base = SurveyTheme.DefaultLight.cssVariables as Record<string, string>;
  const initial: Record<string, string> = {};
  for (const key of trackedKeys) {
    initial[key] = base[key];
  }
  return initial;
}

/** Top suggestions for trying the theme editor; add entries as you document more variables (keep length 10). */
const DEMO_THEME_VARIABLE_HINTS: Array<{ variable: string; description: string } | null> = [
  {
    variable: '--sjs2-color-bg-brand-primary',
    description: "SurveyJS Brand Color",
  },
  {
    variable: '--sjs2-color-bg-basic-primary',
    description: "Basic Primary Background Color"
  },
  {
    variable: '--sjs2-color-bg-neutral-tertiary-dim',
    description: 'The form content background color',
  },
  {
    variable: '--sjs2-base-unit-size',
    description: "Base Unit Size"
  },
  {
    variable: '--sjs2-is-panelless',
    description: 'Whether the survey is panelless',
  },
  {
    variable: '--sjs2-base-unit-radius',
    description: 'Border radius',
  },
  {
    variable: '--sjs2-color-bg-alert-primary',
    description: "Error Form Color"
  },
  {
    variable: '--sjs2-color-bg-alert-primary',
    description: "Error Font Color"
  },
  {
    variable: '--sjs2-color-bg-alert-secondary',
    description: "Error Background Color"
  },
  {
    variable: '--sjs2-color-component-formbox-invalid-border',
    description: "Error Border Color"
  }, 
  {
    variable: '--sjs2-color-fg-basic-primary',
    description: "Primary Font Color"
  },
];

const SPLITTER_WIDTH_PX = 8;
const RIGHT_PANE_MIN_PX = 480;
const RIGHT_PANE_MAX_PX = 920;
const LEFT_PANE_MIN_PX = 280;

function getDefaultRightPaneWidth(): number {
  if (typeof window === 'undefined') {
    return Math.min(RIGHT_PANE_MAX_PX, 640);
  }
  const vw = window.innerWidth;
  return Math.min(RIGHT_PANE_MAX_PX, Math.max(RIGHT_PANE_MIN_PX, Math.round(vw * 0.58)));
}

function getRightPaneMaxPx(): number {
  if (typeof window === 'undefined') {
    return RIGHT_PANE_MAX_PX;
  }
  const maxFromViewport = window.innerWidth - LEFT_PANE_MIN_PX - SPLITTER_WIDTH_PX;
  return Math.min(RIGHT_PANE_MAX_PX, Math.max(RIGHT_PANE_MIN_PX, maxFromViewport));
}

function clampRightPaneWidth(px: number): number {
  const cap = getRightPaneMaxPx();
  return Math.min(cap, Math.max(RIGHT_PANE_MIN_PX, px));
}

function downloadJson(filename: string, data: unknown) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function SurveyComponent() {
  const survey = useMemo(() => new Model(surveyJson), []);
  const themeFileInputRef = useRef<HTMLInputElement>(null);

  const { trackedKeys, initialCssValues } = useMemo(() => {
    const keys = getTrackedThemeVariableKeys();
    return { trackedKeys: keys, initialCssValues: buildInitialCssValues(keys) };
  }, []);

  const [cssValues, setCssValues] = useState(initialCssValues);
  const [rightPaneWidthPx, setRightPaneWidthPx] = useState(getDefaultRightPaneWidth);
  const [splitterDragging, setSplitterDragging] = useState(false);

  useLayoutEffect(() => {
    setRightPaneWidthPx((w) => clampRightPaneWidth(w));
  }, []);

  useEffect(() => {
    const onResize = () => {
      setRightPaneWidthPx((w) => clampRightPaneWidth(w));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onSplitterMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightPaneWidthPx;
    setSplitterDragging(true);

    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      setRightPaneWidthPx(clampRightPaneWidth(startWidth - delta));
    };

    const onUp = () => {
      setSplitterDragging(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.removeProperty('cursor');
      document.body.style.removeProperty('user-select');
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [rightPaneWidthPx]);

  const onSplitterKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 64 : 16;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setRightPaneWidthPx((w) => clampRightPaneWidth(w - step));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setRightPaneWidthPx((w) => clampRightPaneWidth(w + step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setRightPaneWidthPx(RIGHT_PANE_MIN_PX);
    } else if (e.key === 'End') {
      e.preventDefault();
      setRightPaneWidthPx(getRightPaneMaxPx());
    }
  }, []);

  useEffect(() => {
    survey.applyTheme(
      buildCompleteDefaultLightTheme(cssValues) as Parameters<Model['applyTheme']>[0]
    );
  }, [survey, cssValues]);

  const onVariableChange = useCallback((key: string, value: string) => {
    setCssValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const varDictionary = useMemo(() => {
    const baseVars = SurveyTheme.DefaultLight.cssVariables as Record<string, string>;
    return { ...baseVars, ...cssValues };
  }, [cssValues]);

  const completeThemeForExport = useMemo(
    () => buildCompleteDefaultLightTheme(cssValues),
    [cssValues]
  );

  const saveThemeJson = useCallback(() => {
    downloadJson('survey-default-light-theme.json', completeThemeForExport);
  }, [completeThemeForExport]);

  const onUploadThemePick = useCallback(() => {
    themeFileInputRef.current?.click();
  }, []);

  const onThemeFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result)) as { cssVariables?: Record<string, string> };
          const vars = parsed.cssVariables;
          if (!vars || typeof vars !== 'object') {
            throw new Error('Missing cssVariables');
          }
          setCssValues((prev) => {
            const next = { ...prev };
            for (const key of trackedKeys) {
              if (Object.prototype.hasOwnProperty.call(vars, key) && vars[key] !== undefined) {
                next[key] = String(vars[key]);
              }
            }
            return next;
          });
        } catch {
          alert('Could not read theme file. Use JSON exported from this demo (with a cssVariables object).');
        }
      };
      reader.readAsText(file);
    },
    [trackedKeys]
  );

  const alertResults = useCallback((sender: Model) => {
    const results = JSON.stringify(sender.data);
    alert(results);
  }, []);

  useEffect(() => {
    survey.onComplete.add(alertResults);
    return () => {
      survey.onComplete.remove(alertResults);
    };
  }, [survey, alertResults]);

  return (
    <div className={pageStyles.root}>
      <div className={pageStyles.mainRow}>
        <div className={pageStyles.leftColumn}>
          <details className={pageStyles.demoNote} aria-label="Demo tips">
            <summary className={pageStyles.demoNoteSummary}>Try these CSS variables first</summary>
            <div className={pageStyles.demoNoteBody}>
              <p className={pageStyles.demoNoteIntro}>
                Example of variable names. Use the grid to search by name.
              </p>
              <ol className={pageStyles.demoNoteList}>
                {DEMO_THEME_VARIABLE_HINTS.map((hint, index) => (
                  <li key={index}>
                    {hint ? (
                      <>
                        <code className={pageStyles.demoNoteVar}>{hint.variable}</code>
                        {' — '}
                        {hint.description}
                      </>
                    ) : (
                      <span className={pageStyles.demoNotePlaceholder}>
                        Slot {index + 1} — add a variable name and short description when ready.
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </details>
          <div className={pageStyles.surveyPane}>
            <Survey model={survey} />
          </div>
        </div>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize survey and theme variable panels"
          tabIndex={0}
          className={`${pageStyles.splitter}${splitterDragging ? ` ${pageStyles.splitterDragging}` : ''}`}
          onMouseDown={onSplitterMouseDown}
          onKeyDown={onSplitterKeyDown}
        />
        <div
          className={pageStyles.rightColumn}
          style={{ width: rightPaneWidthPx, minWidth: RIGHT_PANE_MIN_PX }}
        >
          <div className={pageStyles.gridToolbar}>
            <input
              ref={themeFileInputRef}
              type="file"
              accept="application/json,.json"
              className={pageStyles.themeFileInput}
              aria-hidden
              tabIndex={-1}
              onChange={onThemeFileChange}
            />
            <button type="button" className={pageStyles.uploadThemeBtn} onClick={onUploadThemePick}>
              Upload theme
            </button>
            <button type="button" className={pageStyles.saveThemeBtn} onClick={saveThemeJson}>
              Save theme JSON
            </button>
          </div>
          <div className={pageStyles.rightScroll}>
            <ThemeVariablesGrid
              variableKeys={trackedKeys}
              values={cssValues}
              varDictionary={varDictionary}
              onChange={onVariableChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
