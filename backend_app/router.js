// Defines an express app that runs the boilerplate codebase.

import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';

import users, { sessions, credentials, interests } from './routes/users';
import submissions from './routes/submissions';

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
  router.post('/api/users/:id/sessions', sessions.create);
  router.get('/api/users', sessions.verify, users.list);
  router.get('/api/users/:id', sessions.verify, users.find);
  // sets a user's password
  router.patch('/api/users/:id/credentials', sessions.verify, credentials.set);
  router.get('/api/users/:id/interests', sessions.verify, interests.list);
  router.put('/api/users/:id/interests', sessions.verify, interests.update);


  /*
   * submissions endpoints
   */
  // lists submissions
  router.get('/api/submissions', sessions.verify, submissions.list);
  // posts a submission
  router.post('/api/submissions', sessions.verify, submissions.post);

  /**
   * Frontend app catch-all hook
   */
  // all other pages route to the frontend application.
  router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });

  return router;
}
