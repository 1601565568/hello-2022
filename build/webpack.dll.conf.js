'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const getDllList = require('./bin/getDllList.js')
const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
baseWebpackConfig.entry = {
  components: getDllList({
    list: ['components', 'directives/modules', 'filters/modules', 'mixins', 'utils'],
    exclude: {'asyncRouter.js': false, 'updateUserInfo.js': false, 'layout': false}
  })
}
baseWebpackConfig.entry.components.push(resolve('src/style/small/NuiJs/index.scss'))
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  context: path.resolve(__dirname, '../'),
  output: {
    path: path.join(__dirname, "../public/dll/"),
    filename: "[name].js",
    library: "[name]"
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "../public/dll/", "[name]-manifest.json"),
      name: '[name]'
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: path.posix.join('[name].css')
    })
  ]
})

module.exports = webpackConfig
