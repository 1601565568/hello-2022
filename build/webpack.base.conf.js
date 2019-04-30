'use strict'
const path = require('path')
const webpack = require('webpack')
const packageConfig = require('../package.json')
;(process.env.NODE_ENV === 'production' && require('./getGitLog'))

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  resolve: {
    alias: {
      [packageConfig.name]: resolve('')
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
