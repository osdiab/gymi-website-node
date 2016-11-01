import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { ApplicationError } from '../errors';
import usersDb from '../db/users';
import { hashPassword, comparePassword, validatePassword } from './passwords';

const TOKEN_SECRET = 'super secret'; // TODO: make this an env variable

export default {
  authenticate: (req, res, next) => {
    const userIdentifier = req.body.username;
    if (!userIdentifier) {
      throw new ApplicationError('Missing username', 400);
    }
    if (!req.body.password) {
      throw new ApplicationError('Missing password', 400);
    }

    // Security note: from this point on, do not reveal whether the user exists or a password is
    // incorrect.
    usersDb.find(userIdentifier).then((user) => {
      // user does not exist
      if (!user) {
        throw new ApplicationError(401);
      }

      return Promise.all([user, comparePassword(req.body.password, user.password_hash)]);
    }).then(([user, passwordMatches]) => {
      // password is wrong
      if (!passwordMatches) {
        throw new ApplicationError(401);
      }
      res.send(jwt.sign({
        id: user.id, role: user.role,
      }, TOKEN_SECRET, { expiresIn: '7 days' }));
    }).catch(err => next(err));
  },

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

  setCredentials: (req, res) => {
    if (isNaN(req.params.id)) {
      throw new ApplicationError('Invalid user id', 400);
    }
    const userId = parseInt(req.params.id, 10);
    const tokenUserId = res.locals.authData.id;
    if (!req.body.password) {
      throw new ApplicationError('Missing new password', 400);
    }

    if (userId !== tokenUserId) {
      throw new ApplicationError(401);
    }

    const passwordValidation = validatePassword(req.body.password);
    if (!passwordValidation.valid) {
      throw new ApplicationError(passwordValidation.message, 400);
    }

    hashPassword(req.body.password).then(
      hash => usersDb.setPassword(userId, hash)
    ).then(() => res.sendStatus(200));
  },

  assertRole: assertedRoles => (req, res, next) => {
    if (!res.locals.authData) {
      throw new ApplicationError(401);
    }
    const rolesToCheck = _.isArray(assertedRoles) ? assertedRoles : [assertedRoles];
    if (!rolesToCheck.includes(res.locals.authData.role)) {
      throw new ApplicationError(403);
    }
    next();
  },
};
