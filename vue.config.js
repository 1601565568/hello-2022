'use strict'
const path = require('path')
const webpack = require('webpack')
const webpackBaseConfig = require('./build/webpack.base.conf')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  transpileDependencies: [resolve('node_modules/web-crm/src')],
  publicPath: process.env.PUBLIC_PATH || '/',
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
  },
  chainWebpack: config => {
    if (process.env.VUE_APP_Dll_PLUGIN === 'true') {
      // config
      //   .plugin('DllReferencePlugin')
      //   .use(webpack.DllReferencePlugin, [{
      //     context: resolve(''),
      //     manifest: require(resolve('public/temp/components-manifest.json'))
      //   }])
      //   .end()
    }
  }
}
