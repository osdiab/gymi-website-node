/**
 * Represents a language, useful for internationalization.
 */

/**
 * Locale codes of supported languages in this app
 */
export type SupportedLocaleCode = 'en' | 'zh';

/**
 * Representation of a language and how it ought to be displayed.
 */
export type Language = {
  localeCode: SupportedLocaleCode;
  shortDisplayName: string;
};
