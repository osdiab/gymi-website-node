/**
 * Defines routes for the GYMI application server.
 */

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as requestLanguage from 'express-request-language';
import * as path from 'path';

import { ApplicationError } from 'backend/errors';
import emails from 'backend/routes/emails';
import interests from 'backend/routes/interests';
import periods from 'backend/routes/periods';
import sessions from 'backend/routes/sessions';
import submissionQuestions from 'backend/routes/submissionQuestions';
import submissions from 'backend/routes/submissions';
import topics from 'backend/routes/topics';
import users from 'backend/routes/users';
import { handleRender } from 'backend/serverRendering';
import { Role } from 'common/roles';
import { LANGUAGE_KEY } from 'frontend/reducers/language';

// tslint:disable-next-line:max-func-body-length
export default function createRouter() {
  const router = express.Router();

  // static assets; this includes the compiled frontend app!
  router.use(express.static(path.join(__dirname, '..', 'public')));

  router.use(cookieParser());
  router.use(requestLanguage({
    languages: ['en', 'zh'],
    cookie: {
      name: LANGUAGE_KEY,
      options: { maxAge: 10 * 365 * 24 * 60 * 60 * 1000 } // 10 yrs from now
    }
  }));
  router.use(bodyParser.json()); // parse json bodies

  /**
   * Uncached routes:
   * All routes that shouldn't be cached (i.e. non-static assets) should have these headers to
   * prevent 304 Unmodified cache returns. This middleware applies it to all subsequently
   * defined routes.
   */
  router.get('/*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.set({
      'Last-Modified': (new Date()).toUTCString(),
      Expires: -1,
      'Cache-Control': 'must-revalidate, private'
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
   * send inquiry/press email
   */
  router.post('/api/emails', emails.send);

  /*
   * users endpoints
   */
  // authenticate. Returns a json web token to use with requests.
  router.post('/api/sessions', sessions.authenticate);
  router.get('/api/users', sessions.verify, users.list);
  router.get('/api/users/:identifier', sessions.verify, users.find);
  router.post('/api/users', sessions.populate, users.create);
  // sets a user's password
  router.patch('/api/users/:userId/credentials', sessions.verify, sessions.setCredentials);

  /*
   * interests endpoints
   */
  router.get('/api/users/:userId/interests', sessions.verify, interests.list);
  router.post('/api/users/:userId/interests', sessions.verify, interests.add);
  router.delete('/api/users/:userId/interests', sessions.verify, interests.remove);

  /*
   * submissions endpoints
   */
  router.get('/api/users/:userId/submissions', sessions.verify, submissions.list);
  router.get('/api/submissions', sessions.verify, submissions.list);
  router.post('/api/users/:userId/submissions', sessions.verify, submissions.create);

  /*
   * topics endpoints
   */
  router.get('/api/topics', sessions.verify, topics.list);
  router.post('/api/topics', sessions.verify, sessions.assertRole(Role.admin), topics.create);
  router.delete('/api/topics', sessions.verify, sessions.assertRole(Role.admin), topics.destroy);

  /*
   * periods endpoints
   */
  router.get('/api/periods', sessions.verify, periods.list);
  router.post('/api/periods', sessions.verify, sessions.assertRole(Role.admin), periods.create);

  /*
   * submission questions endpoints
   */
  router.get(
    '/api/submissionQuestions', sessions.verify, submissionQuestions.list
  );
  router.post(
    '/api/submissionQuestions', sessions.verify, sessions.assertRole(Role.admin),
    submissionQuestions.create
  );
  router.delete(
    '/api/submissionQuestions', sessions.verify, sessions.assertRole(Role.admin),
    submissionQuestions.destroy
  );

  router.all('/api/*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(new ApplicationError('Not Found', 404));
  });

  router.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).send({
        message: err.message,
        data: err.data || {}
      });

      return;
    }

    // log the error for debugging
    console.error(err);
    res.sendStatus(500); // uncaught exception
  });

  /**
   * Frontend app catch-all hook
   */
  // all other pages route to the frontend application.
  router.get('/*', handleRender);

  return router;
}
