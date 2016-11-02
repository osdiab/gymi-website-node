const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = [
  {
    name: 'frontend_app',
    entry: [
      'webpack-hot-middleware/client',
      'babel-polyfill',
      path.join(__dirname, 'frontend_app', 'index.js'),
    ],
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
    module: {
      devtool: 'eval-source-map',
      loaders: [
        {
          test: /\.(eot|woff|svg|ttf|png)$/,
          loader: 'url',
        },
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
        },
        {
          test: /\.less$/,
          loader: 'style!css!postcss!less',
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel',
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
      path.join(__dirname, 'backend_app', 'index.js'),
    ],
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'backend.bundle.js',
      publicPath: '/',
      libraryTarget: 'commonjs2',
    },
    target: 'node',
    externals: [nodeExternals()],
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
    module: {
      devtool: 'eval-source-map',
      loaders: [
        {
          test: /\.(eot|woff|svg|ttf|png)$/,
          loader: 'url',
        },
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
        },
        {
          test: /\.less$/,
          loader: 'style!css!postcss!less',
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel',
        },
      ],
    },
    plugins: [
    ],
    postcss: [autoprefixer({ browsers: ['> 5% in CN', '> 5% in US', 'last 2 versions', 'ie >= 9'] })],
  },
];
