/* eslint-disable max-len */
import sessions from './sessions';
import newSubmission from './newSubmission';

export default [
  ...sessions,
  ...newSubmission,
  {
    id: 'errors.unexpected',
    defaultMessage: 'Sorry, something went wrong! Please try again.',
  },
];
