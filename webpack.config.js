const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: {
    app: './public/src/main.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public',
    hot: true
  },
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'public/dist')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|ttc)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      },
      { 
        test: /\.vue$/, 
        loader: 'vue-loader',
      }
    ],
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(vue|js)$/, loader: 'babel-loader' },
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.s[a|c]ss/, loader: 'style!css!sass'}
    ]
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};