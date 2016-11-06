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
      throw new ApplicationError('Username cannot be a number', 400);
    }

    find(username).then((user) => {
      if (user) {
        throw new ApplicationError('User already exists', 400);
      }
      return;
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
            clause: 'INNER JOIN "primaryUserTopics" ON users.id = "primaryUserTopics"."userId" AND ' +
              '"primaryUserTopics"."topicId" IN $<primaryInterests:csv>',
            value,
          };
        case 'period':
          return {
            key: 'periods',
            clause: 'INNER JOIN "activeUsers" ON users.id = "activeUsers"."userId" AND ' +
              '"activeUsers"."periodId" IN $<periods:csv>',
            value,
          };
        default:
          return null;
      }
    }).compact()
    .value();

    const completeClauses = whereClauses.map(entry => entry.clause).join(' ');
    const query = `SELECT $<columns:name> FROM users ${completeClauses}`;
    const queryArgs = _.chain(whereClauses).mapKeys('key').mapValues('value').value();

    return db.manyOrNone(query, Object.assign({ columns: PUBLIC_USER_FIELDS }, queryArgs))
      .then(resolve).catch(reject);
  }),
  setPassword: (id, newPasswordHash) => new Promise((resolve, reject) => {
    db.one(
      'UPDATE users SET "passwordHash" = $1 WHERE id = $2',
      [newPasswordHash, id]
    ).then(resolve).catch(reject);
  }),

};
export const VALID_LIST_FILTERS = ['primaryInterest', 'period'];
