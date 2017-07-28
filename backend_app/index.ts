/**
 * Creates and runs the GYMI website app.
 */

import * as express from 'express';
import * as forceSsl from 'express-force-ssl';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';

import config from 'backend/config';
import createRouter from 'backend/router';

const app = express();
if (config.production) {
  app.use(forceSsl);
}
app.use(createRouter());

if (config.production) {
  const sslOptions = {
    key: fs.readFileSync(config.production.PRIVKEY_CERT_LOC),
    cert: fs.readFileSync(config.production.FULLCHAIN_CERT_LOC)
  };
  http.createServer(app).listen(80);
  https.createServer(sslOptions, app).listen(443);
} else {
  const port = 3000;
  // tslint:disable-next-line:no-console
  http.createServer(app).listen(3000, () => console.log(`Listening on port ${port}`));
}
