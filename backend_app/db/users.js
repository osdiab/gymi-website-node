import db from './';

export default {
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
};
