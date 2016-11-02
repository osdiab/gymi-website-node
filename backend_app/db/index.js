import pgPromise from 'pg-promise';

const db = pgPromise()({
  host: process.env.GYMI_WEBSITE_DEV_DB_HOST,
  database: process.env.GYMI_WEBSITE_DEV_DB_DATABASE,
  user: process.env.GYMI_WEBSITE_DEV_DB_USERNAME,
  password: process.env.GYMI_WEBSITE_DEV_DB_PASSWORD,
  port: 5432,
  ssl: true,
});

export default db;
