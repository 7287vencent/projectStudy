const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
  VueLoaderPlugin
} = require('vue-loader')
const webpack = require('webpack')
// const HappyPack = require('happypack');
// const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
// console.log(CommonsChunkPlugin)
const createCachePath = (dir) => {
  return path.resolve(__dirname, 'node_modules', 'cache', dir)
}

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js',
  },
  output: {
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[name].bundle.js',
    // ? 资源引用的路径
    // publicPath: './',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [{
        test: /\.vue$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [{
            loader: 'cache-loader',
            options: {
              cacheDirectory: createCachePath('vue-loader')
            }
          },
          {
            loader: 'thread-loader'
          },
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              },
              cacheDirectory: createCachePath('vue-loader')
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{
            loader: 'cache-loader',
            options: {
              cacheDirectory: createCachePath('babel-loader')
            }
          },
          {
            loader: 'thread-loader'
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [{
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            // options: {
            //   importLoaders: 2
            // }
          },
          {
            loader: 'postcss-loader'
          },
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [{
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass'),
              additionalData: `@import "@/assets/css/themeVar.scss";`,
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 4096,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'static/img/[name].[hash:8].[ext]'
              }
            }
          }
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 4096,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'static/media/[name].[hash:8].[ext]'
              }
            }
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 4096,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'static/fonts/[name].[hash:8].[ext]'
              }
            }
          }
        }]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    }),
    // new webpack.DefinePlugin({
    //   "process.env": {
    //     NODE_ENV: JSON.stringify("development")
    //   }
    // }),
  ],
  devServer: {
    hot: true,
    port: 8080,
    // static: './dist'
  },
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js',
      '@': path.resolve('src')
    },
    extensions: [
      '.js',
      '.vue'
    ],
    // ? 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // ? 其中 __dirname 表示当前工作目录，也就是项目根目录
    modules: [path.resolve(__dirname, 'node_modules')],
    // ? 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件，使用 Tree Shaking 优化
    // ? 只采用 main 字段作为入口文件描述字段，以减少搜索步骤
    mainFields: ['jsnext:main', 'main'],
  },
  // ? 优化，切分包
  optimization: {
    splitChunks: {
      chunks: 'async',
      // minSize: 20000,
      // minRemainingSize: 0,
      // minChunks: 1,
      // maxAsyncRequests: 30,
      // maxInitialRequests: 30,
      // enforceSizeThreshold: 50000,
      cacheGroups: {
        
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'all'
        },
        vue: {
          test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
          name: 'vue',
          priority: 30,
          chunks: 'all',
        },
        elementUI: {
          name: 'element',
          priority: 20,
          test: /[\\/]node_modules[\\/](element-ui)[\\/]/,
          chunks: 'all',
        },
        // commons: {
        //   name: 'chunk-commons',
        //   test: resolve('src/components'), // can customize your rules
        //   minChunks: 3, //  minimum common number
        //   priority: 5,
        //   reuseExistingChunk: true
        // }
      }
    }
  }
}