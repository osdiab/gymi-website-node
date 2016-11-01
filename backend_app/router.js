// Defines an express app that runs the boilerplate codebase.

import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';

import { ApplicationError } from './errors';
import users from './routes/users';
import interests from './routes/interests';
import sessions from './routes/sessions';
import submissions from './routes/submissions';
import submissionQuestions from './routes/submissionQuestions';

export default function createRouter() {
  const router = express.Router(); // eslint-disable-line new-cap

  // static assets; this includes the compiled frontend app!
  router.use(express.static(path.join(__dirname, '..', 'public')));

  router.use(bodyParser.json()); // parse json bodies

  /**
   * Uncached routes:
   * All routes that shouldn't be cached (i.e. non-static assets) should have these headers to
   * prevent 304 Unmodified cache returns. This middleware applies it to all subsequently
   * defined routes.
   */
  router.get('/*', (req, res, next) => {
    res.set({
      'Last-Modified': (new Date()).toUTCString(),
      Expires: -1,
      'Cache-Control': 'must-revalidate, private',
    });
    next();
  });

  // *****************
  // * DEFINE ROUTES *
  // *****************

  /**
   * API Endpoints
   */

  /*
   * users endpoints
   */
  // authenticate. Returns a json web token to use with requests.
  router.post('/api/sessions', sessions.authenticate);
  router.get('/api/users', sessions.verify, users.list);
  router.get('/api/users/:id', sessions.verify, users.find);
  router.post('/api/users', users.create);
  // sets a user's password
  router.patch('/api/users/:id/credentials', sessions.verify, sessions.setCredentials);
  router.get('/api/users/:user_id/interests', sessions.verify, interests.list);
  router.put('/api/users/:id/interests', sessions.verify, users.setInterests);

  /*
   * submissions endpoints
   */
  // lists submissions
  router.get('/api/submissions', sessions.verify, submissions.list);
  // posts a submission
  router.post('/api/submissions', sessions.verify, submissions.post);

  /*
   * admin endpoints
   */
  router.put('/api/interests', sessions.verify, sessions.assertRole('admin'), interests.create);
  router.delete('/api/interests', sessions.verify, sessions.assertRole('admin'), interests.destroy);
  router.put(
    '/api/submissionQuestions', sessions.verify, sessions.assertRole('admin'),
    submissionQuestions.create,
  );
  router.delete(
    '/api/submissionQuestions', sessions.verify, sessions.assertRole('admin'),
    submissionQuestions.destroy,
  );

  router.all('/api/*', () => {
    throw new ApplicationError(404);
  });

  router.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    if (err instanceof ApplicationError) {
      if (err.noMessage) {
        res.sendStatus(err.statusCode);
        return;
      }
      res.status(err.statusCode).send({
        message: err.message,
        data: err.data || {},
      });
      return;
    }

    // log the error for debugging
    console.log(err); // eslint-disable-line no-console
    res.sendStatus(500); // uncaught exception
  });

  /**
   * Frontend app catch-all hook
   */
  // all other pages route to the frontend application.
  router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });

  return router;
}
