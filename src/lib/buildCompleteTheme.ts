import * as SurveyTheme from 'survey-core/themes';

function parsePanellessFromCssVariables(vars: Record<string, string>): boolean {
  const raw = vars['--sjs2-is-panelless'];
  if (raw === undefined) return false;
  const v = raw.trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}

/**
 * Deep-clones `SurveyTheme.DefaultLight`, merges edited `cssVariables`, and fills every
 * `ITheme` scalar the bundled theme object often omits so exports / tooling get a complete JSON shape.
 */
export function buildCompleteDefaultLightTheme(
  cssValueOverrides: Readonly<Record<string, string>>
): Record<string, unknown> {
  const source = SurveyTheme.DefaultLight as Record<string, unknown>;
  const theme = JSON.parse(JSON.stringify(source)) as Record<string, unknown>;

  const baseVars = { ...(source.cssVariables as Record<string, string>) };
  const mergedVars: Record<string, string> = { ...baseVars, ...cssValueOverrides };
  theme.cssVariables = mergedVars;

  if (theme.colorPalette === undefined || theme.colorPalette === null) {
    theme.colorPalette = theme.isLight === false ? 'dark' : 'light';
  }

  theme.isPanelless = parsePanellessFromCssVariables(mergedVars);

  if (theme.backgroundImage === undefined || theme.backgroundImage === null) {
    theme.backgroundImage = '';
  }
  if (theme.backgroundImageFit === undefined || theme.backgroundImageFit === null) {
    theme.backgroundImageFit = 'cover';
  }
  if (theme.backgroundImageAttachment === undefined || theme.backgroundImageAttachment === null) {
    theme.backgroundImageAttachment = 'scroll';
  }
  if (theme.backgroundOpacity === undefined || theme.backgroundOpacity === null) {
    theme.backgroundOpacity = 1;
  }
  if (theme.headerView === undefined || theme.headerView === null) {
    theme.headerView = 'basic';
  }

  return theme;
}
