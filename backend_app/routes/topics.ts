/**
 * Endpoints related to topics, i.e. subject matter that people can be
 * interested in
 */
import {NextFunction, Request, Response} from 'express';
import * as _ from 'lodash';

import topicsDb from 'backend/db/topics';
import { ApplicationError } from 'backend/errors';

export default {
  create: (req: Request, res: Response, next: NextFunction) => {
    const requiredFields = ['title'];
    if (_.isEmpty(req.body.title)) {
      next(new ApplicationError(
        'Missing required fields', 400, { missing: ['title'], requiredFields }
      ));

      return;
    }
    topicsDb.create(req.body.title).then((result) => {
      res.status(201).send({
        message: 'Created',
        data: result
      });
    }).catch(next);
  },
  destroy: (req: Request, res: Response, next: NextFunction) => {
    const requiredFields = ['id'];
    const id = (req.params.id || req.body.id);
    if (_.isEmpty(id)) {
      next(new ApplicationError(
        'Missing required fields', 400, { missing: ['id'], requiredFields }
      ));

      return;
    }
    topicsDb.destroy(id).then(() => {
      res.sendStatus(204);
    }).catch(next);
  },
  list: (req: Request, res: Response, next: NextFunction) => {
    topicsDb.list(!!req.query.showArchived).then(
      topics => res.send({ data: topics })
    ).catch(next);
  }
};
