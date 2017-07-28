/**
 * Endpoints related to listing and creating submission questions, i.e. the
 * questions asked when a student makes a submission
 */
import {NextFunction, Request, Response} from 'express';
import * as _ from 'lodash';

import submissionQuestionsDb from 'backend/db/submissionQuestions';
import { ApplicationError } from 'backend/errors';

export default {
  create: (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;
    if (_.isEmpty(title)) {
      next(new ApplicationError(
        'Missing required fields', 400, {
          missing: ['title'], requiredFields: ['title']
        }
      ));

      return;
    }

    submissionQuestionsDb.create(title).then((id) => {
      res.send({ data: { id } });
    }).catch(next);
  },
  destroy: (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id || req.body.id;
    if (_.isEmpty(id)) {
      next(new ApplicationError(
        'Missing required fields', 400, { missing: ['id'], requiredFields: ['id'] }
      ));

      return;
    }

    submissionQuestionsDb.destroy(id).then(() => {
      res.sendStatus(204);
    }).catch(next);
  },
  list: (req: Request, res: Response, next: NextFunction) => {
    submissionQuestionsDb.list(!!req.query.showArchived).then(
      questions => res.send({ data: questions })
    ).catch(next);
  }
};
