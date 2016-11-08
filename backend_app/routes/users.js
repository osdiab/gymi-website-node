import _ from 'lodash';

import { generateToken } from './sessions';
import usersDb, { VALID_LIST_FILTERS } from '../db/users';
import { ApplicationError } from '../errors';
import { hashPassword } from './crypto';
import { validatePassword } from '../../common/passwords';

const VALID_ROLES = [
  'student',
  'teacher',
  'admin',
];

export default {
  list: (req, res) => {
    const filters = req.body.filters ? _.pick(req.body.filters, VALID_LIST_FILTERS) : {};
    usersDb.list(filters).then((users) => {
      res.send({ data: users });
    });
  },
  find: (req, res, next) => {
    const requiredFields = ['identifier'];
    const values = _.pick(req.params, requiredFields);
    if (_.size(_.omitBy(values, _.isEmpty)) < requiredFields.length) {
      throw new ApplicationError('Missing required fields', 400, {
        requiredFields,
      });
    }
    usersDb.find(values.identifier).then((user) => {
      res.send({ data: user });
    }).catch(err => next(err));
  },
  create: (req, res, next) => {
    const requiredFields = ['username', 'password', 'name', 'role'];
    const values = _.pick(req.body, requiredFields);
    const { username, password, name, role } = values;
    if (_.size(_.omitBy(values, _.isEmpty)) < requiredFields.length) {
      throw new ApplicationError('Missing required fields', 400, {
        requiredFields,
      });
    }

    const passwordValidation = validatePassword(req.body.password);
    if (!passwordValidation.valid) {
      throw new ApplicationError('Invalid password', 400, {
        message: passwordValidation.message,
      });
    }

    if (!VALID_ROLES.includes(role)) {
      throw new ApplicationError('Invalid role', 400, {
        validRoles: VALID_ROLES,
      });
    }

    // Only admins can create non-admin accounts
    if (role === 'admin') {
      if (!res.locals.authData || res.locals.authData.role !== 'admin') {
        throw new ApplicationError('Unauthorized', 401);
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
  },
};
