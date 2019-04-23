'use strict'
const path = require('path')
const webpack = require('webpack')
const packageConfig = require('../package.json')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}


module.exports = {
  resolve: {
    alias: {
      [packageConfig.name]: resolve(''),
      'mixins': resolve('src/mixins'),
      'utils': resolve('src/utils'),
      'components': resolve('src/components'),
      'views': resolve('src/views'),
      'vendor': resolve('vendor')
    }
  },
  module: {
    noParse: function(content) {
      return /apusjs-log|jquery|lodash|moment/.test(content);
    }
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
        /moment[\\\/]locale$/,
        /^\.\/(zh-cn)$/
    )
  ]
}
