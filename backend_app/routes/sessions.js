import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import usersDb from '../db/users';

const TOKEN_SECRET = 'super secret'; // TODO: make this an env variable
const BCRYPT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 5;

export default {
  authenticate: (req, res) => {
    const userIdentifier = req.body.username;
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

    usersDb.find(userIdentifier).then((user) => {
      if (!user) {
        res.sendStatus(403);
        return;
      }

      bcrypt.compare(req.body.password, user.password_hash, (err, match) => {
        if (err) {
          res.status(500).send({
            message: 'Could not authenticate the user',
          });
          return;
        }
        if (!match) {
          res.sendStatus(403);
          return;
        }

        res.send(
          jwt.sign({
            id: user.id,
          }, TOKEN_SECRET, {
            expiresIn: '7 days',
          })
        );
      });
    }).catch(() => {
      res.status(500).send({
        message: 'Could not load the user',
      });
      return;
    });
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
        res.status(401).send({
          message: 'Could not verify token',
        });
        return;
      }

      res.locals.authData = decoded; // eslint-disable-line no-param-reassign
      next();
    });
  },

  setCredentials: (req, res) => {
    if (isNaN(req.params.id)) {
      res.status(400).send({
        message: 'Invalid user id',
      });
      return;
    }
    const userId = parseInt(req.params.id, 10);
    const tokenUserId = res.locals.authData.id;
    if (!req.body.password) {
      res.status(400).send({
        message: 'Missing replacement password',
      });
      return;
    }

    if (userId !== tokenUserId) {
      res.sendStatus(403);
      return;
    }

    if (req.body.password.length < MIN_PASSWORD_LENGTH) {
      res.status(400).send({
        message: 'Password too short',
      });
      return;
    }

    bcrypt.hash(req.body.password, BCRYPT_ROUNDS, (err, hash) => {
      if (err) {
        res.status(500).send({
          message: 'Could not secure password',
        });
        return;
      }

      usersDb.setPassword(userId, hash).then(() => {
        res.sendStatus(200);
        return;
      }).catch(() => {
        res.status(500).send({
          message: 'Could not set your new password',
        });
        return;
      });
    });
  },
};
