import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 5;

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

export function validatePassword(password) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      message: 'Password too short',
    };
  }
  return {
    valid: true,
  };
}
