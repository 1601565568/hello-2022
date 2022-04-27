/*
 * @Date: 2022-04-26 17:11:31
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-27 16:54:23
 * @FilePath: \ECRP-SG-WEB\src\directives\modules\down.js
 */

/**
 * @description: 全局文件下载指令(v-down)
 * @demo {*}
 * <button
    v-down="{
      url: this.$api.guide.task.exportExcel,
      params: {
        aaa: "1111"
        exportType: 100
      }
    }"
  >
    导出
  </button>
 */

import Notification from '@nascent/nui/lib/notification.js'
import http from '@/extends/http/index'
import store from '@/store/index'

export default {
  bind (el, { value }) {
    el.handler = (e) => {
      if (!el.$value) return
      let { view: { visualViewport: { width } }, clientX, clientY } = e
      let { url, params } = el.$value
      if (url && params) {
        http.fetch(url, params).then((resp) => {
          // 执行跳入动画
          store.dispatch({
            type: 'down/downAction',
            status: true,
            top: clientY,
            right: width - clientX
          })
        }).catch((resp) => {
          Notification.error(resp.msg || '导出报错，请联系管理员')
        })
      } else {
        console.error('指令v-down: 参数缺失')
      }
    }
    el.addEventListener('click', el.handler)
  },
  // 更新
  componentUpdated (el, { value }) {
    el.$value = value
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind (el) {
    el.removeEventListener('click', el.handler)
  }
}
