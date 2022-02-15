## lerna 

### lerna 初始化项目
```js
lerna init
lerna import 你本地的项目路径
```

### lerna 创建包

```js
lerna create A
lerna create B
lerna create C
```
该命令为创建一个包名为xxx
#### 给 A 包 添加 依赖 B 包
```js
lerna add B --scope=A
```

### lerna 添加依赖
```js
lerna add vue // ? A, B, C 三个包都会添加 vue 依赖，除非指定 --scope
```
scope 可以理解为作用域，代表我的react 依赖只安装在xxx 包名下面， 而不是全部都安装，如果需要全部安装的话， 则 lerna add react 即可

### 查看所有的包
```js
lerna list
```
可以查看当前包名有哪些， 在我们发布包的时候可以使用lerna list来查看是否能找到我们的包名

### 安装所有依赖
```js
lerna bootstrap
```
安装依赖，帮我们把依赖安装到根node_modules 同等于 npm install
#### 依赖提升
```js
lerna bootstrap --hoist
```
lerna可以通过lerna bootstrap一行命令安装所有子项目的依赖包，而且在安装依赖时还有依赖提升功能，所谓“依赖提升”，就是把所有项目npm依赖文件都提升到根目录下，这样能避免相同依赖包在不同项目安装多次。比如多个项目都用了redux，通过依赖提升，多个项目一共只需要下载一次即可。不过，需要额外的参数--hoist让依赖提升生效。
> 但是这种会导致一些不需要的依赖，添加在根 `nodemodules` 里面

一些公共的依赖可以安装在根 node_modules
### link调试
```js
lerna link
```
进行调试， 会把当前的包名以依赖的形式进行本地联调，而不会影响到全局的包， 类型npm link

### 运行 run
```js
lerna run dev // ? 会执行所有保重的 dev 命令
```
### 清理 clean
```js
lerna clean
```


## 版本发布
```js
lerna exec       // 在每个包中执行任意命令
lerna changed    // 检查自上次发布以来哪些软件包已经更新
lerna diff       // 自上次发布以来，对所有包或单个包进行区分
lerna publish    // 发布版本
lerna clean      // 清除项目中所有 node_modules
lerna init       // 初始化项目
lerna create     // 创建项目中的子package
lerna run        // 在包含该脚本的包中运行 npm 脚本

```
