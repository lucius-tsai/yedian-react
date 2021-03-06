var path = require('path');
var webpack = require('webpack');
var fs = require('fs-extra');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
  filename: "[name].[hash:8].css",
  disable: false,
  allChunks: true
});

var getIPAdress = function () {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
};

var webpackConfig = {
  entry: {
    app: './src/app.js',
    vendor: ['react', 'react-dom', 'react-router', 'redux', 'axios'],
  },
  output: {
    path: path.resolve(__dirname, './app_tmp'),
    publicPath: '/app/',
    filename: `[name].[hash:8].js`,
    chunkFilename: `[name]-[id].[chunkhash:8].bundle.js`
  },
  resolve: {
    modules: ['./src', './node_modules'],
    extensions: ['.js', '.jsx', '.scss', '.css', '.json']
  },
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
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
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
        use: ['style-loader','css-loader']
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
  devServer: {
    compress: true,
    host: getIPAdress(),
    port: 9001,
    contentBase: path.join(__dirname, "app"),
    historyApiFallback: {
      index: "/app/"
    },
    noInfo: true,
    proxy: {
      "/api": {
        target: "http://localhost:4003",
        pathRewrite: { "^/api": "" }
      }
    }
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    extractSass
  ]

}

if (process.env.NODE_ENV === 'localhost') {
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('localhost')
      },
      BASENAME: JSON.stringify("/app/"),
      'process.env.IP': JSON.stringify(getIPAdress())
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: false,
      // favicon: base('static/favicon.ico'),
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true
      },
      title: 'wechat-dev',
      env: {
        production: false
      }
    })
  ]);
}

if (process.env.NODE_ENV === 'development') {
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      },
      BASENAME: JSON.stringify("/app/"),
      'process.env.IP': JSON.stringify(getIPAdress())
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: false,
      // favicon: base('static/favicon.ico'),
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true
      },
      title: 'NIGHT+',
      env: {
        production: false
      }
    })
  ]);
  fs.ensureDirSync(path.resolve(__dirname, './app/mockData'));
  fs.copySync(path.resolve(__dirname, './mockData'), path.resolve(__dirname, './app/mockData'))
}

if (process.env.NODE_ENV === 'staging') {
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('staging')
      },
      BASENAME: JSON.stringify("/app/"),
      'process.env.IP': JSON.stringify(getIPAdress())
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: false,
      // favicon: base('static/favicon.ico'),
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true
      },
      title: 'wechat-dev',
      env: {
        production: false
      }
    })
  ]);
  fs.ensureDirSync(path.resolve(__dirname, './app/mockData'));
  fs.copySync(path.resolve(__dirname, './mockData'), path.resolve(__dirname, './app/mockData'))

  fs.ensureDirSync(path.resolve(__dirname, './app/static'));
  fs.copySync(path.resolve(__dirname, './static'), path.resolve(__dirname, './app/static'))
}

if (process.env.NODE_ENV === 'production') {
  delete webpackConfig.devtool;
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      BASENAME: JSON.stringify("/app/"),
      'process.env.IP': JSON.stringify(getIPAdress())
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: false,
      // favicon: base('static/favicon.ico'),
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true
      },
      title: 'wechat-dev',
      env: {
        production: true
      }
    })
  ]);

  fs.ensureDirSync(path.resolve(__dirname, './app/mockData'));
  fs.copySync(path.resolve(__dirname, './mockData'), path.resolve(__dirname, './app/mockData'))

  fs.ensureDirSync(path.resolve(__dirname, './app/static'));
  fs.copySync(path.resolve(__dirname, './static'), path.resolve(__dirname, './app/static'))
}

module.exports = webpackConfig;