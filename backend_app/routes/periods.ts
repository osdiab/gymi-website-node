/**
 * Handlers for API methods regarding periods, i.e. GYMI sessions
 */
import {NextFunction, Request, Response} from 'express';
import * as _ from 'lodash';

import periodsDb from 'backend/db/periods';
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
    periodsDb.create(req.body.title).then((result) => {
      res.status(201).send({
        message: 'Created',
        data: result
      });
    }).catch(next);
  },

  list: (req: Request, res: Response, next: NextFunction) => {
    periodsDb.list().then(
      periods => res.send({ data: periods })
    ).catch(next);
  }
};
