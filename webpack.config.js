/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint no-undef: "off"*/
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './index.ts',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      '@flux': path.resolve(__dirname, 'src/modules/flux'),
      '@api': path.resolve(__dirname, 'src/modules/api'),
      '@validation': path.resolve(__dirname, 'src/modules/validation'),
      '@reducers': path.resolve(__dirname, 'src/reducers'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@configs': path.resolve(__dirname, 'src/configs'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@models': path.resolve(__dirname, 'src/models'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@actions': path.resolve(__dirname, 'src/actions'),
      '@style': path.resolve(__dirname, 'src/style'),
      '@icon': path.resolve(__dirname, 'static/icon'),
      '@img': path.resolve(__dirname, 'static/img'),
      '@font': path.resolve(__dirname, 'static/font'),
      '@date': path.resolve(__dirname, 'src/modules/date'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devServer: {
    port: 4200,
    historyApiFallback: true,
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      favicon: '../static/icon/favicon.ico',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'stylus-loader',
        ],
      },
      {
        test: /\.(handlebars|hbs)$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|ico)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
