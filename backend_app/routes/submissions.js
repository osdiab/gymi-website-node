import _ from 'lodash';
import moment from 'moment';

import { ApplicationError } from '../errors';
import interestsDb from '../db/interests';
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
        throw new ApplicationError('After is not a valid date', 400);
      }
      filters.after = afterMoment.toDate();
    }

    if (filters.userId) {
      if (isNaN(filters.userId)) {
        throw new ApplicationError('userId is not an integer', 400);
      }
      filters.userId = parseInt(filters.userId, 10);
    }

    let promise;
    if (req.query.limit) {
      if (isNaN(req.query.limit)) {
        throw new ApplicationError('limit must be an integer', 400);
      }
      const limit = parseInt(req.query.limit, 10);
      if (limit < 1) {
        throw new ApplicationError('limit must be more than 0', 400);
      }
      if (limit > 1000) {
        throw new ApplicationError('limit must be less than 1000', 400);
      }
      promise = submissionsDb.list(filters, limit);
    } else {
      promise = submissionsDb.list(filters);
    }

    const { getPrimaryInterests } = req.query;

    promise.then(submissions => new Promise((resolve, reject) => {
      if (getPrimaryInterests) {
        interestsDb.getPrimaryForUsers(_.uniqBy(submissions, 'userId')).then((primaryInterests) => {
          const interestMapping = _.fromPairs(primaryInterests.map(i => [i.userId, i.topicId]));
          resolve(submissions.map(s => Object.assign(
            {}, s, { primaryInterest: interestMapping[s.userId] }
          )));
        }).catch(reject);
      } else {
        resolve(submissions);
      }
    })).then(data => res.send({ data }))
    .catch(next);
  },

  create: (req, res, next) => {
    const requiredFields = ['userId', 'answers'];
    const values = _.pick(req.body, requiredFields);
    if (_.compact(_.values(values)).length !== requiredFields.length) {
      throw new ApplicationError('Missing required fields', 400, { requiredFields });
    }

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

    submissionsDb.create(values.userId, values.answers).then((id) => {
      res.status(201).send({
        message: 'Created',
        data: { id },
      });
    }).catch(next);
  },
};
