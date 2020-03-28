const webpackConfig = require('../webpack.config');

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

    files: [ './karma/**/*.js' ],
    frameworks: ['mocha', 'chai'],
    browsers: ['Chrome', 'Firefox'],
    browserNoActivityTimeout: 60000,
    client: { captureConsole: true },

    preprocessors: {
      './karma/**/*.js': ['webpack']
    },

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
