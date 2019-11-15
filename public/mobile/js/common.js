var backstageURL = function (){
  var hostUrl = window.document.location.href
  if(hostUrl.includes('sg.vecrp.com')){
    return 'https://sgapp.vecrp.com/app/guide/zm/guideRecruit'
  }else if(hostUrl.includes('test-sg.ecrpcloud.com')){
    return 'https://zhsg.ecrpcloud.com/app/guide/zm/guideRecruit'
  } else{
    return 'https://localhost/app/guide/zm/guideRecruit'
  }
}
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

var apiRoot = function (){
  var hostUrl = window.document.location.href
  if(hostUrl.includes('sg.vecrp.com')){
    return 'https://sgapp.vecrp.com/app/'
  }else if(hostUrl.includes('test-sg.ecrpcloud.com')){
    return 'https://zhsg.ecrpcloud.com/app/'
  } else{
    return 'https://localhost/app/'
  }
}
var fetch = function (api, data) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: apiRoot + api.url,
      type: api.method || 'get',
      dataType: api.dataType || 'JSON',
      data: JSON.stringify(data),
      cache: false,
      contentType: "application/json;charset=UTF-8",
      success: function (res) {
        if(res && res.success){
          resolve(res)
        } else {
          reject(res)
        }
      },
      error: function (res) {
        reject(res)
      }
    });
  });
}

var formatMobile = function (mobile) {
  if (mobile && mobile.length === 11) {
    return mobile.substr(0, 3) + ' **** ' + mobile.substr(7)
  }
}
