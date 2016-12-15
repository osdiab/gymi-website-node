// TODO: don't throw ApplicationErrors from here, db shouldn't know about app logic
import _ from 'lodash';

import db from './';
import { ApplicationError } from '../errors';

export const PUBLIC_USER_FIELDS = ['id', 'username', 'role', 'name'];

// flexible find function—can search for id or username.
// Returns one entry, or null.
const find = (identifier, getPasswordHash = false) => new Promise((resolve, reject) => {
  const columns = getPasswordHash ? PUBLIC_USER_FIELDS.concat('passwordHash') :
    PUBLIC_USER_FIELDS;
  const clause = isNaN(identifier) ? '"normalizedUsername" = $<id>' : 'id = $<id>';
  const query = `SELECT $<columns:name> FROM users WHERE ${clause}`;

  return db.oneOrNone(query, { columns, id: identifier.toLowerCase() }).then(resolve).catch(reject);
});

export default {
  create: (username, passwordHash, name, role) => new Promise((resolve, reject) => {
    if (!isNaN(username)) {
      reject(new ApplicationError('Username cannot be a number', 400));
      return;
    }

    find(username).then((user) => {
      if (user) {
        return Promise.reject(new ApplicationError('User already exists', 400));
      }
      return null;
    }).then(() => db.one(
      'INSERT INTO users (username, "normalizedUsername", "passwordHash", name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [username, username.toLowerCase(), passwordHash, name, role],
    )).then(({ id }) => resolve(id))
    .catch(reject);
  }),

  find,
  list: (filters = {}) => new Promise((resolve, reject) => {
    const normalizedFilters = _.chain(filters).mapValues(
      val => (_.isArray(val) ? val : [val])
    );
    const whereClauses = normalizedFilters.map((value, key) => {
      switch (key) {
        case 'primaryInterest':
          return {
            key: 'primaryInterests',
            clause: '"topicId" IN ($<primaryInterests:csv>)',
            value,
          };
        case 'period':
          return {
            key: 'periods',
            clause: '"periodId" IN ($<periods:csv>)',
            value,
          };
        default:
          return null;
      }
    }).compact()
    .value();

    const columns = PUBLIC_USER_FIELDS.concat(
      '"topicId" AS "primaryInterestId"',
      '"periodId"',
    );
    const completeClauses = whereClauses.map(entry => entry.clause).join(' AND ');
    const query = `
      SELECT ${columns.join(', ')}
      FROM users
      LEFT OUTER JOIN "primaryUserInterests" ON "primaryUserInterests"."userId" = users.id
      LEFT OUTER JOIN "activeUsers" ON "activeUsers"."userId" = users.id
      ${completeClauses.length > 0 ? `WHERE ${completeClauses}` : ''}`;
    const queryArgs = _.chain(whereClauses).mapKeys('key').mapValues('value').value();

    return db.manyOrNone(query, queryArgs).then((results) => {
      // query returns redundant entries with different periods;
      // combine the periods active into an array
      const combined = results.reduce((memo, entry) => {
        if (memo[entry.id]) {
          const updatedEntry = memo[entry.id];
          updatedEntry.periodsActive = updatedEntry.periodsActive.concat(entry.periodId);
          return Object.assign({}, memo, { [entry.id]: updatedEntry });
        }

        const newEntry = _.omit(entry, ['periodId']);
        newEntry.periodsActive = entry.periodId === null ? [] : [entry.periodId];
        return Object.assign({}, memo, { [entry.id]: newEntry });
      }, {});
      resolve(_.values(combined));
    }).catch(reject);
  }),
  setPassword: (id, newPasswordHash) => new Promise((resolve, reject) => {
    db.one(
      'UPDATE users SET "passwordHash" = $1 WHERE id = $2',
      [newPasswordHash, id]
    ).then(resolve).catch(reject);
  }),

};
export const VALID_LIST_FILTERS = ['primaryInterest', 'period'];
