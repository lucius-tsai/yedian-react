var path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      '__test__/**/*.js'
    ],
    preprocessors: {
      '__test__/**/*.js': ['webpack', 'sourcemap'],
      'src/**/*.js': ['webpack', 'sourcemap']
    },
    webpack: { //kind of a copy of your webpack config
      devtool: '#eval-source-map',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            enforce: 'pre',
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015', 'react', 'stage-0'],
              plugins: ['transform-runtime', "transform-decorators-legacy", "transform-class-properties"],

            }
          }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  query: {
                    modules: true,
                    sourceMap: true,
                    importLoaders: 1,
                    localIdentName: '[local]_[hash:base64:5]'
                  }
                }, {
                  loader: 'resolve-url-loader'
                },
                {
                  loader: 'postcss-loader'
                }, {
                  loader: "sass-loader"
                }
              ]
            })
          },
          {
            test: /\.css$/,
            loader: ['style-loader', 'css-loader']
          },
          {
            test: /\.json$/,
            loader: 'json-loader'
          },
          {
            test: /\.(ttf|eot|otf|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            include: /icons\/fonts|node_modules/,
            loader: 'url-loader',
            options: {
              limit: 1024,
              prefix: 'font/'
            }
          },
          {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]'
          }
        ]
      },
      externals: {
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      }
    },

    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    },

    plugins: [
      'karma-webpack',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher'
    ],


    babelPreprocessor: {
      options: {
        presets: ['airbnb']
      }
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
  })
};
