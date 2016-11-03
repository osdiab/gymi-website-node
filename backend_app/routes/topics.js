import _ from 'lodash';

import { ApplicationError } from '../errors';
import topicsDb from '../db/topics';

export default {
  create: (req, res, next) => {
    const requiredFields = ['title'];
    if (_.isEmpty(req.body.title)) {
      throw new ApplicationError(
        'Missing required field', 400, { missing: 'title', requiredFields }
      );
    }
    topicsDb.create(req.body.title).then((result) => {
      res.status(201).send({
        message: 'Created',
        data: result,
      });
    }).catch(next);
  },
  destroy: (req, res, next) => {
    const id = (req.params.id || req.body.id);
    if (_.isEmpty(id)) {
      throw new ApplicationError('id is missing', 400);
    }
    topicsDb.destroy(id).then(() => {
      res.sendStatus(204);
    }).catch(next);
  },
  list: (req, res, next) => {
    topicsDb.list().then((topics) => {
      res.send({
        data: topics,
      });
    }).catch(next);
  },
};
