import db from './';

export default {
  // flexible find function—can search for id or username.
  find: identifier => new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE id = ? OR username = ?',
      identifier,
      identifier,
      (err, result) => {
        if (err) {
          reject(new Error('Could not execute query'));
          return;
        }
        resolve(result);
      },
    );
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
