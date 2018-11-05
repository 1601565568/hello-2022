import api from 'configs/http'
import ErrorCode from 'configs/errorCode'

import store from '@/store'
/**
 * 接口请求之后的回调处理，包含了成功，失败，各种状态处理
 */
export default class Callback {
  /**
   * 请求失败，是指网络不通，直接请求失败时统一错误处理回调
   * @param err
   */
  requestErrorCallback (err) {
    return new Promise((resolve, reject) => {
      window.LOG.error('requestErrorCallback', err)
      reject(err)
    })
  }

  /**
   * 当拿不到后台返回的数据时，直接把axios抓到的数据抛到这里，自己处理
   * @param data
   */
  axiosCallback (data) {
  }

  /**
   * 匹配到自定义错误消息字段时，会把状态码和消息抛给这个回调处理，例如提示什么的操作，在这里写就OK了
   * @param resData 后台返回的数据
   */
  cancelErrorCallback (resData) {
  }

  /**
   * 匹配不到自定义的错误消息字段时，会把整个数据抛给这个回调处理
   * @param data  后台返回的数据
   */
  cancelUndefinedErrorCallback (data) {
  }

  /**
   * 接口请求成功时的回调处理，这里的成功代表的是HTTP正常响应200的情况。
   * @param data axios返回的data，包含HTTP信息等
   */
  requestSuccessCallback (data) {
    return new Promise((resolve, reject) => {
      // data属性才是后台返回的真实所有数据
      const resData = data.data

      // 根据后台响应的数据，和定义的验证字段匹配
      if (resData) {
        // /**
        //  * 没有定义状态码，抱歉我也不知道是成功还是失败，全部抛给你，自己处理
        //  */
        // if (resData[api.API_SUCCESS_FIELD] === undefined) {
        //   resolve(resData)
        //   return
        // }

        /**
         * 例如：API_STATUS_FIELD 状态字段叫 status ,  API_STATUS_VALUE 代表成功的状态码是200
         * 我就会匹配返回的数据中的status字段是否等于200
         * 因为我的习惯会把成功的所有数据存储到独立的key中，例如data，所以当成功时，实际上我只需要把返回的中的data取出来即可。
         * 如果没有定义此key，那抱歉我也不知道该给啥，还是全部抛给你，自己处理
         */
        if (resData[api.API_SUCCESS_FIELD]) {
          resolve(resData)
          return
        }
        /**
         * 执行到这里，说明定义了字段，且状态不是成功
         * 检测是否定义错误消息字段 API_STATUS_ERROR_MSG_FIELD
         * 如果定义并且返回的也存在，会优先检查返回的状态码是否存在特殊情况，存在就调用特殊情况，不存在就直接抛给公用错误消息回调处理
         */
        if (resData[api.API_STATUS_FIELD]) {
          // 判断是否session过期
          if (resData[api.API_STATUS_FIELD] === ErrorCode.USER_SESSION_EXPIRE) {
            store.dispatch('user/regainSession')
            return
          }
          if (this.customCallback(resData[api.API_STATUS_FIELD]) !== false) {
            this.customCallback(resData[api.API_STATUS_FIELD])(resData)
            reject(resData)
            return
          }
          this.cancelErrorCallback(resData)
          reject(resData)
          return
        }

        /**
         * 走到这里，代表错误消息匹配不到，抛给未知处理错误消息回调拉倒
         */
        this.cancelUndefinedErrorCallback(resData)
        reject(resData)
      } else {
        /**
         * 如果没有后台返回的数据，直接把axios返回的内容抛给axiosCallback回调
         */
        this.axiosCallback(data)
        reject(data)
      }
    })
  }

  /**
   * 检测是否存在自定义特殊状态处理，存在返回函数，失败返回false
   * @param code  特殊状态码
   * @returns {function|boolean}
   */
  customCallback (code) {
    const customCodes = {
      /**
       * 例如：403代表授权失败，需要重新获取授权
       */
      403: (resData) => {
        window.LOG.error('当返回403时，我需要特殊处理...', resData)
      }
    }
    return customCodes[code] || false
  }
}
