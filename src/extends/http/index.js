import axios from 'axios'
import store from 'store/dist/store.legacy.min.js'
import Callback from './callback'
import api from '@/config/http'

/**
 * 实例Axios
 * @type {AxiosInstance}
 */
const instance = axios.create({
  baseURL: api.API_ROOT,
  timeout: api.API_TIMEOUT,
  headers: api.API_HEADERS
})

const parseApi = (config, data) => {
  if (typeof config.url === 'function') {
    config.url = config.url(data)
  }
  config.method = config.method || api.API_DEFAULT_TYPE
  if (config.method === 'get') {
    config.params = data
  } else {
    config.data = data
  }
  return config
}
/**
 *更新token
 * */
const putToken = () => {
  const thatToken = store.get('remumber_login_info')
  if (thatToken && thatToken.token) {
    instance.defaults.headers.token = thatToken.token
  }
}

/**
 * 实例化回调类
 */
const cb = new Callback()

export default {
  fetch (config, params) {
    const api = parseApi(config, params)
    putToken()
    return new Promise((resolve, reject) => {
      const runFetch = () => {
        instance(api).then((res) => {
          if (api.callback === undefined || api.callback === true) {
            cb.requestSuccessCallback(res).then(resolve).catch(reject)
          } else if (api.callback === false) {
            resolve(res)
          } else if (typeof api.callback === 'function') {
            api.callback.call(this, res, resolve, reject)
          }
        }).catch((err) => {
          cb.requestErrorCallback(err).then(resolve).catch(reject)
        })
      }
      if (!config.request) {
        runFetch()
      } else {
        config.request(config, params).then(runFetch).catch(reject)
      }
    })
  },
  config: api
}
