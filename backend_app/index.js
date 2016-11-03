/* eslint-disable no-console */
// Defines an express app that runs the boilerplate codebase.

import express from 'express';
import forceSsl from 'express-force-ssl';
import https from 'https';
import http from 'http';
import fs from 'fs';

import createRouter from './router';

const app = express();
if (process.env.NODE_ENV === 'production') {
  app.use(forceSsl);
}
app.use(createRouter());

if (process.env.NODE_ENV === 'production') {
  const sslOptions = {
    key: fs.readFileSync(process.env.PRIVKEY_CERT_LOC),
    cert: fs.readFileSync(process.env.FULLCHAIN_CERT_LOC),
  };
  http.createServer(app).listen(80);
  https.createServer(sslOptions, app).listen(443);
} else {
  const port = 3000;
  http.createServer(app).listen(3000, () => console.log(`Listening on port ${port}`));
}
