/* eslint-disable no-console */
// Hooks up demo boilerplate application with webpack's development server. Not essential for
// understanding how to code frontend codebases; just makes demo easier to run and update.

import backendApp from './backend_app';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config.js';

const port = 3000;
const compiler = webpack(webpackConfig);

backendApp.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: { colors: true },
}));
backendApp.use(webpackHotMiddleware(compiler, {
  log: console.log,
}));
backendApp.listen(port, () => console.log(`Listening on localhost:${port}`));
