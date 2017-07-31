/**
 * Handlers for methods related to sessions, i.e. records of logging in and out.
 */
import {fromCallback} from 'bluebird';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

import {NextFunction, Request, Response} from 'express';

import {Id} from 'backend/db';
import usersDb, { PUBLIC_USER_FIELDS, Role, toPublicUser } from 'backend/db/users';
import { ApplicationError } from 'backend/errors';
import { comparePassword, hashPassword } from 'backend/utils/crypto';
import { validatePassword } from 'common/passwords';

// tslint:disable-next-line
const TOKEN_SECRET = 'super secret'; // TODO: make this an env variable
export async function generateToken(id: Id, role: Role) {
  return await fromCallback((cb) =>
    jwt.sign({ id, role }, TOKEN_SECRET, { expiresIn: '7 days' }, cb));
}

export default {
  authenticate: async (req: Request, res: Response, next: NextFunction) => {
    const requiredFields = ['username', 'password'];
    const userIdentifier = req.body.username;
    if (!userIdentifier) {
      next(new ApplicationError('Missing required fields', 400, {
        requiredFields, missing: ['username']
      }));

      return;
    }
    if (!req.body.password) {
      next(new ApplicationError('Missing required fields', 400, {
        requiredFields, missing: ['password']
      }));

      return;
    }

    // Security note: from this point on, do not reveal whether the user exists or a password is
    // incorrect.
    const user = await usersDb.find(userIdentifier, true);
    if (!user) {
      // user does not exist
      throw new ApplicationError('Invalid credentials', 401);
    }

    const passwordMatches = await comparePassword(req.body.password, user.passwordHash);
    // password is wrong
    if (!passwordMatches) {
      throw new ApplicationError('Invalid credentials', 401);
    }

    const token = await generateToken(user.id, user.role);
    res.send({
      message: 'success',
      data: { token, user: toPublicUser(user) }
    });
  },

  // middleware that verifies that a token is present and is legitimate.
  verify: (req: Request, res: Response, next: NextFunction) => {
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

      res.locals.authData = decoded;
      next();
    });
  },

  // same as verify, but just continues if not present rather than throwing an error.
  populate: (req: Request, res: Response, next: NextFunction) => {
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
      res.locals.authData = decoded;
      next();
    });
  },

  setCredentials: (req: Request, res: Response, next: NextFunction) => {
    const requiredFields = ['userId', 'newPassword'];
    if (!req.params.userId) {
      next(new ApplicationError('Missing required fields', 400, {
        requiredFields, missing: ['userId']
      }));

      return;
    }

    if (!req.body.password) {
      next(new ApplicationError('Missing required fields', 400, {
        requiredFields, missing: ['newPassword']
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

    const passwordValidationError = validatePassword(req.body.password);
    if (passwordValidationError) {
      next(new ApplicationError(passwordValidationError, 400));

      return;
    }

    hashPassword(req.body.password).then(
      hash => usersDb.setPassword(userId, hash)
    ).then(() => res.sendStatus(204));
  },

  /**
   * Not an endpoint in itself, but rather a middleware to enforce that the
   * logged in user has one of the specified roles.
   */
  assertRole: (assertedRoles: Role | Role[]) =>
    (req: Request, res: Response, next: NextFunction) => {
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
    }
};
