import _ from 'lodash';

import db from './';
import { ApplicationError } from '../errors';

// flexible find function—can search for id or username.
// TODO: don't throw ApplicationErrors from here, db shouldn't know about app logic
const find = identifier => new Promise((resolve, reject) => {
  db.get(
    'select * from users where id = ? or username = ?',
    identifier,
    identifier,
    (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    },
  );
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
    }).then(() => {
      db.run('BEGIN');
      db.run(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        username,
        passwordHash,
        function afterUserInsertion(err) {
          if (err) {
            db.run('ROLLBACK');
            throw err;
          }
          const newUserId = this.lastID;

          db.run(
            'INSERT INTO user_profiles (user_id, name, role) VALUES (?, ?, ?)',
            newUserId,
            name,
            role,
            (insertProfileErr) => {
              if (insertProfileErr) {
                db.run('ROLLBACK');
                throw err;
              }
              db.run('COMMIT');
              resolve(newUserId);
            }
          );
        }
      );
    }).catch(err => reject(err));
  }),

  find,
  list: (filters = {}) => new Promise((resolve, reject) => {
    const whereClauses = _.chain(filters).mapValues(
      val => (_.isArray(val) ? val : [val])
    ).map((value, key) => {
      switch (key) {
        case 'primaryInterest':
          return {
            clause: 'INNER JOIN primary_user_topics ON users.id = primary_user_topics.user_id AND ' +
              'primary_user_topics.topic_id IN ?',
            value,
          };
        case 'period':
          return {
            clause: 'INNER JOIN active_users ON users.id = active_users.user_id AND ' +
              'active_users.period_id IN ?',
            value,
          };
        default:
          return null;
      }
    }).compact()
    .value();

    const completeClauses = whereClauses.map(entry => entry.clause).join(' ');
    const query = `SELECT users.id, users.username FROM users ${completeClauses}`;
    const queryArgs = whereClauses.map(entry => entry.value);

    db.get.apply(this, _.flatten([query, queryArgs, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    }]));
  }),
  setPassword: (id, newPasswordHash) => new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      newPasswordHash,
      id,
      function handlePasswordSet(err) {
        if (err) {
          reject(new Error('Could not persist password'));
          return;
        }
        if (this.changes < 1) {
          reject(new Error('No user to persist'));
          return;
        }
        resolve();
      }
    );
  }),

};
export const VALID_LIST_FILTERS = ['primaryInterest', 'period'];
