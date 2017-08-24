/**
 * Helpers and types for users
 */

import {Id} from 'common/entities';
import {Role} from 'common/roles';

export type User = {
  id: Id,
  username: string,
  role: Role,
  name: string
};
