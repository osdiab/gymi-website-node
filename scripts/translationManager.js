// translationRunner.js
import manageTranslations from 'react-intl-translations-manager';

manageTranslations({
  messagesDirectory: 'messages/build/',
  translationsDirectory: 'messages/translations/',
  languages: ['zh'], // any language you need
});
