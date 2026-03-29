declare module 'survey-core/themes' {
  export interface SurveyJsThemeExport {
    themeName?: string;
    iconSet?: string;
    isLight?: boolean;
    cssVariables?: Record<string, string>;
    [key: string]: unknown;
  }

  export const DefaultLight: SurveyJsThemeExport;
  export const DefaultDark: SurveyJsThemeExport;
}
