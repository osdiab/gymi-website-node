export const MIN_PASSWORD_LENGTH = 5;
export const MAX_PASSWORD_LENGTH = 50;

export function validatePassword(password) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return 'errors.password.tooShort';
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return 'errors.password.tooLong';
  }

  if (!/^[\x00-\x7F]*$/.test(password)) {
    return 'errors.password.hasBadCharacters';
  }

  return null;
}
