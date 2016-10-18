const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, 'frontend_app.js'),
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
        loader: 'style!css!less',
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
};

