/**
 * Defines convenience methods for crypto functions
 */
import * as bcrypt from 'bcryptjs';
import {promisify} from 'bluebird';

const BCRYPT_ROUNDS = 10;
const bcryptHash = promisify(bcrypt.hash);

export function comparePassword(password: string, hash: string) {
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

export async function hashPassword(password: string) {
  return await bcryptHash(password, BCRYPT_ROUNDS);
}
