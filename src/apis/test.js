import transData from '@nascent/ecrp-ecrm/src/utils/transData'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'

export default {
  test: {
    url: '/teqst/qq/testRestful404'
  },
  error: {
    url: '/test/error',
    method: 'post'
  },
  success: {
    url: '/test/success',
    method: 'post'
  },
  axiosSuccess: {
    url: '/test/axiosSuccess',
    method: 'get'
  },
  axiosError: {
    url: '/test/axiosError',
    method: 'post'
  },
  axiosRestful: {
    url: '/test/axiosRestful',
    method: 'get'
  },
  callbackFalse: {
    url: '/test/success',
    method: 'post',
    callback: false
  },
  callbackFn: {
    url: '/test/success',
    method: 'post',
    transformRequest: (data) => {
      return transData(data)
    },
    /**
     * 发起请求前拦截器
     * config 当前API配置
     * params 要向服务器发送的内容
     */
    request: function (config, params) {
      /**
       * msg 所要操作的数据与类型提示语
       * `此操作将 ${msg}, 是否继续?`
       * 返回一个Promise 对象，可以用 then 或 catch 属性做后续处理
       */
      return apiRequestConfirm('更新' + params['username'])
    },
    /**
     * true || null 全局callback 处理后返回。
     * false：不执行全局callback 返回。
     * function：执行function  返回。
     * res 原始 xhr 对象
     * resolve Promise resolve方法
     * reject Promise reject方法
     */
    callback: function (res, resolve, reject) {
      resolve(res)
    }
  },
  testHeaders: {
    url: '/test/success',
    headers: {
      'X-Requested-With':
        'XMLHttpRequest'
    }
  },
  testRequestConfirmUpdate: {
    url: '/test/success',
    request: function (config, params) {
      /**
       * msg 所要操作的数据与类型提示语
       * `此操作将 ${msg}, 是否继续?`
       * 返回一个Promise 对象，可以用 then 或 catch 属性做后续处理
       */
      return apiRequestConfirm('更新' + params['username'])
    }
  },
  testRequestConfirmDel: {
    url: '/test/success',
    request: function (config, params) {
      return apiRequestConfirm(params['username'] + ' 删除')
    }
  },
  testRequestConfirmDel1: {
    url: '/test/success',
    /**
     * config 当前APIS 配置
     * params 要发送的数据
     * 此方法必须返回一个Promise 对象
     */
    request: function (config, params) {
      return new Promise((resolve, reject) => {
        // 在发送请求之前做些什么
      })
    }
  }
}
