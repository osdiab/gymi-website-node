/* eslint-disable no-console */
// Defines an express app that runs the boilerplate codebase.

import express from 'express';

import createRouter from './router';

const port = 3000;
const app = express();
app.use(createRouter());
app.listen(port, () => console.log(`Listening on port ${port}`));
