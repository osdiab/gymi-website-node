import _ from 'lodash';

import en from './en';
import unformattedTranslations from './translations';

// converts messages as defined in these directories to the format
// expected by react-intl. Instead of array of objects containing a message
// id and a defaultMessage, produces an object whose keys are ids, and values
// are the corresponding defaultMessage.
//
// nested flag causes periods in ids to create nested objects. For instance, an entry with id
// HomePage.about.title would create an object of this structure:
// {
//   HomePage: {
//     about: {
//       title: { //... }
//     }
//   }
// }
//
// preserveFullMessages makes the values contain a full message object instead of just the
// defaultMessage.
export function formatMessages(messages, nested = false, preserveFullMessages = false) {
  const result = {};
  messages.forEach((entry) => {
    const value = preserveFullMessages ? entry : entry.defaultMessage;
    if (nested) {
      _.set(result, entry.id, value);
    } else {
      result[entry.id] = value;
    }
  });
  return result;
}

export default formatMessages(en, true, true);
export const translations = _.mapValues(
  unformattedTranslations, messages => formatMessages(messages)
);
