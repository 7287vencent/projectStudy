module.exports = {
    printWidth: 100, // ? 超过最大值换行
    tabWidth: 2, // ? 缩进字节数
    useTabs: false, // ? 缩进不使用 tab，使用空格
    semi: true, // ? 句尾添加分号
    singleQuote: true, // ? 使用单引号代替双引号
    quoteProps: 'as-needed', // ? 设置对象中属性是否添加引号. as-needed: 在需要的地方添加， consistent：有一个需要添加，就都添加， preserve：所有的都添加
    jsxSingleQuote: false, // ? 在jsx中使用单引号代替双引号
    trailingComma: 'es5', // ? 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
    bracketSpacing: true, // ? 在对象，数组括号与文字之间加空格 "{ foo: bar }"
    bracketSameLine: false, // ? 在 html 中，闭合 > 符号是否 单独放一行
    jsxBracketSameLine: false, // ? 在jsx中把'>' 是否单独放一行
    arrowParens: 'avoid', // ? //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号 always: 不省略
    // ! 指定格式化文件字符的范围
    // rangeStart: 0,
    // rangeEnd: Infinity,
    // parser: 'babylon', // ? 格式化的解析器
    proseWrap: 'preserve', // ? 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
    htmlWhitespaceSensitivity: 'ignore', // ? html, vue 等文件中对 空白的理解
    vueIndentScriptAndStyle: false, // ? 是否缩进Vue文件中<script>和<style>标记中的代码。
    endOfLine: 'auto', // ? 结尾是 \n \r \n\r auto
    embeddedLanguageFormatting: 'auto', // ? 是否格式化嵌入式的代码
};
