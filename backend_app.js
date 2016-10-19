// Defines an express app that runs the boilerplate codebase.

import express from 'express';
import fetch from 'node-fetch';
import path from 'path';

const app = express();

// ********************
// * CONFIGURE ROUTER *
// ********************

const router = express.Router(); // eslint-disable-line new-cap

// static assets; this includes the compiled frontend app!
router.use(express.static(path.join(__dirname, 'public')));

/**
 * Uncached routes:
 * All routes that shouldn't be cached (i.e. non-static assets) should have these headers to
 * prevent 304 Unmodified cache returns. This middleware applies it to all subsequently defined
 * routes.
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

// quote: fetches a random computer science quote from an API. Either returns the quote as JSON, or
// sends a 500 on any error.
router.get('/api/quote', (req, res) => {
  fetch('http://quotes.stormconsultancy.co.uk/random.json').then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }).then((response) => {
    res.json(response);
  }).catch((err) => {
    // TODO: in a real app, this should actually handle errors
    console.error(err); // eslint-disable-line no-console
    res.status(500);
    res.send('Something went wrong!');
  });
});

app.use(router);
export default app;
