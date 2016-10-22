import en from './en';
import zh from './zh';

// converts messages as defined in these directories to the format
// expected by react-intl. Instead of array of objects containing a message
// id and a defaultMessage, produces an object whose keys are ids, and values
// are the corresponding defaultMessage.
function formatMessages(messages) {
  const result = {};
  messages.forEach((entry) => {
    if (result.hasOwnProperty(entry.id)) {
      throw new Error(`Duplicate key for message found: '${entry.id}'`);
    }
    if (!entry.defaultMessage) {
      throw new Error(`Missing message for key '${entry.id}'`);
    }
    result[entry.id] = entry.defaultMessage;
  });
  return result;
}

export default {
  en: formatMessages(en),
  zh: formatMessages(zh),
};
