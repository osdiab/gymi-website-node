import db from './';

const list = (showArchived = false) => new Promise((resolve, reject) => {
  const columns = ['id', 'title'];
  const query = `SELECT $<columns:name> FROM periods`;
  db.manyOrNone(query, { columns }).then(resolve).catch(reject);
});

const create = title => new Promise((resolve, reject) => {
  const query = `
    INSERT INTO periods (title) VALUES ($<title>)`;
  db.one(query, { title }).then(resolve).catch(reject);
});

export default {
  list,
  create,
};
