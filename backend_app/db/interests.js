import pgPromise from 'pg-promise';

import db from './';

const list = userId => new Promise((resolve, reject) => {
  const columns = ['title'];
  const query = `SELECT $<columns:name> FROM user_interests WHERE user_id = ${userId}`;
  db.manyOrNone(query, { columns }).then(resolve).catch(reject);
});

const update = (userId, primaryInterest, interests) => new Promise((resolve, reject) => {
  const primaryQuery = 'UPDATE primary_user_interests SET topic_id = $<primaryInterest> WHERE user_id = $<userId>';
  db.tx(tx =>
    tx.one(primaryQuery, { userId, primaryInterest }).then(() =>
      tx.none('DELETE FROM user_interests WHERE user_id = $<userId>', { userId })
    ).then(() => {
      const insertColumns = new pgPromise.helpers.ColumnSet([
        'user_id', 'topic_id',
      ], { table: 'user_interests' });
      const insertQuery = pgPromise.helpers.insert(
        interests.map(i => ({ user_id: userId, topic_id: i })), insertColumns
      );
      return tx.manyOrNone(insertQuery);
    })
  ).then(resolve).catch(reject);
});

export default {
  list,
  update,
};

