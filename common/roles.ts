/**
 * Helpers and constants related to user roles.
 */

/**
 * Types of roles a user can have
 */
export enum Role {
  student = 'student',
  teacher = 'teacher',
  admin = 'admin'
}

/**
 * Types of roles, expressed as an array of strings
 */
export const VALID_ROLES = Object.keys(Role).map((k: keyof typeof Role) => Role[k]);
