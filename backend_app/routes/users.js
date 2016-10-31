import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import usersDb from '../db/users';

const NOT_YET_IMPLEMENTED = (req, res) => {
  res.status(501);
  res.send('Not yet implemented!');
};

const TOKEN_SECRET = 'super secret'; // TODO: make this an env variable
const BCRYPT_ROUNDS = 10;

export const sessions = {
  authenticate: async (req, res) => {
    const userIdentifier = req.params.id;
    if (!userIdentifier) {
      res.status(400).send({
        message: 'Missing username',
      });
      return;
    }
    if (!req.body.password) {
      res.status(400).send({
        message: 'Missing password',
      });
      return;
    }

    try {
      const user = await usersDb.find(userIdentifier);
      bcrypt.hash(req.body.password, BCRYPT_ROUNDS, (err, hash) => {
        if (err) {
          res.status(500).send({
            message: 'Could not authenticate the user',
          });
          return;
        }
        if (user.pw_hash !== hash) {
          res.sendStatus(403);
          return;
        }

        res.send(
          jwt.sign({
            id: user.id,
          }, TOKEN_SECRET, {
            expiresIn: '1 week',
          })
        );
      });
    } catch (err) {
      res.status(500).send({
        message: 'Could not load the user',
      });
      return;
    }
  },

  verify: (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.send(401).message({
        message: 'Missing Authorization header with Bearer token',
      });
      return;
    }

    const token = authHeader.substring('Bearer '.length);
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send({
          message: 'Could not verify token',
        });
        return;
      }

      res.locals.authData = decoded; // eslint-disable-line no-param-reassign
      next();
    });
  },
};

export const credentials = {
  set: NOT_YET_IMPLEMENTED,
};

export const interests = {
  list: NOT_YET_IMPLEMENTED,
  update: NOT_YET_IMPLEMENTED,
};

export default {
  list: NOT_YET_IMPLEMENTED,
  find: NOT_YET_IMPLEMENTED,
};
