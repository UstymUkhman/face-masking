const path = require('path');
const webpack = require('webpack');
const env = require('yargs').argv.env;
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

let libraryName = 'FaceTracking';
let plugins = [], outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

const config = {
  entry: __dirname + '/src/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.glsl|\.frag|\.vert)$/,
        loader: 'raw-loader'
      },
      {
        test: /(\.glsl|\.frag|\.vert)$/,
        loader: 'glslify'
      }
    ]
  },

  resolve: {
    modules: [path.resolve('./src'), path.resolve('./node_modules')],
    extensions: ['.json', '.js']
  },

  plugins: plugins
};

module.exports = config;
