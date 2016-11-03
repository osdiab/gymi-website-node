import _ from 'lodash';

import { ApplicationError } from '../errors';
import interestsDb from '../db/interests';

export default {
  list: (req, res, next) => {
    const requiredFields = ['userId'];
    const userId = req.params.userId;

    if (_.isEmpty(userId)) {
      throw new ApplicationError('Missing id field', 400, { requiredFields });
    }

    interestsDb.list(userId).then((interests) => {
      res.send({
        data: interests,
      });
    }).catch(next);
  },

  add: (req, res, next) => {
    const requiredFields = ['userId', 'topicId'];
    const values = req.body;

    if (_.compact(_.values(values)).length !== requiredFields.length) {
      throw new ApplicationError('Missing field', 400, { requiredFields });
    }

    const dbFunc = req.body.primary ? interestsDb.add : interestsDb.updatePrimary;
    dbFunc(values.userId, values.topicId).then((result) => {
      if (_.isEmpty(result)) {
        res.status(200).send('Already added');
      }
      res.sendStatus(201);
    }).catch(next);
  },

  remove: (req, res, next) => {
    const requiredFields = ['userId', 'topicId'];
    const values = req.body;

    if (_.compact(_.values(values)).length !== requiredFields.length) {
      throw new ApplicationError('Missing field', 400, { requiredFields });
    }

    interestsDb.remove(values.userId, values.topicId).then(() => {
      res.sendStatus(204);
    }).catch(next);
  },
};
