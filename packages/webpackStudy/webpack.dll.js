const path = require('path')
const webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: {
    vuep: ['vue', 'vue-router', 'vuex'],
    element: ['element-ui']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, './dll'),
    library: '_dll_[name]', // ? 这个名字和下面的name 必须一致， 否则会报错
    // clean: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      // context:__dirname,
      name: '_dll_[name]',
      path: path.resolve((__dirname, './dll/[name].manifest.json')),
    })
  ]
}