import db from './';

const list = () => new Promise((resolve, reject) => {
  const columns = ['id', 'title'];
  const query = 'SELECT $<columns:name> FROM topics';
  db.manyOrNone(query, { columns }).then(resolve).catch(reject);
});

const destroy = id => new Promise((resolve, reject) => {
  const query = 'UPDATE topics SET archived = true WHERE id = $<id>';
  db.oneOrNone(query, { id }).then(resolve).catch(reject);
});

const create = title => new Promise((resolve, reject) => {
  const query = 'INSERT INTO topics (title) VALUES ($<title>) RETURNING id';
  db.one(query, { title }).then(resolve).catch(reject);
});

export default {
  list,
  destroy,
  create,
};
