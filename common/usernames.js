export const MAX_USERNAME_LENGTH = 50;

export function validateUsername(username) {
  if (username.length === 0) {
    return {
      valid: false,
      message: 'errors.sessions.usernameMissing',
    };
  }

  if (username.length > MAX_USERNAME_LENGTH) {
    return {
      valid: false,
      message: 'errors.sessions.usernameTooLong',
    };
  }

  if (/^[0-9]*$/.test(username)) {
    return {
      valid: false,
      message: 'errors.sessions.usernameNumeric',
    };
  }

  if (!/^[a-z0-9_.'-]+$/i.test(username)) {
    return {
      valid: false,
      message: 'errors.sessions.usernameHasBadCharacters',
    };
  }

  return {
    valid: true,
  };
}
