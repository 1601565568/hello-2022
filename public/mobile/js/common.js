var backstageURL = 'https://zhsg.ecrpcloud.com/app/guide/zm/guideRecruit'
var getRootPath = function () {
  var curPageUrl = window.document.location.href
  var rootPath = curPageUrl.split('//')[0] + curPageUrl.split('//')[1].split('/')[0] +
    '/' + curPageUrl.split('//')[1].split('/')[1]
  return rootPath
}
// 获取参数封装
var getPar = function (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return decodeURIComponent(r[2])
  }
  return null
}
