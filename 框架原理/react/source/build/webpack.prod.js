const merge = require('webpack-merge');
const isWsl = require('is-wsl');
const TerserPlugin = require('terser-webpack-plugin');
const baseConfig = require('./webpack.base');

const prodConfig = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
            drop_console: true,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: !isWsl,
        cache: true,
        sourceMap: true,
      }),
    ],
  },
};
const config = merge(baseConfig('production'), prodConfig);
module.exports = config;
