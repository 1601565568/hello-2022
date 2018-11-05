'use strict';
var fs = require('fs');
var WANTU = require('wantu-nodejsSDK');

var wantu = new WANTU('23200656', 'ba3f84d1698d0c51916aeff12285560d');  //填入ak，sk
var namespace = "wx-smartcrm";   //填写空间名


const listFile = function (config, callback) {
  let conf = {
    namespace,
    dir: config.dir,
    currentPage: config.currentPage || 1,
    pageSize: config.pageSize || 10
  }
  let list = []
  const getListFiles = function (currentPage) {
    wantu.listFiles(conf.namespace, conf.dir, currentPage, conf.pageSize, function (err, res) {
      if (err) {
        throw new Error('error listFile wantu >==' + config);
      } else {
        var result = JSON.parse(res.data)
        list = list.concat(result.result)
        callback(list)
      }

    })
  }
  getListFiles(conf.currentPage)
}


/*listFile({dir: '/CRM-Enterprise-Web/0.0.1/static/css', currentPage: 'all'}, function (data) {
  console.log(data.length)
})*/

function readFileRecur(data, callback) {
  listFile({dir: data.path, currentPage: 1, pageSize: 100}, function (res) {
    var count = 0
    var checkEnd = function () {
      ++count == data.children.length && callback(data)
    }
    data.list = res
    data.children.forEach(function (item, index) {
      return readFileRecur(data.children[index], checkEnd);
    })
    // 为空时直接回调
    return data.children.length === 0 && callback(data)
  })
}

var timeStart = new Date()

readFileRecur(require('./temp/clear-dir.json'), function (dirList) {
  console.log('done', new Date() - timeStart);
  fs.writeFile('temp/clear-file.json', JSON.stringify(dirList, null, 2), function (err) {
    if (err) throw err
    console.log('save file ok')
  })
})
