import sqlite3 from 'sqlite3';
import path from 'path';

const db = new (sqlite3.verbose()).Database(path.join(__dirname, '..', '..', 'db', 'dev.db'));

export default db;
