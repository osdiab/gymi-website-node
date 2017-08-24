/**
 * Endpoints related to submissions, i.e. listing and filtering them,
 * and creating new ones
 */
import {NextFunction, Request, Response} from 'express';
import * as _ from 'lodash';
import * as moment from 'moment';

import submissionsDb from 'backend/db/submissions';
import { ApplicationError } from 'backend/errors';
import {Id} from 'common/entities';

export default {
  list: (req: Request, res: Response, next: NextFunction) => {
    const validFilters = ['userId', 'after'];
    const inputFilters: {userId?: string, after?: string} = _({...req.query, ...req.params})
      .pick(validFilters)
      .omitBy(_.isEmpty).value();

    const filters: {userId?: Id, after?: Date} = {};
    if (inputFilters.after) {
      const afterMoment = moment(inputFilters.after);
      if (!afterMoment.isValid()) {
        next(new ApplicationError('After is not a valid date', 400));

        return;
      }
      filters.after = afterMoment.toDate();
    }

    if (inputFilters.userId) {
      if (isNaN(Number(inputFilters.userId))) {
        next(new ApplicationError('userId is not an integer', 400));

        return;
      }
      filters.userId = parseInt(inputFilters.userId, 10);
    }

    let promise;
    if (req.query.limit) {
      if (isNaN(Number(req.query.limit))) {
        next(new ApplicationError('limit must be an integer', 400));

        return;
      }
      const limit = parseInt(req.query.limit, 10);
      if (limit < 1) {
        next(new ApplicationError('limit must be more than 0', 400));

        return;
      }
      if (limit > 1000) {
        next(new ApplicationError('limit must be less than 1000', 400));

        return;
      }
      promise = submissionsDb.list(filters, limit);
    } else {
      promise = submissionsDb.list(filters);
    }

    promise.then(data => res.send({ data })).catch(next);
  },

  create: (req: Request, res: Response, next: NextFunction) => {
    const requiredFields = ['userId', 'answers'];
    const values: {
      userId: string,
      answers: {questionId: string, body: string}[]
    } = _.pick({...req.params, ...req.body}, requiredFields);
    const numFieldsFound = _(values).values().compact().value().length;
    if (numFieldsFound !== requiredFields.length) {
      next(new ApplicationError('Missing required fields', 400, { requiredFields }));

      return;
    }

    if (isNaN(Number(values.userId))) {
      next(new ApplicationError('userId must be an integer', 400));

      return;
    }

    const userId = parseInt(values.userId, 10);
    if (res.locals.authData.id !== userId) {
      next(new ApplicationError('You may only add submissions for your own account', 403));

      return;
    }

    let answers;
    try {
      answers = values.answers.map((a) => {
        if (!a.questionId) {
          throw new ApplicationError('Answer missing questionId', 400, {
            answer: a
          });
        }

        if (isNaN(Number(a.questionId))) {
          throw new ApplicationError('questionId is not an integer', 400);
        }

        if (_.isEmpty(a.body)) {
          throw new ApplicationError('Answer missing body', 400, {
            answer: a
          });
        }

        return {...a, questionId: parseInt(a.questionId, 10)};
      });
    } catch (err) {
      next(err);

      return;
    }

    submissionsDb.create(userId, answers).then((id) => {
      res.status(201).send({
        message: 'Created',
        data: { id }
      });
    }).catch(next);
  }
};
