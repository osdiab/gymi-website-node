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

export default db;
