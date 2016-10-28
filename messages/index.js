import zh from './zh';

// converts messages as defined in these directories to the format
// expected by react-intl. Instead of array of objects containing a message
// id and a defaultMessage, produces an object whose keys are ids, and values
// are the corresponding defaultMessage.
function formatMessages(messages) {
  const result = {};
  messages.forEach((entry) => {
    result[entry.id] = entry.defaultMessage;
  });
  return result;
}

export default {
  zh: formatMessages(zh),
};
