/* eslint-disable no-console */
// Hooks up demo boilerplate application with webpack's development server. Not essential for
// understanding how to code frontend codebases; just makes demo easier to run and update.

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config.js';

import createApp from './backend_app';

const app = express();
const port = 3000;
const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: { colors: true },
}));
app.use(webpackHotMiddleware(compiler, {
  log: console.log,
}));

const devApp = createApp(app);
devApp.listen(port, () => console.log(`Listening on localhost:${port}`));
