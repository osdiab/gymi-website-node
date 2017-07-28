/**
 * Handlers for API endpoints regarding a user's interests, i.e. the topics
 * they are interested in.
 */
import {NextFunction, Request, Response} from 'express';
import * as _ from 'lodash';

import interestsDb from 'backend/db/interests';
import { ApplicationError } from 'backend/errors';

export default {
  list: (req: Request, res: Response, next: NextFunction) => {
    const requiredFields = ['userId'];
    const userId = req.params.userId;

    if (_.isEmpty(userId)) {
      next(new ApplicationError(
        'Missing required fields', 400, { missing: ['userId'], requiredFields }
      ));

      return;
    }

    interestsDb.list(userId).then((interests) => {
      res.send({
        data: interests
      });
    }).catch(next);
  },

  add: (req: Request, res: Response, next: NextFunction) => {
    const requiredFields = ['userId', 'topicId'];
    const values = Object.assign({}, req.body, req.params);
    const numFoundFields = _(values).pick(requiredFields).values().compact().value().length;
    if (numFoundFields !== requiredFields.length) {
      next(new ApplicationError('Missing required fields', 400, { requiredFields }));

      return;
    }

    if (isNaN(values.userId)) {
      next(new ApplicationError('userId must be an integer', 400));

      return;
    }

    if (res.locals.authData.id !== parseInt(values.userId, 10)) {
      next(new ApplicationError('You may only add interests for your own account', 403));

      return;
    }

    const dbFunc = req.body.primary ? interestsDb.updatePrimary : interestsDb.add;
    dbFunc(values.userId, values.topicId).then((result) => {
      if (_.isEmpty(result)) {
        res.status(200).send('Already added');
      }
      res.sendStatus(201);
    }).catch(next);
  },

  remove: (req: Request, res: Response, next: NextFunction) => {
    const requiredFields = ['userId', 'topicId'];
    const values = Object.assign({}, req.body, req.params);
    const numFoundFields = _(values).values().compact().value().length;

    if (numFoundFields !== requiredFields.length) {
      next(new ApplicationError('Missing required fields', 400, { requiredFields }));

      return;
    }

    if (isNaN(values.userId)) {
      next(new ApplicationError('userId must be an integer', 400));

      return;
    }

    if (isNaN(values.topicId)) {
      next(new ApplicationError('topicId must be an integer', 400));

      return;
    }

    if (res.locals.authData.id !== parseInt(values.userId, 10)) {
      next(new ApplicationError('You may only remove interests for your own account', 403));

      return;
    }

    interestsDb.remove(values.userId, values.topicId).then(() => {
      res.sendStatus(204);
    }).catch(next);
  }
};
