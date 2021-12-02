'use strict'
const path = require('path')
const packageConfig = require('./package.json')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, './', dir)
}
// 获取当前应用信息
require('@nascent/ecrp-ecrm/build/setAppInfo')

// Temporary until we can use https://github.com/webpack/webpack-dev-server/pull/2143
module.exports = {
  publicPath: process.env.PUBLIC_PATH,
  productionSourceMap: false,
  configureWebpack: config => {
    const existingForkTsChecker = config.plugins.filter(
      p => p instanceof ForkTsCheckerWebpackPlugin
    )[0]

    // remove the existing ForkTsCheckerWebpackPlugin
    // so that we can replace it with our modified version
    config.plugins = config.plugins.filter(
      p => !(p instanceof ForkTsCheckerWebpackPlugin)
    )
    config.devtool = process.env.NODE_ENV === 'development' ? 'source-map' : false
    // copy the options from the original ForkTsCheckerWebpackPlugin
    // instance and add the memoryLimit property
    const forkTsCheckerOptions = existingForkTsChecker.options

    forkTsCheckerOptions.memoryLimit = 8192

    config.plugins.push(new ForkTsCheckerWebpackPlugin(forkTsCheckerOptions))
  },
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
    },
    before: app => { if (process.env.VUE_APP_MOCK === 'true') { require('./node_modules/@nascent/ecrp-ecrm/build/mock')(app) } } // 引入mock/index.js
  }
}
