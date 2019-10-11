'use strict'
var fs = require('fs')
const path = require('path')
var WANTU = require('wantu-nodejsSDK')
// var assert = require("assert");

function resolve (dir) {
  return path.join(__dirname, '../', dir)
}
require('dotenv').config({ path: resolve('.env.production') })

var wantu = new WANTU(process.env.WANTU_AK, process.env.WANTU_SK) // 填入ak，sk
var namespace = process.env.WANTU_NAMESPACE // 填写空间名

var fileList = []

function walk (path) {
  var dirList = fs.readdirSync(path)
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
walk('dist')
let count = 0
var Upload = function (config, callbock) {
  count = count + 100
  setTimeout(() => {
    wantu.singleUpload({
      namespace: namespace,
      expiration: -1
    }, config.path, config.dir, '', '', function (err, res) {
      if (err) {
        throw new Error('error up wantu >==' + config.path + config.dir)
      } else {
      }
      // should(res).have.property('statusCode', '200');
    })
  }, count)
}

fileList.forEach((value) => {
  Upload({
    path: value,
    dir: `${process.env.WANTU_DIR}${value.slice(value.indexOf('dist') + 4, value.lastIndexOf('/'))}`
  })
})
