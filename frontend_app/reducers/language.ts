/**
 * Expresses how state related to the display language of the site changes as actions arrive.
 */

import * as browserLocale from 'browser-locale';
import * as jsCookie from 'js-cookie';
import {Reducer} from 'redux';

const isBrowser = !!(window !== undefined && window.document);

export const LANGUAGE_KEY = 'language.currentLanguage';
export type SupportedLanguage = 'en' | 'zh';
const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'zh'];

export type Action = {
  type: 'SET_CURRENT_LANGUAGE',
  localeCode: SupportedLanguage
};

interface ILanguageMetadata {
  readonly localeCode: string;
  readonly shortDisplayName: string;
}

export function getLanguageMetadata(
  localeCode: string
): ILanguageMetadata | null {
  switch (localeCode.substring(0, 2)) {
    case 'en':
      return {
        localeCode: 'en',
        shortDisplayName: 'en'
      };
    case 'zh':
      return {
        localeCode: 'zh',
        shortDisplayName: '中文'
      };
    default:
      return null;
  }
}

export function getDefaultLanguage() {
  return <ILanguageMetadata>getLanguageMetadata('en');
}

function fetchStoredLanguage() {
  if (!isBrowser) {
    return null;
  }

  const storedLanguage = jsCookie.get(LANGUAGE_KEY) || localStorage.getItem(LANGUAGE_KEY);
  if (!storedLanguage) {
    return null;
  }

  const lang = getLanguageMetadata(storedLanguage);
  if (lang === null) {
    jsCookie.remove(LANGUAGE_KEY);
    localStorage.remove(LANGUAGE_KEY);

    return getDefaultLanguage();
  }
}

function persistCurrentLanguage(lang: ILanguageMetadata) {
  jsCookie.set(LANGUAGE_KEY, lang.localeCode, { expires: new Date('Jan 2038') });
  localStorage.setItem(LANGUAGE_KEY, lang.localeCode);
}

export interface IState {
  readonly currentLanguage: ILanguageMetadata;
  readonly validLanguages: SupportedLanguage[];
  readonly defaultLanguage: ILanguageMetadata;
}

const initialState: IState = {
  currentLanguage: (fetchStoredLanguage()
                    || (isBrowser && getLanguageMetadata(browserLocale()))
                    || getDefaultLanguage()
  ),
  validLanguages: SUPPORTED_LANGUAGES,
  defaultLanguage: getDefaultLanguage()
};

const language: Reducer<IState> = (
  state: IState = initialState,
  action: Action
): IState => {
  switch (action.type) {
    case 'SET_CURRENT_LANGUAGE': {
      // verify language
      const lang = getLanguageMetadata(action.localeCode);
      if (!lang) {
        throw new Error(`Cannot set unsupported language: ${action.localeCode}`);
      }

      // persist choice
      persistCurrentLanguage(lang);

      return {...state, currentLanguage: lang};
    }
    default: {
      return state;
    }
  }
};

export default language;
