import db from './';

function list() {
  return new Promise((resolve, reject) => {
    const columns = ['id', 'title'];
    const query = 'SELECT $<columns:name> FROM periods';
    db.manyOrNone(query, { columns }).then(resolve).catch(reject);
  });
}

function create(title) {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO periods (title) VALUES ($<title>)`;
    db.one(query, { title }).then(resolve).catch(reject);
  });
}

export default {
  list,
  create,
};
