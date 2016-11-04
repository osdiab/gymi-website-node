// Expresses how state related to the display language of the site changes as actions arrive.
// Note: reducers MUST not have side effects, so don't update the state; return a new one.
// The default value is this store's initial values.

import jsCookie from 'js-cookie';
import browserLocale from 'browser-locale';

const isBrowser = typeof window !== 'undefined' && window.document;

export function getSupportedLanguages() {
  return [
    {
      localeCode: 'en',
      shortDisplayName: 'en',
    },
    {
      localeCode: 'zh',
      shortDisplayName: '中文',
    },
  ];
}

export function getDefaultLanguage() {
  return getSupportedLanguages()[0];
}

export function findSupportedLanguage(localeCode) {
  return getSupportedLanguages().find(entry => localeCode.startsWith(entry.localeCode));
}

function fetchStoredLanguage() {
  const storedLanguage = jsCookie.get('language');
  if (!storedLanguage) {
    return undefined;
  }

  const lang = findSupportedLanguage(storedLanguage);
  if (!lang) {
    jsCookie.remove(lang);
    return getDefaultLanguage();
  }
  return lang;
}

function persistCurrentLanguage(lang) {
  jsCookie.set('language', lang.localeCode, { expires: new Date('Jan 2038') });
}

export default function language(state = {}, action) {
  const initialState = {
    currentLanguage: (fetchStoredLanguage()
                      || (isBrowser && findSupportedLanguage(browserLocale()))
                      || getDefaultLanguage()
    ),
    validLanguages: getSupportedLanguages(),
    defaultLanguage: getDefaultLanguage(),
  };
  switch (action.type) {
    case 'SET_CURRENT_LANGUAGE': {
      // verify language
      const lang = findSupportedLanguage(action.localeCode);
      if (!lang) {
        throw new Error(`Cannot set unsupported language: ${action.localeCode}`);
      }

      // persist choice
      persistCurrentLanguage(lang);
      return Object.assign({}, state, { currentLanguage: lang });
    }
    default:
      return Object.assign({}, initialState, state);
  }
}
