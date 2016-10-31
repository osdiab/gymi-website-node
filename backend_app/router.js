// Defines an express app that runs the boilerplate codebase.

import express from 'express';
import fetch from 'node-fetch';
import path from 'path';

export default function createRouter() {
  const router = express.Router(); // eslint-disable-line new-cap

  // static assets; this includes the compiled frontend app!
  router.use(express.static(path.join(__dirname, '..', 'public')));

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

  // login endpoint
  router.post('/api/users/:id/sessions', (req, res) => {
    res.status(501);
    res.send('Not yet implemented!');
  });
  // logout endpoint
  router.delete('/api/users/:id/sessions', (req, res) => {
    res.status(501);
    res.send('Not yet implemented!');
  });

  // submissions endpoints
  router.get('/api/submissions', (req, res) => {
    res.status(501);
    res.send('Not yet implemented!');
  });
  router.post('/api/submissions', (req, res) => {
    res.status(501);
    res.send('Not yet implemented!');
  });

  // interests endpoints
  router.get('/api/users/:id/interests', (req, res) => {
    res.status(501);
    res.send('Not yet implemented!');
  });
  router.put('/api/users/:id/interests', (req, res) => {
    res.status(501);
    res.send('Not yet implemented!');
  });

  // users endpoints
  router.get('/api/users', (req, res) => {
    res.status(501);
    res.send('Not yet implemented!');
  });
  router.get('/api/users/:id', (req, res) => {
    res.status(501);
    res.send('Not yet implemented!');
  });
  router.patch('/api/users/:id/credentials', (req, res) => {
    res.status(501);
    res.send('Not yet implemented!');
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
