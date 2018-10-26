'use strict';
var fs = require('fs');
var WANTU = require('wantu-nodejsSDK');
var assert = require("assert");
console.log(WANTU)
var wantu = new WANTU('23200656', 'ba3f84d1698d0c51916aeff12285560d');  //填入ak，sk
var namespace = "wx-smartcrm";   //填写空间名

var fileList = [];

function walk(path) {
  var dirList = fs.readdirSync(path);
  dirList.forEach(function (item) {
    if (fs.statSync(path + '/' + item).isDirectory()) {
     if(item !== 'UEditor' && item !== 'mxGraph' && item !== 'images' && item !== 'fileTemplates' && item !== 'emotions') {
       walk(path + '/' + item);
     }
    } else {
      if (item.indexOf('.map') < 0) {
        fileList.push(path + '/' + item);
      }
    }
  });
}
walk('dist');
let count = 0;
var up = function (config, callbock) {
  count = count + 100
  setTimeout(()=> {
    wantu.singleUpload({
      namespace: namespace,
      expiration: -1
    }, config.path, config.dir, '', '', function (err, res) {
      if(err){
        throw new Error('error up wantu >==' + config.path + config.dir);
      } else {
      }
      // should(res).have.property('statusCode', '200');
    })
  }, count);

}

fileList.forEach((value) => {
  let config = {
    path: value,
    dir: '/CRM-Enterprise-Web/0.1.0' + value.slice(value.indexOf('dist') + 4, value.lastIndexOf('/'))
  }
  up(config)
})


/*// 分片上传（完整过程）没有写mocha测试。可以直接nodejs跑一下
wantu.multiUpload({
    namespace : namespace,
    expiration : -1
},'./bigImg.jpg','/','','','',function(err,res){
    console.log(err);
    console.log(res);
});*/

