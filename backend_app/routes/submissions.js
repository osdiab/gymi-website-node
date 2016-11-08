import _ from 'lodash';
import moment from 'moment';

import { ApplicationError } from '../errors';
import submissionsDb from '../db/submissions';

export default {
  list: (req, res, next) => {
    const validFilters = ['userId', 'after'];
    const filters = _.omitBy(
      _.pick(Object.assign({}, req.query, req.params), validFilters), _.isEmpty
    );

    if (filters.after) {
      const afterMoment = moment(filters.after);
      if (!afterMoment.isValid()) {
        next(new ApplicationError('After is not a valid date', 400));
        return;
      }
      filters.after = afterMoment.toDate();
    }

    if (filters.userId) {
      if (isNaN(filters.userId)) {
        next(new ApplicationError('userId is not an integer', 400));
        return;
      }
      filters.userId = parseInt(filters.userId, 10);
    }

    let promise;
    if (req.query.limit) {
      if (isNaN(req.query.limit)) {
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

  create: (req, res, next) => {
    const requiredFields = ['userId', 'answers'];
    const values = _.pick(Object.assign({}, req.params, req.body), requiredFields);
    if (_.compact(_.values(values)).length !== requiredFields.length) {
      next(new ApplicationError('Missing required fields', 400, { requiredFields }));
      return;
    }

    if (isNaN(values.userId)) {
      next(new ApplicationError('userId must be an integer', 400));
      return;
    }

    if (res.locals.authData.id !== parseInt(values.userId, 10)) {
      next(new ApplicationError('You may only add submissions for your own account', 403));
      return;
    }

    try {
      values.answers.map((a) => {
        if (!a.questionId) {
          throw new ApplicationError('Answer missing questionId', 400, {
            answer: a,
          });
        }

        if (isNaN(a.questionId)) {
          throw new ApplicationError('questionId is not an integer', 400);
        }

        if (_.isEmpty(a.body)) {
          throw new ApplicationError('Answer missing body', 400, {
            answer: a,
          });
        }

        return Object.assign({}, a, { questionId: parseInt(a.questionId, 10) });
      });
    } catch (err) {
      next(err);
      return;
    }

    submissionsDb.create(values.userId, values.answers).then((id) => {
      res.status(201).send({
        message: 'Created',
        data: { id },
      });
    }).catch(next);
  },
};
