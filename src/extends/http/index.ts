import axios, { AxiosStatic, AxiosRequestConfig, AxiosPromise, AxiosInstance } from 'axios'
import store from 'store'
// @ts-ignore
import Callback from './callback'
// @ts-ignore
import api from '@/config/http'
import * as Sentry from '@sentry/browser'
import vueStore from '@/store'

interface Api extends AxiosRequestConfig {
  callback?: () => void | false;
  request?: (config: api, params: any) => Promise<any>;
  ts: Date;
}

interface Fetch {
  (config: Api, params: any): AxiosPromise;
}

interface Cancel {
  (callback?: () => void): void;
}

interface Interface {
  fetch: Fetch;
  config: api;
  cancel: Cancel;
}

// 配置请求
const CancelToken = axios.CancelToken
const source = CancelToken.source()
window.axios = {
  source: {
    token: null,
    cancel: null
  }
}
window.axios.source = source.cancel // 保存到全局变量，用于路由切换时调用
/**
 * 实例Axios
 * @type {AxiosInstance}
 */
const instance: AxiosInstance = axios.create({
  baseURL: api.API_ROOT,
  timeout: api.API_TIMEOUT,
  headers: api.API_HEADERS,
  cancelToken: source.token
})

// 配置发送请求拦截器
instance.interceptors.request.use(config => {
  /* 设置接口请求的起始时间 */
  // @ts-ignore
  config.ts = performance.now()
  if (config.cancelToken) {
    config.cancelToken = window.axios.source.token
  }

  const loginInfo = store.get('remumber_login_info')
  // 更新token
  if (loginInfo && loginInfo.token) {
    config.headers.token = loginInfo.token
  }
  // 更新公司ID
  if (loginInfo && loginInfo.productConfig && loginInfo.productConfig.user && loginInfo.productConfig.user.groupId) {
    config.headers.groupId = loginInfo.productConfig.user.groupId
  }
  // // 区域ID
  // const area = store.get('user_area')
  // if (area && area.id) {
  //   config.headers.areaId = area.id
  // }
  // // 视角ID
  // if (loginInfo && loginInfo.productConfig.viewId) {
  //   config.headers.viewId = loginInfo.productConfig.viewId
  // }

  return config
}, err => {
  return Promise.reject(err)
})
// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  try {
    /**
     * [retCode接口，接口调用统计信息，成功抽样上报，失败100%上报]
     * @param  {[str]} api      [所调用的api]
     * @param  {[boolean]} issucess [是否成功，不成功会100%发送，成功按照抽样发送]
     * @param  {[number]} delay [调用耗时]
     * @param  {[type]} msg-code   [消息CODE]
     * @param  {[type]} msg-detail [消息详情]
     */
    // @ts-ignore
    window.logger.retCode(response.config.url, response.data.success, Number(performance.now() - response.config.ts), response.data.code, response.data.msg)
  } catch (e) {
  }
  return Promise.resolve(response)
}, function (error) {
  // 对响应错误做点什么
  try {
    // @ts-ignore
    window.logger.retCode(error.response.config.url, error.response.data.success, Number(performance.now() - error.response.config.ts), error.response.data.code, error.response.data.msg)
  } catch (e) {
  }
  return Promise.reject(error)
})

const parseApi = (config: api, data?: any): api => {
  config.method = config.method || api.API_DEFAULT_TYPE
  if (config.method === 'get' || config.method === 'head') {
    config.params = data
  } else {
    config.data = data
  }
  return config
}

/**
 * 实例化回调类
 */
const cb = new Callback()

const Http: Interface = {
  fetch (config, params) {
    const api: api = parseApi(config, params)
    return new Promise((resolve, reject) => {
      const runFetch = () => {
        instance(api).then((res) => {
          if (typeof api.callback === 'function') {
            // @ts-ignore
            api.callback.call(this, res, resolve, reject)
          } else if (api.callback === false) {
            resolve(res)
          } else {
            cb.requestSuccessCallback(res).then(resolve).catch(reject)
          }
        }).catch((err) => {
          if (axios.isCancel(err)) {
            // console.log('Request canceled', err.message)
          } else {
            if (process.env.VUE_APP_SENTRY_SWITCH === 'true') {
              Sentry.withScope((scope) => {
                scope.setTag('http', 'catch')
                Sentry.captureException(err)
              })
            }
            cb.requestErrorCallback(err).then(resolve).catch(reject)
          }
        })
      }
      if (!config.request) {
        runFetch()
      } else {
        config.request(config, params).then(runFetch).catch(reject)
      }
    })
  },
  config: api,
  cancel: (callBack) => {
    // 清除上一页面未完成的API请求
    const CancelToken = axios.CancelToken
    window.axios.source.cancel && window.axios.source.cancel()
    window.axios.source = CancelToken.source()
    if (callBack && typeof callBack === 'function') {
      callBack()
    }
    return Http
  }
}

export default Http
