import _ from 'lodash';

import { ApplicationError } from '../errors';
import periodsDb from '../db/periods';

export default {
  create: (req, res, next) => {
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
        data: result,
      });
    }).catch(next);
  },
  list: (req, res, next) => {
    periodsDb.list().then(
      periods => res.send({ data: periods })
    ).catch(next);
  },
};
