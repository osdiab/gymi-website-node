/**
 * Helpers and constants related to valid usernames
 */
export const MAX_USERNAME_LENGTH = 50;

export function validateUsername(username: string) {
  if (username.length === 0) {
    return 'errors.username.missing';
  }

  if (username.length > MAX_USERNAME_LENGTH) {
    return 'errors.username.tooLong';
  }

  // Numeric usernames would be confused as numeric Ids in the current system,
  // since some functions are flexible to recognize usernames or user IDs.
  if (/^[0-9]*$/.test(username)) {
    return 'errors.username.numeric';
  }

  // Only a basic character set to avoid misleading names.
  if (!/^[a-z0-9_.'-]+$/i.test(username)) {
    return 'errors.username.hasBadCharacters';
  }

  return null;
}
