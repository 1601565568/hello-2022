'use strict'
const path = require('path')
const webpackBaseConfig = require('./build/webpack.base.conf')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false,
  transpileDependencies: [resolve('node_modules/@nascent/ecrp-ecrm/src')],
  publicPath: process.env.PUBLIC_PATH,
  devServer: {
    port: process.env.PORT,
    proxy: {
      '/crmWebApi': {
        target: process.env.PROXY_TARGET,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/crmWebApi': ''
        }
      },
      '/casLogin': {
        target: process.env.PROXY_TARGET,
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: () => {
    return webpackBaseConfig
  }
}
