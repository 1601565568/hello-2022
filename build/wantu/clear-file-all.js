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

function readFileRecur(data, done) {
  let callback = function (res) {
    done(res, data.currentPage)
    if (res.length >= data.pageSize) {
      ++data.currentPage
      listFile(data, callback)
    }
  }
  listFile(data, callback)
}

var timeStart = new Date()

readFileRecur(
  {dir: "/CRM-Enterprise-Web/0.0.1/static/css", currentPage: 1, pageSize: 100}, function (data, currentPage) {
  fs.writeFile(`temp/clear-file-${currentPage}.json`, JSON.stringify(data, null, 2), function (err) {
    if (err) throw err
    console.log(`out ==> temp/clear-file-${currentPage}.json`, new Date() - timeStart)
    if (data.length < 100) {
      console.log('save file all ok')
    }
  })
})
