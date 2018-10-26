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
// walk('dist');
let count = 0;
var del = function (config, callback) {
  count = count + 100
  setTimeout(()=> {
    wantu.delFile(namespace, config.dir, config.file, function (err, res) {
      if(err){
        throw new Error('error up wantu >==' + config.path + config.dir);
      } else {
        console.log(config)
      }
      // should(res).have.property('statusCode', '200');
    })
  }, count);

}
// del({dir:'/CRM-Enterprise-Webage', file: 'versions.json'})

const listFile = function (config, callback) {
  let dir = config.dir
  let currentPage = config.currentPage === 'all' ? 1 : config.currentPage || 1
  let pageSize = config.currentPage === 'all' ? 100 : config.pageSize || 10
  let list = []
  const getListFiles = function (currentPage, pageSize) {
    wantu.listFiles(namespace, dir, currentPage, pageSize ,function(err,res){
      if(err){
        throw new Error('error listFile wantu >==' + config);
      } else {
        var result = JSON.parse(res.data)
        list = list.concat(result.result)
        if (config.currentPage === 'all') {
          if (currentPage === result.totalPage) {
            callback(list)
          } else {
            getListFiles(currentPage + 1, pageSize)
          }
        } else {
          callback(list)
        }

      }

    })
  }
  getListFiles(currentPage, pageSize)
}



/*listFile({dir: '/CRM-Enterprise-Web/0.0.1/static/css', currentPage: 'all'}, function (data) {
console.log(data.length)
})*/

const listDirs = function (config, callback) {
  let dir = config.dir
  let currentPage = config.currentPage === 'all' ? 1 : config.currentPage || 1
  let pageSize = config.currentPage === 'all' ? 100 : config.pageSize || 10
  let list = []
  const getListFiles = function (currentPage, pageSize) {
    wantu.listDirs(namespace, dir, currentPage, pageSize ,function(err,res){
      if(err){
        throw new Error('error listFile wantu >==' + config);
      } else {
        var result = JSON.parse(res.data)
        list = list.concat(result.result)
        if (list.length === 0){
          callback(list)
        } else if(config.currentPage === 'all') {
          if (currentPage === result.totalPage) {
            callback(list)
          } else {
            getListFiles(currentPage + 1, pageSize)
          }
        } else {
          callback(list)
        }

      }

    })
  }
  getListFiles(currentPage, pageSize)
}



listDirs({dir: '/CRM-Enterprise-Web/0.0.1/static', currentPage: 'all'},function (data) {
  console.log(data)
})


/*fileList.forEach((value) => {
  let config = {
    path: value,
    dir: '/CRM-Enterprise-Web/0.1.0' + value.slice(value.indexOf('dist') + 4, value.lastIndexOf('/'))
  }
  up(config)
})*/


/*// 分片上传（完整过程）没有写mocha测试。可以直接nodejs跑一下
wantu.multiUpload({
    namespace : namespace,
    expiration : -1
},'./bigImg.jpg','/','','','',function(err,res){
    console.log(err);
    console.log(res);
});*/

