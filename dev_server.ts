
// Hooks up demo boilerplate application with webpack's development server. Not essential for
// understanding how to code frontend codebases; just makes demo easier to run and update.

import * as express from 'express';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config';

import router from './backend_app/router';

require('babel-polyfill');

const app = express();
const port = 3000;
const compiler = webpack(webpackConfig[0]);

// hook in webpack-compiled and bundled code (javascript, stylesheets...)
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig[0].output.publicPath,
  stats: { colors: true },
}));

// hot refresh changes to compiled code.
app.use(webpackHotMiddleware(compiler, {
  log: console.log,
}));

// hook in the app's actual endpoints
app.use(router());

// listen for requests
app.listen(port, () => console.log(`Listening on localhost:${port}`));
