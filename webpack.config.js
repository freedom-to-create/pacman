/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');

const config = {
  entry: './src/pacman.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'src'),
        publicPath: '/',
      },
      {
        directory: path.join(__dirname, 'src/css'),
        publicPath: '/css',
      },
      {
        directory: path.join(__dirname, 'img'),
        publicPath: '/img',
      },
    ],
  },
};

module.exports = config;
