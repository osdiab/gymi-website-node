// TODO: don't throw ApplicationErrors from here, db shouldn't know about app logic
import _ from 'lodash';

import db from './';
import { ApplicationError } from '../errors';

const PUBLIC_USER_FIELDS = ['id', 'username', 'role', 'name'];
// flexible find function—can search for id or username.
// Returns one entry, or null.
const find = (identifier, getPasswordHash = false) => new Promise((resolve, reject) => {
  const columns = getPasswordHash ? PUBLIC_USER_FIELDS.concat('password_hash') :
    PUBLIC_USER_FIELDS;
  const clause = isNaN(identifier) ? 'username = $<identifier>' : 'id = $<identifier>';
  const query = `SELECT $<columns:name> FROM users WHERE ${clause}`;

  return db.oneOrNone(query, { columns, identifier }).then(resolve).catch(reject);
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
      'INSERT INTO users (username, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, passwordHash, name, role],
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
            clause: 'INNER JOIN primary_user_topics ON users.id = primary_user_topics.user_id AND ' +
              'primary_user_topics.topic_id IN $<primaryInterests:csv>',
            value,
          };
        case 'period':
          return {
            key: 'periods',
            clause: 'INNER JOIN active_users ON users.id = active_users.user_id AND ' +
              'active_users.period_id IN $<periods:csv>',
            value,
          };
        default:
          return null;
      }
    }).compact()
    .value();

    const completeClauses = whereClauses.map(entry => entry.clause).join(' ');
    const query = `SELECT users.id, users.username FROM users ${completeClauses}`;
    const queryArgs = _.chain(whereClauses).mapKeys('key').mapValues('value').value();

    return db.manyOrNone(query, queryArgs).then(resolve).catch(reject);
  }),
  setPassword: (id, newPasswordHash) => new Promise((resolve, reject) => {
    db.one(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [newPasswordHash, id]
    ).then(resolve).catch(reject);
  }),

};
export const VALID_LIST_FILTERS = ['primaryInterest', 'period'];
