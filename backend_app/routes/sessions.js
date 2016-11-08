import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { ApplicationError } from '../errors';
import usersDb, { PUBLIC_USER_FIELDS } from '../db/users';
import { hashPassword, comparePassword } from './crypto';
import { validatePassword } from '../../common/passwords';

const TOKEN_SECRET = 'super secret'; // TODO: make this an env variable
export function generateToken(id, role, cb) {
  return jwt.sign({ id, role }, TOKEN_SECRET, { expiresIn: '7 days' }, cb);
}

export default {
  authenticate: (req, res, next) => {
    const requiredFields = ['username', 'password'];
    const userIdentifier = req.body.username;
    if (!userIdentifier) {
      next(new ApplicationError('Missing required fields', 400, {
        requiredFields, missing: ['username'],
      }));
      return;
    }
    if (!req.body.password) {
      next(new ApplicationError('Missing required fields', 400, {
        requiredFields, missing: ['password'],
      }));
      return;
    }

    // Security note: from this point on, do not reveal whether the user exists or a password is
    // incorrect.
    usersDb.find(userIdentifier, true).then((user) => {
      // user does not exist
      if (!user) {
        return Promise.reject(new ApplicationError('Invalid credentials', 401));
      }

      return Promise.all([user, comparePassword(req.body.password, user.passwordHash)]);
    }).then(([user, passwordMatches]) => {
      // password is wrong
      if (!passwordMatches) {
        return Promise.reject(new ApplicationError('Invalid credentials', 401));
      }

      return new Promise((resolve, reject) => {
        generateToken(user.id, user.role, (err, token) => {
          if (err) {
            reject(err);
            return;
          }

          res.send({
            message: 'success',
            data: {
              token,
              user: _.pick(user, PUBLIC_USER_FIELDS),
            },
          });
          resolve();
        });
      });
    }).catch(next);
  },

  // middleware that verifies that a token is present and is legitimate.
  verify: (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next(new ApplicationError('Missing Authorization header with Bearer token', 401));
      return;
    }

    const token = authHeader.substring('Bearer '.length);
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) {
        next(new ApplicationError('Could not verify token', 401));
        return;
      }

      res.locals.authData = decoded; // eslint-disable-line no-param-reassign
      next();
    });
  },

  // same as verify, but just continues if not present rather than throwing an error.
  populate: (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring('Bearer '.length);
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) {
        next();
        return;
      }
      res.locals.authData = decoded; // eslint-disable-line no-param-reassign
      next();
    });
  },

  setCredentials: (req, res, next) => {
    const requiredFields = ['userId', 'newPassword'];
    if (!req.params.userId) {
      next(new ApplicationError('Missing required fields', 400, {
        requiredFields, missing: ['userId'],
      }));
      return;
    }

    if (!req.body.password) {
      next(new ApplicationError('Missing required fields', 400, {
        requiredFields, missing: ['newPassword'],
      }));
      return;
    }

    if (isNaN(req.params.userId)) {
      next(new ApplicationError('Invalid userId', 400));
      return;
    }
    const userId = parseInt(req.params.userId, 10);
    const tokenUserId = res.locals.authData.id;

    if (userId !== tokenUserId) {
      next(new ApplicationError('Forbidden', 403));
      return;
    }

    const passwordValidation = validatePassword(req.body.password);
    if (!passwordValidation.valid) {
      next(new ApplicationError(passwordValidation.message, 400));
      return;
    }

    hashPassword(req.body.password).then(
      hash => usersDb.setPassword(userId, hash)
    ).then(() => res.sendStatus(204));
  },

  assertRole: assertedRoles => (req, res, next) => {
    if (!res.locals.authData) {
      next(new ApplicationError('Unauthorized', 401));
      return;
    }
    const rolesToCheck = _.isArray(assertedRoles) ? assertedRoles : [assertedRoles];
    if (!rolesToCheck.includes(res.locals.authData.role)) {
      next(new ApplicationError('Forbidden', 403));
      return;
    }
    next();
  },
};
