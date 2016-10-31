import jwt from 'jsonwebtoken';

import usersDb from '../db/users';
import { hashPassword, comparePassword, validatePassword } from './passwords';

const TOKEN_SECRET = 'super secret'; // TODO: make this an env variable

export default {
  authenticate: (req, res) => {
    const userIdentifier = req.body.username;
    if (!userIdentifier) {
      res.status(400).send({ message: 'Missing username' });
      return;
    }
    if (!req.body.password) {
      res.status(400).send({ message: 'Missing password' });
      return;
    }

    usersDb.find(userIdentifier).then((user) => {
      if (!user) {
        res.sendStatus(403);
        return;
      }

      comparePassword(req.body.password, user.password_hash).then((match) => {
        if (!match) {
          res.sendStatus(403);
          return;
        }
        res.send(jwt.sign({ id: user.id }, TOKEN_SECRET, { expiresIn: '7 days' }));
      });
    }).catch(() => res.status(500).send({ message: 'Could not authenticate the user' }));
  },

  verify: (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).send({
        message: 'Missing Authorization header with Bearer token',
      });
      return;
    }

    const token = authHeader.substring('Bearer '.length);
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send({ message: 'Could not verify token' });
        return;
      }

      res.locals.authData = decoded; // eslint-disable-line no-param-reassign
      next();
    });
  },

  setCredentials: (req, res) => {
    if (isNaN(req.params.id)) {
      res.status(400).send({ message: 'Invalid user id' });
      return;
    }
    const userId = parseInt(req.params.id, 10);
    const tokenUserId = res.locals.authData.id;
    if (!req.body.password) {
      res.status(400).send({ message: 'Missing replacement password' });
      return;
    }

    if (userId !== tokenUserId) {
      res.sendStatus(403);
      return;
    }

    const passwordValidation = validatePassword(req.body.password);
    if (!passwordValidation.valid) {
      res.status(400).send({ message: passwordValidation.message });
      return;
    }

    hashPassword(req.body.password).then(hash => usersDb.setPassword(userId, hash)
    ).then(() => res.sendStatus(200)
    ).catch(() => res.status(500).send({ message: 'Could not set new password' }));
  },
};
