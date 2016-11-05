import pgPromise from 'pg-promise';

const dbConfig = process.env.NODE_ENV === 'production' ? {
  host: process.env.GYMI_WEBSITE_PROD_DB_HOST,
  database: process.env.GYMI_WEBSITE_PROD_DB_DATABASE,
  user: process.env.GYMI_WEBSITE_PROD_DB_USERNAME,
  password: process.env.GYMI_WEBSITE_PROD_DB_PASSWORD,
  port: 5432,
  ssl: true,
} : {
  host: process.env.GYMI_WEBSITE_DEV_DB_HOST,
  database: process.env.GYMI_WEBSITE_DEV_DB_DATABASE,
  user: process.env.GYMI_WEBSITE_DEV_DB_USERNAME,
  password: process.env.GYMI_WEBSITE_DEV_DB_PASSWORD,
  port: 5432,
  ssl: true,
};
const db = pgPromise()(dbConfig);

export default db;
