const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

const devConfig = {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: '../dist',
    open: true,
    overlay: true,
    hot: true,
    port: 8008,
    historyApiFallback: true,
  },
};

const config = merge(baseConfig('development'), devConfig);
module.exports = config;
