'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: [{
      /**
       * 开发时调用不同服务端API时，需添加排除 !** /register
       */
      context: ['/crmWebApi/**/*'],
      // target: 'http://127.0.0.1:8089',
      // 正式 target: 'http://120.27.159.74:80',
      target: 'http://47.96.228.119:8089',
      // target: 'http://127.0.0.1:30001',
      // target: 'http://localhost:30001',
      changeOrigin: true,
      // secure: false,  // 如果是https接口，需要配置这个参数
      pathRewrite: {
        '^/crmWebApi': ''
      }
    },
	{
      /**
       *  cas登录使用
       */
      context: ['/casLogin'],
      // target: "http://120.27.159.167:30001", // local: 'http://localhost:8360', formal:  'http://120.27.159.167:30001'
      // 正式 target: 'http://120.27.159.74:80',
      target: 'http://47.96.228.119:8089',
      changeOrigin: true,
    }
    ],
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',
    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },
  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),
    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: 'https://wx-smartcrm.image.alimmdn.com/CRM-Enterprise-Web/0.1.0/',
    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  // Set to this theme
  theme: 'ThemeDefault'
}
