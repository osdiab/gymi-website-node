/**
 * Endpoints reltaed to accessing, creating and updating users, including their
 * credentials.
 */
import {NextFunction, Request, Response} from 'express';
import * as _ from 'lodash';

import usersDb, { Role, VALID_LIST_FILTERS } from 'backend/db/users';
import { ApplicationError } from 'backend/errors';
import { generateToken } from 'backend/routes/sessions';
import { hashPassword } from 'backend/utils/crypto';
import { validatePassword } from 'common/passwords';

const VALID_ROLES = [
  'student',
  'teacher',
  'admin'
];

export default {
  list: (req: Request, res: Response) => {
    const filters = req.body.filters ? _.pick(req.body.filters, VALID_LIST_FILTERS) : {};
    usersDb.list(filters).then((users) => {
      res.send({ data: users });
    });
  },
  find: (req: Request, res: Response, next: NextFunction) => {
    const requiredFields = ['identifier'];
    const values: {
      identifier: string
    } = _.pick(req.params, requiredFields);

    if (_(values).omitBy(_.isEmpty).size() < requiredFields.length) {
      next(new ApplicationError('Missing required fields', 400, {
        requiredFields
      }));

      return;
    }
    usersDb.find(values.identifier).then((user) => {
      res.send({ data: user });
    }).catch(next);
  },
  create: (req: Request, res: Response, next: NextFunction) => {
    const requiredFields = ['username', 'password', 'name', 'role'];
    const values: {
      username: string,
      password: string,
      name: string,
      role: Role
    } = _.pick(req.body, requiredFields);
    const { username, password, name, role } = values;
    if (_(values).omitBy(_.isEmpty).size() < requiredFields.length) {
      next(new ApplicationError('Missing required fields', 400, {
        requiredFields
      }));

      return;
    }

    const passwordValidationError = validatePassword(req.body.password);
    if (passwordValidationError) {
      next(new ApplicationError('Invalid password', 400, {
        message: passwordValidationError
      }));

      return;
    }

    if (!VALID_ROLES.includes(role)) {
      next(new ApplicationError('Invalid role', 400, {
        validRoles: VALID_ROLES
      }));

      return;
    }

    // Only admins can create non-admin accounts
    if (role === 'admin') {
      if (!res.locals.authData || res.locals.authData.role !== 'admin') {
        next(new ApplicationError('Unauthorized', 401));

        return;
      }
    }

    hashPassword(password).then(hash => usersDb.create(username, hash, name, role))
    .then((id) => {
      const user = { id, username, name, role };

      // if user is already logged in, they are making an account on someone else's behalf - don't
      // send the token.
      if (res.locals.authData) {
        return { user };
      }

      return new Promise((resolve, reject) =>
        generateToken(id, role, (err, token) => (err ? reject(err) : resolve({ user, token })))
      );
    })
    .then(data => res.send({ data }))
    .catch(next);
  }
};
