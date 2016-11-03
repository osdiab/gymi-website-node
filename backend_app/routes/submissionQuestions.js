import _ from 'lodash';

import { ApplicationError } from '../errors';
import submissionQuestionsDb from '../db/submissionQuestions';

export default {
  create: (req, res, next) => {
    const { title } = req.body;
    if (_.isEmpty(title)) {
      throw new ApplicationError(
        'Missing required fields', 400, {
          missing: ['title'], requiredFields: ['title'],
        }
      );
    }

    submissionQuestionsDb.create(title).then((id) => {
      res.send({ data: { id } });
    }).catch(next);
  },
  destroy: (req, res, next) => {
    const id = req.params.id || req.body.id;
    if (_.isEmpty(id)) {
      throw new ApplicationError(
        'Missing required fields', 400, { missing: ['id'], requiredFields: ['id'] }
      );
    }

    submissionQuestionsDb.destroy(id).then(() => {
      res.sendStatus(204);
    }).catch(next);
  },
  list: (req, res, next) => {
    submissionQuestionsDb.list(!!req.query.showArchived).then(
      questions => res.send({ data: questions })
    ).catch(next);
  },
};
