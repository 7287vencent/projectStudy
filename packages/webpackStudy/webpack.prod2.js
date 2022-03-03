const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
    VueLoaderPlugin
} = require('vue-loader')
const webpack = require('webpack')
const TerserPlugin = require("terser-webpack-plugin"); // ? js 代压缩
const CompressionPlugin = require("compression-webpack-plugin"); // ? 压缩算法
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')// ? css 压缩算法
// const HappyPack = require('happypack');
// const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
// console.log(CommonsChunkPlugin)

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer') // ? 文件体积分析
// ? 为模块提供了中间缓存 优化手段，应该也是不兼容webpack5
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const createCachePath = (dir) => {
    return path.resolve(__dirname, 'node_modules', 'cache', dir)
}

module.exports = {
    mode: 'production',
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
        // ? 配置哪些库不需要解析
        noParse: /^(vue|vue-router|vuex|vuex-router-sync|element-ui)$/,
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
                oneOf: [{
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
                                    implementation: require('dart-sass')
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
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html')
        }),
         new OptimizeCssAssetsWebpackPlugin(), 
        // new HardSourceWebpackPlugin(),
        new CompressionPlugin({
            test: /\.(js|css)$/i,
            algorithm: 'gzip', // ? 压缩算法
            threshold: 8192, // ? 大于这个数字节的文件再压缩
            minRatio: 0.8, // ? 最小率
        }),
        // ? 打包体积分析
        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
            generateStatsFile: true, // 是否生成stats.json文件 
        })
        // new webpack.DefinePlugin({
        //   "process.env": {
        //     NODE_ENV: JSON.stringify("development")
        //   }
        // }),
    ],
    devtool: 'inline-source-map',
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.runtime.esm.js'
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
    resolveLoader:{
     modules: ['node_modules'],
    },   
    // ? 优化，切分包
    optimization: {
        splitChunks: {
            chunks: 'all', // 分割同步异步的代码
            // minSize: 20000, // ? 最小体积
            // minRemainingSize: 0, // ? 代码分割后的最小保留体积，默认等同于minSize
            // minChunks: 1, 
            // maxAsyncRequests: 30,
            // maxInitialRequests: 30,
            // enforceSizeThreshold: 50000,

            // chunks: 'all',  // 分割同步异步的代码
            // minSize: 0,    // 最小体积
            // minRemainingSize: 0, // 代码分割后的最小保留体积，默认等于minSize
            // maxSize: 0,  // 最大体积
            // minChunks: 1,  // 最小代码快
            // maxAsyncRequests: 30, // 最大异步请求数
            // maxInitialRequests: 30, // 最小异步请求数
            // automaticNameDelimiter: '~', // 名称分离符
            // enforceSizeThreshold: 50000, //执行拆分的大小阈值，忽略其他限制
            // (minRemainingSize、maxAsyncRequests、maxInitialRequests) 
            cacheGroups: { // ? 缓存分组

                libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'all'
                },
                vue: {
                    test: /[\\/]node_modules[\\/](vue)[\\/]/,
                    name: 'vue',
                    priority: 30,
                    chunks: 'all',
                },
                'vue-router': {
                    test: /[\\/]node_modules[\\/](vue-router)[\\/]/,
                    name: 'vue-router',
                    priority: 30,
                    chunks: 'all',
                },
                vuex: {
                    test: /[\\/]node_modules[\\/](vuex)[\\/]/,
                    name: 'vuex',
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
        },
        // ? js 优化
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                ecma: undefined,
                warnings: false,
                parse: {},
                compress: {
                    drop_console: true,
                    drop_debugger: false,
                    pure_funcs: ['console.log'], // 移除console
                },
            },
        })]
    }
}