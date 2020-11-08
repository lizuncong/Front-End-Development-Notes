const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const InlineChunkHtmlPlugin = require('./inlineChunkHtmlPlugin');


module.exports = (mode) => {
  const isEnvProduction = mode === 'production';
  return {
    mode: isEnvProduction ? 'production' : 'development',
    entry: {
      main: path.resolve(__dirname, '../src/index.jsx'),
    },
    output: {
      path: isEnvProduction ? path.resolve(__dirname, '../dist') : undefined,
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/bundle.js',
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',
      futureEmitAssets: true,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        src: path.resolve(__dirname, '../src'),
      },
    },
    optimization: {
      usedExports: true,
      minimize: isEnvProduction,
      splitChunks: {
        chunks: 'all',
        name: false,
      },
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          oneOf: [
            {
              test: /\.jsx?$/,
              include: path.resolve(__dirname, '../src'),
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                    compact: isEnvProduction,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin(
        {

          inject: true,
          template: 'src/index.html',
          ...(isEnvProduction
            ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
            : undefined),
        },
      ),
      isEnvProduction
      && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      new CleanWebpackPlugin(),
    ].filter(Boolean),
    performance: false,
  };
};
