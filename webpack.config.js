// TODO: this needs to be cleaned up
// TODO: add hot module reloading on the backend workflow as well
// TODO: get server side rendering working on backend
const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
  {
    name: 'frontend_app',
    entry: [
      'webpack-hot-middleware/client',
      'whatwg-fetch',
      'babel-polyfill',
      path.join(__dirname, 'frontend_app', 'index.ts'),
    ],
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
    },
    alias: {
      backend: path.join(__dirname, "backend_app"),
      frontend: path.join(__dirname, "frontend_app"),
      common: path.join(__dirname, "common"),
    },
    module: {
      devtool: 'eval-source-map',
      loaders: [
        {
          test: /\.(eot|woff|svg|ttf|png)$/,
          loader: 'url',
        },
        {
          test: /\.(css|less)$/i,
          loader: 'style-loader!css-loader!postcss-loader!less-loader',
        },
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
        },
      ],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
    postcss: [autoprefixer({ browsers: ['> 5% in CN', '> 5% in US', 'last 2 versions', 'ie >= 9'] })],
  },
  {
    name: 'backend_app',
    entry: [
      'babel-polyfill',
      path.join(__dirname, 'backend_app', 'index.ts'),
    ],
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'backend.bundle.js',
      libraryTarget: 'commonjs2',
    },
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    externals: [nodeExternals({
      whitelist: [/\.(?!(?:(j|t)sx?|json)$).{1,5}$/i],
    })],
    resolve: {
      extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
    },
    alias: {
      backend: path.join("__dirname", "backend_app"),
      frontend: path.join("__dirname", "frontend_app"),
      common: path.join("__dirname", "common"),
    },
    module: {
      devtool: 'eval-source-map',
      loaders: [
        {
          test: /\.(eot|woff|svg|ttf|png)$/,
          loader: 'url',
        },
        {
          test: /\.(css|less)$/i,
          loader: ExtractTextPlugin.extract(
            'style-loader', 'css-loader!postcss-loader!less-loader'
          ),
        },
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
        },
      ],
    },
    plugins: [
      new ExtractTextPlugin(path.join('..', 'public', 'stylesheets', 'bundle.css')),
    ],
    postcss: [autoprefixer({ browsers: ['> 5% in CN', '> 5% in US', 'last 2 versions', 'ie >= 9'] })],
  },
];
