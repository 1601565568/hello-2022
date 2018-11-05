'use strict'
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const webpackConfig = require('./webpack.dev.dll.conf.js');
// add hot-reload related code to entry chunks
Object.keys(webpackConfig.entry).forEach(function (name) {
  webpackConfig.entry[name] = [`webpack-dev-server/client?http://${webpackConfig.devServer.host}:${webpackConfig.devServer.port}`].concat(webpackConfig.entry[name])
})

const options = webpackConfig.devServer


const child_process = require('child_process');
const DllPlugin = child_process.exec(
  'webpack --config ./build/webpack.dll.conf.js -w', // 执行的命令
  {},
  (err, stdout, stderr) => {
    if (err) {
      // err.code 是进程退出时的 exit code，非 0 都被认为错误
      // err.signal 是结束进程时发送给它的信号值
      console.log('err:', err, err.code, err.signal);
    }
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  }
);
console.log('child DllPlugin pid:', DllPlugin.pid);



webpackDevServer.addDevServerEntrypoints(webpackConfig, options);
const compiler = webpack(webpackConfig);
const server = new webpackDevServer(compiler, options);

server.listen(options.port, options.host, () => {
  console.log('dev server listening on port ' + options.port);
});
