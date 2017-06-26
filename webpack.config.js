var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

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
    vendor: ['react', 'react-dom', 'react-router'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: `[name].[hash:8].js`
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
        test: /\.(css|scss)$/,
        loader: "style-loader!css-loader!sass-loader"
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(ttf|eot|otf|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        include: /icons\/fonts/,
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

      // {
      // 	test: /\.(ico|png|jpg|svg)$/,
      // 	loader: 'file-loader',
      // 	options: {
      // 		limit: 10240,
      // 		name: 'images/[name].[ext]?v=[hash:base64:5]'
      // 	}
      // }
    ]
  },
  devServer: {
    compress: true,
    port: 9001,
    contentBase: path.join(__dirname, "dist"),
    historyApiFallback: {
      index: "/dist/"
    },
    noInfo: true,
    proxy: {
      "/api": {
        target: "http://localhost:4003",
        pathRewrite: {"^/api" : ""}
      }
    }
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
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
      title: 'wechat-dev'
    })
  ]

}

if (process.env.NODE_ENV === 'development') {
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      },
      BASENAME: JSON.stringify("/dist/"),
      'process.env.IP': JSON.stringify(getIPAdress())
    })
  ])
}

if (process.env.NODE_ENV === 'production') {
  delete webpackConfig.devtool;
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      BASENAME: JSON.stringify("/dist/"),
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
    })
  ])

}

module.exports = webpackConfig;