import _ from 'lodash';
import pgPromise from 'pg-promise';

import db from './';

const pgpHelpers = pgPromise().helpers;

const list = (filters, limit = 100) => new Promise((resolve, reject) => {
  const columns = [
    'submissions.id', 'timestamp', 'submissions."userId"', 'body AS answer', '"questionId"',
    '"submissionQuestions".title AS question', '"submissionQuestions".archived AS "questionArchived"',
    '"topicId" AS "primaryInterestId"', 'users.name AS "userFullName"',
    'topics.title AS "primaryInterestTitle"',
  ];
  const supportedFilters = ['after', 'userId'];
  if (_.difference(_.keys(filters), supportedFilters).length !== 0) {
    throw new Error('Unsupported filters provided');
  }
  const clauses = [];
  const additionalArgs = {};
  if (filters.after) {
    clauses.push('timestamp > $<after>');
    additionalArgs.after = filters.after;
  }

  if (filters.userId) {
    clauses.push('submissions."userId" = $<userId>');
    additionalArgs.userId = filters.userId;
  }
  const clause = clauses.length > 0 ? `AND ${clauses.join(' AND ')}` : '';

  // need the where clause to limit on number of submissions
  const query = `
    SELECT ${columns.join(', ')}
    FROM submissions
    INNER JOIN "submissionAnswers" ON submissions.id = "submissionId"
    INNER JOIN "submissionQuestions" ON "submissionQuestions".id = "questionId"
    INNER JOIN users ON submissions."userId" = users.id
    INNER JOIN "primaryUserInterests" ON submissions."userId" = "primaryUserInterests"."userId"
    INNER JOIN topics ON "primaryUserInterests"."topicId" = topics.id
    WHERE submissions.id IN (
      SELECT id
      FROM submissions
      ORDER BY timestamp DESC
      LIMIT $<limit>)
    ${clause} ORDER BY timestamp DESC`;

  db.manyOrNone(
    query, Object.assign({}, { columns, limit }, additionalArgs)
  ).then(submissions =>
    // combine multiple rows of answers into an array of answers per submission
    _.values(_.reduce(submissions, (memo, submission) => {
      const answerFields = ['answer', 'questionId', 'question', 'questionArchived'];
      const interestFields = ['primaryInterestId', 'primaryInterestTitle'];
      const userFields = ['userFullName', 'userId'];
      const answerValues = _.pick(submission, answerFields);

      if (memo[submission.id]) {
        const newAnswers = memo[submission.id].answers.concat(answerValues);
        const newSubmission = Object.assign({}, memo[submission.id], { answers: newAnswers });
        return Object.assign({}, memo, { [submission.id]: newSubmission });
      }

      const newEntry = Object.assign(
        _.omit(submission, answerFields.concat(interestFields, userFields)),
        {
          answers: [answerValues],
          user: { id: submission.userId, name: submission.userFullName },
          primaryInterest: {
            id: submission.primaryInterestId,
            title: submission.primaryInterestTitle,
          },
        }
      );
      return Object.assign({}, memo, { [submission.id]: newEntry });
    }, {}))
  ).then(resolve).catch(reject);
});

const create = (userId, answers) => new Promise((resolve, reject) => {
  answers.forEach((a) => {
    if (!a.questionId) {
      throw new Error('Missing question ID');
    }
    if (!a.body) {
      throw new Error('Missing answer body');
    }
  });
  const timestamp = new Date();
  const submissionsQuery =
    'INSERT INTO submissions (timestamp, "userId") VALUES ($<timestamp>, $<userId>) RETURNING id';
  db.tx(tx =>
    tx.one(submissionsQuery, { timestamp, userId }).then(({ id }) => {
      const answersCols = new pgpHelpers.ColumnSet(['submissionId', 'questionId', 'body'],
                                                          { table: 'submissionAnswers' });
      const answersQuery = pgpHelpers.insert(
        answers.map(a => Object.assign({}, a, { submissionId: id })), answersCols
      );
      return tx.none(answersQuery).then(() => id);
    })
  ).then(resolve).catch(reject);
});

export default {
  list,
  create,
};

