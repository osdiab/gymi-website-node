/**
 * Database methods related to retrieving and creating periods—that is, sessions
 * of GYMI mentorship.
 */
import db from 'backend/db';

async function list() {
  const columns = ['id', 'title'];
  const query = 'SELECT $<columns:name> FROM periods';

  return await db.manyOrNone(query, { columns });
}

function create(title: string) {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO periods (title) VALUES ($<title>)`;
    db.one(query, { title }).then(resolve).catch(reject);
  });
}

export default {
  list,
  create
};
