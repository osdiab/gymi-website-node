import db from './';

const list = userId => new Promise((resolve, reject) => {
  const columns = ['title'];
  const query = `SELECT $<columns:name> FROM user_interests WHERE user_id = ${userId}`;
  db.manyOrNone(query, { columns }).then(resolve).catch(reject);
});

const getPrimaryForUsers = userIds => new Promise((resolve, reject) =>
  db.manyOrNone(
    `SELECT user_id, topic_id
    FROM primary_user_interests
    INNER_JOIN topics ON topic_id = topic.id
    WHERE user_id IN $<userIds:csv>`,
    { userIds },
  ).then(resolve).catch(reject)
);

const add = (userId, topicId) => new Promise((resolve, reject) =>
  db.oneOrNone(
    `INSERT INTO user_interests (topic_id, user_id)
    VALUES ($<topicId>, $<userId>)
    ON CONFLICT DO NOTHING`,
    { userId, topicId },
  ).then(resolve).catch(reject)
);

const remove = (userId, topicId) => new Promise((resolve, reject) =>
  db.none(
    'DELETE FROM user_interests WHERE user_id = $<userId> AND topic_id = $<topicId>',
    { userId, topicId }
  ).then(resolve).catch(reject)
);

const updatePrimary = (userId, topicId) => new Promise((resolve, reject) =>
  db.one(
    'UPDATE primary_user_interests SET topic_id = $<topicId> WHERE user_id = $<userId>',
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
