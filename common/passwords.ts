/**
 * Common definitions and helpers for passwords
 */
export const MIN_PASSWORD_LENGTH = 5;
export const MAX_PASSWORD_LENGTH = 50;

export function validatePassword(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return 'errors.password.tooShort';
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return 'errors.password.tooLong';
  }

  // check if ASCII characters that aren't control codes. ' ' and '~' form the
  // bounds for the character codes, so check the range in between them
  if (!/^[ -~]+$/.test(password)) {
    return 'errors.password.hasBadCharacters';
  }

  return null;
}
