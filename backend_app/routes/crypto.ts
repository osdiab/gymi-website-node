import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 10;

export function comparePassword(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, match) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(match);
    });
  });
}

export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, BCRYPT_ROUNDS, (err, hash) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(hash);
    });
  });
}
