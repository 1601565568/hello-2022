function backstageURL() {
  var returnUrl
  var hostUrl = window.location.protocol + '//' + window.location.host
  if (hostUrl.includes('localhost') || hostUrl.includes('127.0.0.1')) {
    hostUrl = 'http://localhost:30004/liberty/url/appUrl'
  } else {
    hostUrl += '/crmWebApi/liberty/url/appUrl'
  }
  $.ajax({
    url: hostUrl,
    type: 'post',
    dataType: 'JSON',
    method: 'post',
    async: false,
    contentType: 'application/json;charset=UTF-8',
    success: function (res) {
      returnUrl = res.result
    },
    error: function (res) {
      window.location.replace('./error.html?message=获取服务器地址异常')
    }
  })
  return returnUrl + '/app/guide/zm/guideRecruit'
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
  var returnUrl
  var hostUrl = window.location.protocol + '//' + window.location.host
  if (hostUrl.includes('localhost') || hostUrl.includes('127.0.0.1')) {
    hostUrl = 'http://localhost:30004/liberty/url/appUrl'
  } else {
    hostUrl += '/crmWebApi/liberty/url/appUrl'
  }
  $.ajax({
    url: hostUrl,
    type: 'post',
    dataType: 'JSON',
    method: 'post',
    async: false,
    contentType: 'application/json;charset=UTF-8',
    success: function (res) {
      returnUrl = res.result
    },
    error: function (res) {
      window.location.replace('./error.html?message=获取服务器地址异常')
    }
  })
  return returnUrl + '/app'
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
