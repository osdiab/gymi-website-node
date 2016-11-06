import _ from 'lodash';

import { ApplicationError } from '../errors';
import interestsDb from '../db/interests';

export default {
  list: (req, res, next) => {
    const requiredFields = ['userId'];
    const userId = req.params.userId;

    if (_.isEmpty(userId)) {
      throw new ApplicationError(
        'Missing required fields', 400, { missing: ['userId'], requiredFields }
      );
    }

    interestsDb.list(userId).then((interests) => {
      res.send({
        data: interests,
      });
    }).catch(next);
  },

  add: (req, res, next) => {
    const requiredFields = ['userId', 'topicId'];
    const values = Object.assign({}, req.body, req.params);

    if (_.compact(_.values(_.pick(values, requiredFields))).length !== requiredFields.length) {
      throw new ApplicationError('Missing required fields', 400, { requiredFields });
    }

    if (isNaN(values.userId)) {
      throw new ApplicationError('userId must be an integer', 400);
    }

    if (res.locals.authData.id !== parseInt(values.userId, 10)) {
      throw new ApplicationError('You may only add interests for your own account', 403);
    }

    const dbFunc = req.body.primary ? interestsDb.updatePrimary : interestsDb.add;
    dbFunc(values.userId, values.topicId).then((result) => {
      if (_.isEmpty(result)) {
        res.status(200).send('Already added');
      }
      res.sendStatus(201);
    }).catch(next);
  },

  remove: (req, res, next) => {
    const requiredFields = ['userId', 'topicId'];
    const values = Object.assign({}, req.body, req.params);

    if (_.compact(_.values(values)).length !== requiredFields.length) {
      throw new ApplicationError('Missing required fields', 400, { requiredFields });
    }

    if (isNaN(values.userId)) {
      throw new ApplicationError('userId must be an integer', 400);
    }

    if (isNaN(values.topicId)) {
      throw new ApplicationError('topicId must be an integer', 400);
    }

    if (res.locals.authData.id !== parseInt(values.userId, 10)) {
      throw new ApplicationError('You may only remove interests for your own account', 403);
    }

    interestsDb.remove(values.userId, values.topicId).then(() => {
      res.sendStatus(204);
    }).catch(next);
  },
};
