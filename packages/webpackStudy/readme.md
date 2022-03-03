#### 问题一：lint-staged 版本大于12.0.0,可能会出错。

原因：lint-staged 12.0.0 以上的版本，源码为ESM。
node 版本 12.20.0 14.13.1 16.0.0 才支持。



#### ls-lint

存在的问题：与 M1 不兼容

| Rule                                                         | Alias      | Description                                         |
| ------------------------------------------------------------ | ---------- | --------------------------------------------------- |
| [regex](https://ls-lint.org/1.x/configuration/the-rules.html#regex) | -          | 匹配正则表达式模式:^{pattern}$                      |
| lowercase                                                    | -          | 每个字母必须是小写的 忽略非字母                     |
| camelcase                                                    | camelCase  | 字符串必须为camelCase 只允许字母和数字              |
| pascalcase                                                   | PascalCase | 字符串必须是Pascalcase只允许字母和数字              |
| snakecase                                                    | snake_case | 字符串必须是snake_case 只允许小写字母、数字和_      |
| kebabcase                                                    | kebab-case | 字符串必须是kebab-case 只允许小写字母、数字和-      |
| pointcase                                                    | point.case | 字符串必须是"point case" 只有小写字母，数字和。允许 |



#### CSS书写规范
```js
npm install stylelint stylelint-order stylelint-config-standard  stylelint-config-prettier -D
```
- stylelint:检验工具
- stylelint-order：css样式书写顺序插件
- stylelint-config-standard:stylelint的推荐配置
- stylelint-config-prettier：关闭所有不必要的或可能与 Prettier 冲突的规则


#### speed-measure-webpack5-plugin
这个插件不完全兼容 webpack5,所以有问题

#### webpack性能优化
[webpack性能优化手段](https://hejialianghe.gitee.io/engineering/ctg-art.html#_5-9-4-%E8%BF%90%E8%A1%8C%E9%80%9F%E5%BA%A6%E4%BC%98%E5%8C%96)