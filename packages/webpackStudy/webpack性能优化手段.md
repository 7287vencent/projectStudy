## 5.9 webpack性能优化

### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_5-9-1-webpack数据分析)5.9.1 webpack数据分析

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#webpack-bundle-analyzer-文件体积分析)webpack-bundle-analyzer(文件体积分析)

它能分析打包出的文件有哪些，大小占比如何，模块包含关系，依赖项，文件是否重复，压缩后大小

1. webpack.config.js

```js
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
module.exports={
plugins: [
    new BundleAnalyzerPlugin({
    analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
    generateStatsFile: true, // 是否生成stats.json文件 
    })
 ] 
}
```

1. package.json

```json
"scripts": {
  "build": "webpack",
  "start": "webpack serve",
  "dev":"webpack  --progress",
   "analyzer": "webpack-bundle-analyzer --port 8888 ./dist/stats.json"
}
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#speed-measure-webpack-plugin-分析打包速度)speed-measure-webpack-plugin（分析打包速度）

1. webpack.config.js

```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack5-plugin');
const smw = new SpeedMeasureWebpackPlugin();
module.exports = smw.wrap({
  mode: "development",
  devtool: 'source-map',
  ...
});
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#friendly-errors-webpack-plugink-美化输出日志)friendly-errors-webpack-pluginK(美化输出日志)

```bash
yarn friendly-errors-webpack-plugin  node-notifier -D
```

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');

module.exports = {
  mode: "development",
  devtool: 'source-map',
  context: process.cwd(),
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
}, 
plugins:[
    new HtmlWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin({
    onErrors: (severity, errors) => {
    const error = errors[0];
    notifier.notify({
    title: "Webpack编译失败",
    message: severity + ': ' + error.name, subtitle: error.file || '',
    })
    }
  })
 ] 
};
```

### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_5-9-2-编译时间优化)5.9.2 编译时间优化

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_1-extensions)🍅 1. extensions

- 添加extensions后我们在用`require`、`import`的时候不用添加文件扩展名
- 编译的时候会依次添加扩展名进行匹配

```js
module.exports = {
    resolve: {
        extensions:[".js"、".jsx"、".json"]
    }
}
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_2-alias)🍅 2. alias

配置文件别名可以加快webpack查找模块的速度

```js
const elementUi = path.resolve(__dirname,'node_modules/element-ui/lib/theme-chalk/index.css')
module.exports = {
        resolve: {
        extensions:[".js"、".jsx"、".json"],
        alias: {'element-ui'}
    }
}
```

当我们引入elementUi模块的时候，它会直接引入elementUi，不需要从node_modules文件中按模块规则查找

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_3-modules)🍅 3. modules

指定项目的所有第三方模块都是在项目根目录下的node_modules

```js
const elementUi = path.resolve(__dirname,'node_modules/element-ui/lib/theme-chalk/index.css')
module.exports = {
        resolve: {
        extensions:[".js"、".jsx"、".json"],
        modules: ['node_modules']
    }
}
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_4-oneof)🍅 4. oneOf

- 每个文件对于rules中的所有规则都会遍历一遍，如果使用oneOf，只要能匹配一个就立即退出
- 在oneOf中不能2个配置处理同一类型文件

```js
module.exports = {
  module: {
    rules: [{
     oneOf:[
         {
          test: /\.js$/,
          include: path.resolve(__dirname, "src"),
          exclude: /node_modules/,
          use: [
                {
                loader: 'thread-loader',
                options: {
                workers: 3 
                }
            },
            {
              loader:'babel-loader',
              options: {
                cacheDirectory: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: ['cache-loader','logger-loader', 'style-loader', 'css-loader']
       } 
     ]
    }]
  }
}
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_5-external)🍅 5. external

如果某个库我们不想让它被webpack打包，想让它用cdn的方法是引入，并且不影响我们在程序中以CMD、AMD方式进行使用

下载插件

```bash
yarn add html-webpack-externals-plugin -D
```

在html文件中引入cdn的文件

```html
<script src="https://cdn.abc.com/vue/2.5.11/vue.min.js"></script>
```

webpack中的配置

```bash
 externals: {
  vue: 'vue',
},
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_6-resolveloader)🍅 6. resolveLoader

就是指定loader的resolve，只作用于loader；resolve配置用来影响webpack模块解析规则。解析规则也可以称之为检索，索引规则。配置索引规则能够缩短webpack的解析时间，提升打包速度。

```js
module.exports = {
    resolve: {
        extensions:[".js"、".jsx"、".json"],
        modules: ['node_modules']
    },
    resolveLoader:{
     modules: [path.resolve(__dirname, "loaders"),'node_modules'],
  },   
}
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_7-noparse)🍅 7. noParse

- 用于配置哪些模块的文件内容不需要进行解析
- 不需要解析依赖就是没有依赖的第三方大型类库，可以配置这个字段，以提高整体的构建速度
- 使用noparse进行忽略的模块文件中不能使用import、require等语法

```js
module.exports = {
module: {
    noParse: /test.js/, // 正则表达式
 } 
}
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_8-thread-loader-多进程)🍅 8. thread-loader(多进程)

- 把thread-loader放置在其他 loader 之前
- include 表示哪些目录中的 .js 文件需要进行 babel-loader
- exclude 表示哪些目录中的 .js 文件不要进行 babel-loader
- exclude 的优先级高于 include ,尽量避免 exclude ，更倾向于使用 include

```js
module.exports = {
  module: {
    rules: [{
     oneOf:[
         {
          test: /\.js$/,
          include: path.resolve(__dirname, "src"),
          exclude: /node_modules/,
          use: [
                {
                loader: 'thread-loader',
                options: {
                  workers: require('os').cpus().length - 1 // 自己电脑的核心数减1
                }
            },
            {
              loader:'babel-loader',
              options: {
             // babel在转移js非常耗时间，可以将结果缓存起来，下次直接读缓存；默认存放位置是 node_modules/.cache/babel-loader
                cacheDirectory: true 
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: ['cache-loader','logger-loader', 'style-loader', 'css-loader']
       } 
     ]
    }]
  }
}
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_8-cache-loader)🍅 8. cache-loader

- 在一些性能开销较大的loader之前添加cache-loader，可以将结果缓存到磁盘中
- 默认保存在 node_modules/.cache/cache-loader 目录下

```js
module.exports = {
  module: {
    rules: [{
     oneOf:[
        {
          test: /\.css$/,
          use: ['cache-loader','logger-loader', 'style-loader', 'css-loader']
       } 
     ]
    }]
  }
}
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_9-hard-source-webpack-plugin)🍅 9. hard-source-webpack-plugin

- HardSourceWebpackPlugin 为模块提供了中间缓存,缓存默认的存放路径是 node_modules/.cache/hard-source
- 配置 hard-source-webpack-plugin 后，首次构建时间并不会有太大的变化，但是从第二次开始， 构建时间大约可以减少80% 左右
- webpack5中已经内置了模块缓存,不需要再使用此插件

```bash
yarn add hard-source-webpack-plugin -D
```

```js
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
plugins: [
   new HardSourceWebpackPlugin()
 ] 
}
```

### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_5-9-3-编译体积优化)5.9.3 编译体积优化

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_1-压缩js、css、html和图片)🍅 1. 压缩js、css、HTML和图片

- optimize-css-assets-webpack-plugin是一个优化和压缩CSS资源的插件
- terser-webpack-plugin是一个优化和压缩JS资源的插件
- image-webpack-loader可以帮助我们对图片进行压缩和优化

```bash
yarn terser-webpack-plugin optimize-css-assets-webpack-plugin image-webpack-
loader -D
```

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {,
  optimization: {
     minimize: true
     minimizer: [
         new TerserPlugin()
     ]
  },
   module:{
     rules:[
         {
          test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
          use: [
            'url-loader',
            {
                loader: 'image-webpack-loader',
                options: {
                    mozjpeg: {
                       progressive:true,
                       quality: 65 
                    },
                    optipng: {
                        enabled: false
                    },
                    pngquant: {
                        quality: '65-90',
                        speed: 4
                    },
                    gifsicle: {
                        interlaced: false
                    },
                    webp: {
                         quality: 75,
                    }
                }
            }
         }]
     ]
  },
  plugins:[
     new HtmlWebpackPlugin({
         template: './src/index.html',
          minify: {
              collapseWhitespace: true,
              removeComments: true
         }
     }) 
    new OptimizeCssAssetsWebpackPlugin(), 
  ]
 }
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_2-清除无用的css)🍅 2. 清除无用的css

purgecss-webpack-plugin单独提取CSS并清除用不到的CSS

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const glob = require("glob");
const PATHS = {
    src: path.join(__dirname, "src"),
};

module.exports = {,
  optimization: {
     minimize: true
     minimizer: [
         new TerserPlugin()
     ]
  },
   module:{
     rules:[
         {
          test: /\.css$/,
          include: path.resolve(__dirname, "src"),
          exclude: /node_modules/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,  
            },
             "css-loader",
         }]
     ]
  },
  plugins:[
     new MiniCssExtractPlugin({
         filename: "[name].css"
     }) 
    new OptimizeCssAssetsWebpackPlugin({
        paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true})
    }), 
  ]
 }
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_3-tree-shaking)🍅 3. Tree shaking

- webpack默认支持,可在 production mode下默认开启
- 在package.json 中配置:
  - "sideEffects": false 所有的代码都没有副作用(都可以进行 tree shaking)
  - 可能会把 css和@babel/polyfill 文件干掉可以设置 "sideEffects":["*.css"]

会把以下情况的代码 Tree shaking

1. 没有导入和使用

```js
function func1(){
  return 'func1';
}
function func2(){
  return 'func2';
}
export {
  func1,
  func2
}
```

```js
import {func2} from './functions';
var result2 = func2();
console.log(result2);
```

1. 代码不会被执行，不可到达

```js
if(false){
 console.log('false')
}
```

1. 代码执行的结果不会被用到

```js
import {func2} from './functions';
func2();
```

1. 代码中只写不读的变量

```js
var a=1
a= 2
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_3-scope-hoisting)🍅 3. Scope Hoisting

- Scope Hoisting 可以让 Webpack 打包出来的代码文件更小、运行的更快，它又译作 "作用域提升"，是在 Webpack3 中新推出的功能。
- scope hoisting的原理是将所有的模块按照引用顺序放在一个函数作用域里，然后适当地重命名一 些变量以防止命名冲突
- 这个功能在mode为 下默认开启,开发环境要用 webpack.optimizeModuleConcatenationPlugin 插件

doc.js

```js
export default 'test';
```

app.js

```js
import str from './doc.js';
console.log(str)
```

作用域提升

```js
var str = ('test');
console.log(str);
```

### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_5-9-4-运行速度优化)5.9.4 运行速度优化

- 对于大的Web应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当你的某些 代码块是在某些特殊的时候才会被用到。
- webpack有一个功能就是将你的代码库分割成chunks语块，当代码运行到需要它们的时候再进行 加载

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_1-入口点分割)🍅 1. 入口点分割

```js
module.exports = {
 entry: {
        index: "./src/index.js",
        login: "./src/login.js"
 }
}
```

- 这种方法的问题
  - 如果入口chunks之间包含重复的模块(lodash)，那些重复模块都会被引入到各个bundle中
  - 不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_2-懒加载)🍅 2. 懒加载

可以用`import()`方式去引入模块，当需要的时候在加载某个功能对应代码

```js
const Login = () => import(/* webpackChunkName: "login" */'@/components/Login/Login')
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_3-prefetch)🍅 3. prefetch

- 使用预先拉取，你表示该模块可能以后会用到。浏览器会在空闲时间下载该模块
- prefetch的作用是告诉浏览器未来可能会使用到的某个资源，浏览器就会在闲时去加载对应的资 源，若能预测到用户的行为，比如懒加载，点击到其它页面等则相当于提前预加载了需要的资源
- ``此方法添加头部，浏览器会在空闲时间预先拉取该文件

```js
import(/* webpackChunkName: 'login', webpackPrefetch: true
*/'./login').then(result => {
        console.log(result.default);
});
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_4-提取公共代码)🍅 4. 提取公共代码

[splitChunks](https://webpack.js.org/plugins/split-chunks-plugin/#root)

webpack

```js
module.exports = {
output:{
      filename:'[name].js',
      chunkFilename:'[name].js'
    },
 entry: {
        index: "./src/index.js",
        login: "./src/login.js"
 },
optimization: {
    splitChunks: {
    chunks: 'all',  // 分割同步异步的代码
    minSize: 0,    // 最小体积
    minRemainingSize: 0, // 代码分割后的最小保留体积，默认等于minSize
    maxSize: 0,  // 最大体积
    minChunks: 1,  // 最小代码快
    maxAsyncRequests: 30, // 最大异步请求数
    maxInitialRequests: 30, // 最小异步请求数
    automaticNameDelimiter: '~', // 名称分离符
    enforceSizeThreshold: 50000, //执行拆分的大小阈值，忽略其他限制
    // (minRemainingSize、maxAsyncRequests、maxInitialRequests) 
    cacheGroups: {
    defaultVendors: {
        test: /[\\/]node_modules[\\/]/,//控制此缓存组选择哪些模块
        priority: -10,//一个模块属于多个缓存组,默认缓存组的优先级是负数，自定义缓存组的优先级更高，默认值为0 //如果当前代码块包含已经主代码块中分离出来的模块，那么它将被重用，而不是生成新的模块。这可能会影响块的结果文件名。
    }, 
    default: {
                minChunks: 2,
                priority: -20
            }
    } 
  }
}
 plugins: [
      new HtmlWebpackPlugin({
        template:'./src/index.html',
        filename:'page1.html',
        chunks:['index']
      }),
      new HtmlWebpackPlugin({
        template:'./src/index.html',
        filename:'page2.html',
        chunks:['login']
      }),
 ]
}
```

#### [#](https://hejialianghe.gitee.io/engineering/ctg-art.html#_4-cdn)🍅 4. CDN

- 最影响用户体验的是网页首次打开时的加载等待。 导致这个问题的根本是网络传输过程耗时大， CDN的作用就是加速网络传输。
- CDN 又叫内容分发网络，通过把资源部署到世界各地，用户在访问时按照就近原则从离用户最近 的服务器获取资源，从而加速资源的获取速度
- 用户使用浏览器第一次访问我们的站点时，该页面引入了各式各样的静态资源，如果我们能做到持 久化缓存的话，可以在 http 响应头加上 Cache-control Expires字段来设置缓存，浏览器可以 将这些资源一一缓存到本地
- 用户在后续访问的时候，如果需要再次请求同样的静态资源，且静态资源没有过期，那么浏览器可以直接走本地缓存而不用再通过网络请求资源
- 缓存配置
  - HTML文件不缓存，放在自己的服务器上，关闭自己服务器的缓存，静态资源的URL变成指向 CDN服务器的地址
  - 静态的JavaScript、CSS、图片等文件开启CDN和缓存，并且文件名带上HASH值
  - 为了并行加载不阻塞，把不同的静态资源分配到不同的CDN服务器上
- 域名限制
  - 同一时刻针对同一个域名的资源并行请求是有限制 可以把这些静态资源分散到不同的 CDN 服务上去 多个域名后会增加域名解析时间
  - 可以通过在 HTML HEAD 标签中 加入去预解析域名，以降低域名解析带来的延迟