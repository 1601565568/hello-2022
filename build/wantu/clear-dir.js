'use strict';
var fs = require('fs');
var WANTU = require('wantu-nodejsSDK');

var wantu = new WANTU('23200656', 'ba3f84d1698d0c51916aeff12285560d');  //填入ak，sk
var namespace = "wx-smartcrm";   //填写空间名


const listDirs = function (config, callback) {
  let conf  = {
    namespace,
    dir: config.dir,
    currentPage: config.currentPage === 'all' ? 1 : config.currentPage || 1,
    pageSize: config.currentPage === 'all' ? 100 : config.pageSize || 10
  }
  let list = {result:[]}
  const getListDir = function (currentPage) {
    wantu.listDirs(conf.namespace, conf.dir, currentPage, conf.pageSize ,function(err,res){
      if(err){
        throw new Error('error listFile wantu >==' + config);
      } else {
        var result = JSON.parse(res.data);
        list.totalCount = result.totalCount
        list.totalPage = result.totalPage
        if (result.result.length > 0) {
          list.result = list.result.concat(result.result)
        }
        if (result.result.length >= 100){
          getListDir(currentPage + 1)
        } else {
          callback(list)
        }
      }
    })
  }
  getListDir(conf.currentPage)
}



/*listDirs({dir: '/CRM-Enterprise-Web/0.0.1/static', currentPage: 'all'},function (data) {
  console.log(data)
})*/

function readDirRecur(data, callback) {
  listDirs({dir: data.path, currentPage: 'all'}, function(res) {
    var count = 0
    var checkEnd = function() {
      ++count == res.result.length && callback(data)
    }
    // data.totalCount = res.totalCount
    // data.totalPage = res.totalPage
    data.children = data.children || []
    res.result.forEach(function(item, index) {
      data.children.push(item)
      return readDirRecur(data.children[index], checkEnd);
    })
    // 为空时直接回调
    return res.result.length === 0 && callback(data)
  })
}

var timeStart = new Date()

readDirRecur({name: '0.0.1', path: '/CRM-Enterprise-Web/0.0.1'}, function(dirList) {
  console.log('done', new Date() - timeStart);
  fs.writeFile('temp/clear-dir.json', JSON.stringify(dirList, null, 2), function (err) {
    if (err) throw err
    console.log('save file ok')
  })
})
