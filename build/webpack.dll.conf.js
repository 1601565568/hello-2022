'use strict'
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseCliWebpackConfig = require('@vue/cli-service/webpack.config.js')
const resolve = function (dir) {
  return path.join(__dirname, '..', dir)
}
const getDllList = require('./getDllList.js')
const baseWebpackConfig = {
  mode: 'production',
  context: baseCliWebpackConfig.context,
  resolve: baseCliWebpackConfig.resolve,
  module: baseCliWebpackConfig.module,
  entry: {
    components: [resolve('src/style/small/NuiJs/index.scss')].concat(getDllList({
      list: ['components', 'directives/modules', 'filters/modules', 'mixins', 'utils'],
      exclude: { 'Layout': false }
    }))
  }
}

const webpackConfig = merge(baseWebpackConfig, {
  output: {
    path: path.join(__dirname, '../public/temp/'),
    publicPath: '/temp/',
    filename: '[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../public/temp/', '[name]-manifest.json'),
      name: '[name]'
    })
  ]
})

console.log('正在生成DLL,请稍后...')

module.exports = webpackConfig
