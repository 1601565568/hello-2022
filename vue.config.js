'use strict'
const path = require('path')
const packageConfig = require('./package.json')

function resolve (dir) {
  return path.join(__dirname, './', dir)
}
// 获取当前应用信息
require('@nascent/ecrp-ecrm/build/setAppInfo')

// Temporary until we can use https://github.com/webpack/webpack-dev-server/pull/2143
module.exports = {
  publicPath: process.env.PUBLIC_PATH,
  productionSourceMap: false,
  transpileDependencies: [resolve('node_modules/@nascent/ecrp-ecrm/src')],
  chainWebpack: config => {
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.js')
      .set(packageConfig.name, resolve(''))
      .set('@theme', resolve(`src/theme/${process.env.VUE_APP_THEME}`))
  },
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
    // before: app => { if (process.env.MOCK !== 'none') { require('./build/mock')(app) } } // 引入mock/index.js
  }
}
