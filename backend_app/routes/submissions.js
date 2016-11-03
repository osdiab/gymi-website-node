import _ from 'lodash';
import moment from 'moment';

import { ApplicationError } from '../errors';
import interestsDb from '../db/interests';
import submissionsDb from '../db/submissions';

export default {
  list: (req, res, next) => {
    const validFilters = ['userId', 'after'];
    const filters = _.pick(req.params, validFilters);
    if (filters.includes('')) {
      throw new ApplicationError('Filter cannot be empty', 400);
    }

    if (filters.after) {
      filters.after = moment(filters.after);
      if (!filters.after.isValid()) {
        throw new ApplicationError('After is not a valid date');
      }
    }

    const { getPrimaryInterests } = req.params;

    submissionsDb.list(filters).then((submissions) => {
      if (getPrimaryInterests) {
        interestsDb.getPrimaryForUsers(_.uniqBy(submissions, 'user_id')).then((primaryInterests) => {
          const interestMapping = _.fromPairs(primaryInterests.map(i => [i.user_id, i.topic_id]));
          res.send(submissions.map(s => Object.assign(
            {}, s, { primaryInterest: interestMapping[s.user_id] }
          )));
        }).catch(next);
      } else {
        res.send(submissions);
      }
    }).catch(next);
  },

  create: (req, res, next) => {
    const requiredFields = ['userId', 'answers'];
    const values = _.pick(req.body, requiredFields);
    if (_.compact(_.values(values)).length !== requiredFields.length) {
      throw new ApplicationError('Missing fields', 400, { requiredFields });
    }

    values.answers.forEach((a) => {
      if (!a.questionId) {
        throw new ApplicationError('Answer missing question ID', 400, {
          answer: a,
        });
      }
      if (!a.body) {
        throw new ApplicationError('Answer missing body', 400, {
          answer: a,
        });
      }
    });

    submissionsDb.create(values.userId, values.answers).then((id) => {
      res.status(201).send({
        message: 'Created',
        data: { id },
      });
    }).catch(next);
  },
};
