import db from './';

const list = userId => new Promise((resolve, reject) => {
  const columns = ['title', 'id'];
  const queries = ['"userInterests"', '"primaryUserInterests"'].map(table => `
    SELECT $<columns:name>
    FROM ${table}
    INNER JOIN topics ON "topicId" = topics.id
    WHERE "userId" = $<userId>`);

  const args = { columns, userId };
  db.task(t => Promise.all([t.manyOrNone(queries[0], args), t.oneOrNone(queries[1], args)])
  ).then(([interests, primaryInterest]) => resolve({ interests, primaryInterest })).catch(reject);
});

const getPrimaryForUsers = userIds => new Promise((resolve, reject) =>
  db.manyOrNone(
    `SELECT "userId", "topicId", title, archived AS "topicArchived"
    FROM "primaryUserInterests"
    INNER JOIN topics ON "topicId" = topic.id
    WHERE "userId" IN $<userIds:csv>`,
    { userIds },
  ).then(resolve).catch(reject)
);

const add = (userId, topicId) => new Promise((resolve, reject) =>
  db.oneOrNone(
    `INSERT INTO "userInterests" ("topicId", "userId")
    VALUES ($<topicId>, $<userId>)
    ON CONFLICT DO NOTHING RETURNING "topicId"`,
    { userId, topicId },
  ).then(resolve).catch(reject)
);

const remove = (userId, topicId) => new Promise((resolve, reject) =>
  db.none(
    'DELETE FROM "userInterests" WHERE "userId" = $<userId> AND "topicId" = $<topicId>',
    { userId, topicId }
  ).then(resolve).catch(reject)
);

const updatePrimary = (userId, topicId) => new Promise((resolve, reject) =>
  db.one(
    `INSERT INTO "primaryUserInterests" ("userId", "topicId")
    VALUES ($<userId>, $<topicId>)
    ON CONFLICT ("userId") DO UPDATE SET "topicId" = $<topicId>
    RETURNING "topicId"`,
    { userId, topicId }
  ).then(resolve).catch(reject)
);

export default {
  list,
  add,
  remove,
  updatePrimary,
  getPrimaryForUsers,
};
