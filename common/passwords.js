export const MIN_PASSWORD_LENGTH = 5;
export const MAX_PASSWORD_LENGTH = 50;

export function validatePassword(password) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      message: 'errors.sessions.passwordTooShort',
    };
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return {
      valid: false,
      message: 'errors.sessions.passwordTooLong',
    };
  }

  if (!/^[\x00-\x7F]*$/.test(password)) {
    return {
      valid: false,
      message: 'errors.sessions.passwordHasBadCharacters',
    };
  }
  return {
    valid: true,
  };
}
