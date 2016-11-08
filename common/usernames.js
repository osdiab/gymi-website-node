export const MAX_USERNAME_LENGTH = 50;

export function validateUsername(username) {
  if (username.length === 0) {
    return 'errors.username.missing';
  }

  if (username.length > MAX_USERNAME_LENGTH) {
    return 'errors.username.tooLong';
  }

  if (/^[0-9]*$/.test(username)) {
    return 'errors.username.numeric';
  }

  if (!/^[a-z0-9_.'-]+$/i.test(username)) {
    return 'errors.username.hasBadCharacters';
  }

  return null;
}
