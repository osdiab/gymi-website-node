export const VALID_ROLES = [
  'admin', 'teacher', 'student',
];

export function validateRole(role) {
  if (!VALID_ROLES.includes(role)) {
    return 'errors.roles.invalidRole';
  }

  return null;
}
