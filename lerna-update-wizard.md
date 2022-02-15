### lerna-update-wizard 用来管理包依赖的版本
- 依赖于 `globby` 包，但是在 `window` 系统上 默认使用的是 '\' 反斜杠，但是 `globby` 不支持，只支持 `/` 斜杠。
- 所以在执行的时候，可能会出现问题。
- 解决办法：修改 leran-update-wizard 包中的源码

```js
const packagesRead = await globby(
  defaultPackagesGlobs.map(glob => {
   let str = resolve(projectDir, glob, "package.json")
    str = str.replace(/\\/g, '/')
   return str
  }),
  { expandDirectories: true }
);
```

### 作用
管理每个项目包中的 依赖 版本，可以执行更新或更改