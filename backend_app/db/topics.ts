/**
 * Database methods related to retrieving and updating topics—
 * that is, potential interests that a user can have.
 */

import db, {Id} from 'backend/db';

const list = (showArchived = false) => new Promise((resolve, reject) => {
  const defaultColumns = ['id', 'title'];
  const columns = showArchived ? defaultColumns.concat('archived') : defaultColumns;
  const clause = showArchived ? '' : 'WHERE archived = false';
  const query = `SELECT $<columns:name> FROM topics ${clause}`;
  db.manyOrNone(query, { columns }).then(resolve).catch(reject);
});

const destroy = (id: Id) => new Promise((resolve, reject) => {
  const query = 'UPDATE topics SET archived = true WHERE id = $<id>';
  db.oneOrNone(query, { id }).then(resolve).catch(reject);
});

const create = (title: string) => new Promise((resolve, reject) => {
  const query = `
    INSERT INTO topics (title) VALUES ($<title>)
    ON CONFLICT (title) DO UPDATE SET archived = false
    RETURNING id`;
  db.one(query, { title }).then(resolve).catch(reject);
});

export default {
  list,
  destroy,
  create
};
