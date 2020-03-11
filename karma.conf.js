const webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    port: 9876,
    exclude: [],
    colors: true,
    basePath: '',

    autoWatch: true,
    singleRun: false,
    runnerPort: 9100,

    concurrency: Infinity,
    urlRoot: '/__karma__/',
    reporters: ['progress'],
    autoWatchBatchDelay: 500,
    logLevel: config.LOG_INFO,

    frameworks: ['mocha', 'chai'],
    browsers: ['Chrome', 'Firefox'],
    browserNoActivityTimeout: 60000,

    files: [ 'tests/**/*.js' ],
    client: { captureConsole: true },
    preprocessors: { 'tests/**/*.js': ['webpack'] },

    webpack: {
      resolve: webpackConfig.resolve,
      module: webpackConfig.module,

      devtool: 'inline-source-map',
      mode: 'development'
    },

    webpackServer: {
      noInfo: true
    }
  });
};
