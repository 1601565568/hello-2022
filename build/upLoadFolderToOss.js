'use strict';
const fs = require('fs');
const path = require('path');
const OSS = require('ali-oss');

function resolve (dir) {
  return path.join(__dirname, '../', dir)
}

// 获取env 配置
require('dotenv').config({ path: resolve(`.env.production`) });

// 声明上传方法
const putFile = () => {
  const region = process.env.OSS_REGION;
  const bucket = process.env.OSS_BUCKET;
  const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
  const publicPath = process.env.OSS_DIR;

  if  (process.env.OSS_ACCESS_KEY_ID && process.env.OSS_ACCESS_KEY_SECRET) {
  } else {
    console.warn('无法上传OSS，请检查配置');
    return false
  }

  const client = new OSS({
    region,
    //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
    accessKeyId,
    accessKeySecret,
    bucket
  });

  // 待上传的文件列表
  const fileList = [];

  // 递归获取全部文件
  function walk (path) {
    const dirList = fs.readdirSync(path);
    dirList.forEach(function (item) {
      if (fs.statSync(path + '/' + item).isDirectory()) {
        if (item !== 'UEditor' && item !== 'mxGraph' && item !== 'images' && item !== 'fileTemplates' && item !== 'emotions') {
          walk(path + '/' + item)
        }
      } else {
        if (item.indexOf('.map') < 0) {
          fileList.push(path + '/' + item)
        }
      }
    })
  }

  walk(resolve('dist'));

  // 配置上传延时 以防止并发上传数多大，
  let upDataTime = 0;

  // 上传文件
  const upFile = function (url) {
    return new Promise(function (resolve, reject) {
      upDataTime = upDataTime + 100;
      setTimeout(function () {
        const localFile = url.path;
        const key = url.dir;
        // 文件上传
        // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
        client.put(key, localFile).then(function (r1) {
          // console.log('put success: %j', r1);
          client.putACL(key, 'public-read');
          return client.get(key);
        }).then(function (r2) {
          // console.log('get success: %j', r2);
          resolve(r2)
        }).catch(function (err) {
          console.error('error: %j', err);
          reject(err)
        });
      }, upDataTime)
    })
  };

  console.log('upFile start');
  // 生成一个Promise对象的数组
  const promises = fileList.map(function (value) {
    return upFile({
      path: value,
      dir: `${publicPath}${value.slice(value.indexOf('dist') + 4)}`
    })
  });

  /**
   * 上传全部完成，或有错误时处理方法
   * 全部上传完成后，才会执行then
   *如文件上传出错，后续的文件上传依然会继续上传
   */

  Promise.all(promises).then(function (posts) {
    // ...
    console.log('upFile all end')
  }).catch(function (reason) {
    // ...
    console.error('error', reason)
  })
};

putFile();

module.export = {};
