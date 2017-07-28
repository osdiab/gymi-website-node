
import * as _ from 'lodash';

import { formatMessages } from '../frontend_app/messages';
import unformattedEn from '../frontend_app/messages/en';
import unformattedTranslations from '../frontend_app/messages/translations';

const definedMessages = _.keys(formatMessages(unformattedEn));
for (const lang of _.keys(unformattedTranslations)) {
  const definedTranslations = _.keys(formatMessages(unformattedTranslations[lang]));
  const missing = _.difference(definedMessages, definedTranslations);
  const extraneous = _.difference(definedTranslations, definedMessages);
  console.log(`Language '${lang}'`);
  console.log('----------------');
  console.log('Extra translations (not in en):\n');
  console.log(extraneous);
  console.log('\nMissing translations:\n');
  console.log(missing);
}
