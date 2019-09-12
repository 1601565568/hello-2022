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
    // config.module.rules.delete('svg') // 重点:删除默认配置中处理svg,
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('svg')
      .exclude.add(resolve('node_modules/web-crm/src/assets/icons'))
      .end()
    // const svgRule = config.module.rule('svg')
    // svgRule.uses.clear()
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include
      .add(resolve('src/assets/icons')) // 处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include
      .add(resolve('node_modules/web-crm/src/assets/icons')) // 处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    if (process.env.VUE_APP_Dll_PLUGIN === 'true') {
      config
        .plugin('DllReferencePlugin')
        .use(webpack.DllReferencePlugin, [{
          context: resolve(''),
          manifest: require(resolve('public/temp/components-manifest.json'))
        }])
        .end()
    }
  }
}
