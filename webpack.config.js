import path from 'node:path';
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: path.resolve(dirname, 'src/index.ts'),
  output: {
    path: path.resolve(dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(dirname, 'index.html'),
    }),
  ],
  devServer: {
    static: path.resolve(dirname, 'public'),
    port: 9000,
    hot: true,
    open: false,
    historyApiFallback: true,
  },
};
