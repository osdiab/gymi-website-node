/**
 * Provides a handle to the application-wide database instance, based on the
 * configuration provided in `config`.
 */

import config from 'backend/config';
import * as pgPromise from 'pg-promise';

const db = pgPromise()({
  ...config.database,
  ssl: true
});

/**
 * Represents an ID in the database. Right now they are auto-incrementing
 * integers, hence the `number` type.
 */
export type Id = number;

export default db;
