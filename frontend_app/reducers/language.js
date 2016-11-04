// Expresses how state related to the display language of the site changes as actions arrive.
// Note: reducers MUST not have side effects, so don't update the state; return a new one.
// The default value is this store's initial values.

let browserLocale = require('browser-locale');

if (!(typeof window !== 'undefined' && window.document)) {
  browserLocale = () => 'en';
}

export function getValidLanguages() {
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
  return getValidLanguages()[0];
}

export function findSupportedLanguage(localeCode, validLanguages) {
  return validLanguages.find(entry => localeCode.startsWith(entry.localeCode));
}

function fetchStoredLanguage() {
  if (!(typeof window !== 'undefined' && window.document)) return undefined;
  const storedLanguage = localStorage.getItem('state.language.currentLanguage');
  if (!storedLanguage) {
    return undefined;
  }
  return JSON.parse(storedLanguage);
}

function persistCurrentLanguage(lang) {
  if (!(typeof window !== 'undefined' && window.document)) return undefined;
  return localStorage.setItem('state.language.currentLanguage',
                              JSON.stringify(lang));
}

export default function language(state = {
  currentLanguage: (fetchStoredLanguage()
                    || findSupportedLanguage(browserLocale(), getValidLanguages())
                    || getDefaultLanguage()
  ),
  validLanguages: getValidLanguages(),
  defaultLanguage: getDefaultLanguage(),
}, action) {
  switch (action.type) {
    case 'SET_CURRENT_LANGUAGE': {
      // verify language
      const lang = findSupportedLanguage(action.localeCode, state.validLanguages);
      if (!lang) {
        throw new Error(`Cannot set unsupported language: ${action.localeCode}`);
      }

      // persist choice
      persistCurrentLanguage(lang);
      return Object.assign({}, state, { currentLanguage: lang });
    }
    default:
      return state;
  }
}
