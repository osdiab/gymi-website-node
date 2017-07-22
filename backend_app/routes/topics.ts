import _ from 'lodash';

import { ApplicationError } from '../errors';
import topicsDb from '../db/topics';

export default {
  create: (req, res, next) => {
    const requiredFields = ['title'];
    if (_.isEmpty(req.body.title)) {
      next(new ApplicationError(
        'Missing required fields', 400, { missing: ['title'], requiredFields }
      ));
      return;
    }
    topicsDb.create(req.body.title).then((result) => {
      res.status(201).send({
        message: 'Created',
        data: result,
      });
    }).catch(next);
  },
  destroy: (req, res, next) => {
    const requiredFields = ['id'];
    const id = (req.params.id || req.body.id);
    if (_.isEmpty(id)) {
      next(new ApplicationError(
        'Missing required fields', 400, { missing: ['id'], requiredFields }
      ));
      return;
    }
    topicsDb.destroy(id).then(() => {
      res.sendStatus(204);
    }).catch(next);
  },
  list: (req, res, next) => {
    topicsDb.list(!!req.query.showArchived).then(
      topics => res.send({ data: topics })
    ).catch(next);
  },
};
