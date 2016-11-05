import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { ApplicationError } from '../errors';
import usersDb from '../db/users';
import { hashPassword, comparePassword, validatePassword } from './passwords';

const TOKEN_SECRET = 'super secret'; // TODO: make this an env variable

export default {
  authenticate: (req, res, next) => {
    const requiredFields = ['username', 'password'];
    const userIdentifier = req.body.username;
    if (!userIdentifier) {
      throw new ApplicationError('Missing required fields', 400, {
        requiredFields, missing: ['username'],
      });
    }
    if (!req.body.password) {
      throw new ApplicationError('Missing required fields', 400, {
        requiredFields, missing: ['password'],
      });
    }

    // Security note: from this point on, do not reveal whether the user exists or a password is
    // incorrect.
    usersDb.find(userIdentifier, true).then((user) => {
      // user does not exist
      if (!user) {
        throw new ApplicationError('Invalid credentials', 401);
      }

      return Promise.all([user, comparePassword(req.body.password, user.password_hash)]);
    }).then(([user, passwordMatches]) => {
      // password is wrong
      if (!passwordMatches) {
        throw new ApplicationError('Invalid credentials', 401);
      }
      res.send({
        message: 'success',
        data: {
          token: jwt.sign({ id: user.id, role: user.role }, TOKEN_SECRET, { expiresIn: '7 days' }),
        },
      });
    }).catch(next);
  },

  // middleware that verifies that a token is present and is legitimate.
  verify: (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApplicationError('Missing Authorization header with Bearer token', 401);
    }

    const token = authHeader.substring('Bearer '.length);
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) {
        throw new ApplicationError('Could not verify token', 401);
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

  setCredentials: (req, res) => {
    const requiredFields = ['id', 'newPassword'];
    if (!req.params.id) {
      throw new ApplicationError('Missing required fields', 400, {
        requiredFields, missing: ['id'],
      });
    }

    if (!req.body.password) {
      throw new ApplicationError('Missing required fields', 400, {
        requiredFields, missing: ['password'],
      });
    }

    if (isNaN(req.params.id)) {
      throw new ApplicationError('Invalid user id', 400);
    }
    const userId = parseInt(req.params.id, 10);
    const tokenUserId = res.locals.authData.id;

    if (userId !== tokenUserId) {
      throw new ApplicationError('Forbidden', 403);
    }

    const passwordValidation = validatePassword(req.body.password);
    if (!passwordValidation.valid) {
      throw new ApplicationError(passwordValidation.message, 400);
    }

    hashPassword(req.body.password).then(
      hash => usersDb.setPassword(userId, hash)
    ).then(() => res.sendStatus(204));
  },

  assertRole: assertedRoles => (req, res, next) => {
    if (!res.locals.authData) {
      throw new ApplicationError('Unauthorized', 401);
    }
    const rolesToCheck = _.isArray(assertedRoles) ? assertedRoles : [assertedRoles];
    if (!rolesToCheck.includes(res.locals.authData.role)) {
      throw new ApplicationError('Forbidden', 403);
    }
    next();
  },
};
