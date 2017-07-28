/**
 * Database methods related to retrieving and updating submission questions—
 * that is, the questions mentees are asked when they make a submission.
 */

import * as _ from 'lodash';
import * as pgPromise from 'pg-promise';

import db, {Id} from 'backend/db';

const pgpHelpers = pgPromise().helpers;

interface IFilters {
  after?: Date;
  userId?: Id;
}

const list = (filters: IFilters, limit = 100) => new Promise((resolve, reject) => {
  const columns = [
    'submissions.id', 'timestamp', 'submissions."userId"', 'body AS answer', '"questionId"',
    '"submissionQuestions".title AS question', '"submissionQuestions".archived AS "questionArchived"',
    '"primaryInterestId"', 'users.name AS "userFullName"',
    '"primaryInterestTitle"'
  ];
  const supportedFilters = ['after', 'userId'];
  if (_(filters).keys().difference(supportedFilters).value().length !== 0) {
    reject(new Error('Unsupported filters provided'));

    return;
  }
  const clauses = [];
  const additionalArgs: IFilters = {};
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
    LEFT JOIN (
      SELECT
        "userId",
        "topicId" AS "primaryInterestId",
        topics.title AS "primaryInterestTitle"
      FROM "primaryUserInterests"
      INNER JOIN topics ON "primaryUserInterests"."topicId" = topics.id
    ) AS "primaryInterests" ON submissions."userId" = "primaryInterests"."userId"
    WHERE submissions.id IN (
      SELECT id
      FROM submissions
      LIMIT $<limit>)
    ${clause}`;

  db.manyOrNone(
    query, Object.assign({}, { columns, limit }, additionalArgs)
  ).then(submissions => {
    // combine multiple rows of answers into an array of answers per submission
    const subsWithCombinedAnswers = submissions.reduce(
      (memo, submission) => {
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
            user: {
              id: submission.userId,
              name: submission.userFullName,
              primaryInterest: {
                id: submission.primaryInterestId,
                title: submission.primaryInterestTitle
              }
            }
          }
        );

        return Object.assign({}, memo, { [submission.id]: newEntry });
      },
      {});

    return _(subsWithCombinedAnswers).values().sortBy('timestamp').reverse().value();
  }
  ).then(resolve).catch(reject);
});

interface IAnswer {
  questionId: Id;
  body: string;
}
const create = (userId: Id, answers: IAnswer[]) => new Promise((resolve, reject) => {
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
  create
};
