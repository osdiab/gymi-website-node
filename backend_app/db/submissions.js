import _ from 'lodash';
import pgPromise from 'pg-promise';

import db from './';

const list = (filters, limit = 10) => new Promise((resolve, reject) => {
  const columns = [
    'submissions.id', 'timestamp', 'user_id', 'body AS answer_body', 'question_id',
    'title AS question', 'archive AS question_archived',
  ];
  const supportedFilters = ['after', 'user_id'];
  if (_.difference(filters.keys(), supportedFilters).length !== 0) {
    throw new Error('Unsupported filters provided');
  }
  let clause = '';
  const additionalArgs = {};
  if (filters.after) {
    clause += ' AND timestamp > $<after>';
    additionalArgs.after = filters.after;
  }

  if (filters.userId) {
    clause += ' AND user_id = $<userId>';
    additionalArgs.userId = filters.userId;
  }

  const query = `
    SELECT $<columns:raw>
    FROM submissions
    WHERE submission.id IN (
      SELECT id FROM submissions ORDER BY timestamp DESC LIMIT $<limit>
    ) ${clause}`;

  db.manyOrNone(
    query, Object.assign({}, { columns, limit }, additionalArgs)
  ).then(resolve).catch(reject);
});

const create = (userId, answers) => new Promise((resolve, reject) => {
  answers.forEach((a) => {
    if (!a.question_id) {
      throw new Error('Missing question ID');
    }
    if (!a.body) {
      throw new Error('Missing answer body');
    }
  });
  const timestamp = new Date();
  const submissionsQuery =
    'INSERT INTO submissions (timestamp, user_id) VALUES ($<timestamp>, $<user_id>) RETURNING id';
  db.tx(tx =>
    tx.one(submissionsQuery, { timestamp, user_id: userId }).then(({ id }) => {
      const answersCols = new pgPromise.helpers.ColumnSet(['submission_id', 'question_id', 'body'],
                                                          { table: 'submission_answers' });
      const answersQuery = pgPromise.helpers.insert(
        answers.map(a => Object.assign({}, a, { submission_id: id })), answersCols
      );
      return tx.none(answersQuery);
    })
  ).then(resolve).catch(reject);
});

export default {
  list,
  create,
};

