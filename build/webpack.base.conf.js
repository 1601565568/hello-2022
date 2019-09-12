'use strict'
const path = require('path')
const webpack = require('webpack')
const packageConfig = require('../package.json')
if (process.env.NODE_ENV === 'production') {
  require('./setAppInfo')
}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  resolve: {
    alias: {
      [packageConfig.name]: resolve(''),
      '@theme': resolve(`src/theme/${process.env.VUE_APP_THEME}`)
    }
  },
  module: {
    noParse: function (content) {
      return /apusjs-log|jquery|lodash|moment/.test(content)
    }
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /moment[\\\/]locale$/,
      /^\.\/(zh-cn)$/
    )
  ]
}
