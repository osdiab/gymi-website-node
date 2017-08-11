/**
 * Messages related to errors in the frontend application
 */

import newSubmission from 'frontend/messages/en/errors/newSubmission';
import password from 'frontend/messages/en/errors/password';
import sessions from 'frontend/messages/en/errors/sessions';
import username from 'frontend/messages/en/errors/username';

export default [
  ...sessions,
  ...username,
  ...password,
  ...newSubmission,
  {
    id: 'errors.unexpected',
    defaultMessage: 'Sorry, something went wrong! Please try again.'
  },
  {
    id: 'errors.required',
    defaultMessage: 'Required'
  },
  {
    id: 'errors.invalidEmail',
    defaultMessage: 'Invalid email address'
  },
  {
    id: 'errors.noneFound',
    defaultMessage: 'None found'
  }
];
