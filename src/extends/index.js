/* eslint-disable */

import Loading from 'nui-v2/lib/loading.js'
import MessageBox from 'nui-v2/lib/message-box.js'
import Message from 'nui-v2/lib/message.js'
import Notification from 'nui-v2/lib/notification.js'
import http from './http'
import apis from '@/apis'
import {i18n} from 'web-crm/src/i18n'

export default {
  install (Vue, options) {
    Vue.use(Loading.directive)
    Vue.prototype.$loading = Loading.service
    Vue.prototype.$msgbox = MessageBox
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$confirm = MessageBox.confirm
    Vue.prototype.$prompt = MessageBox.prompt
    Vue.prototype.$notify = Notification
    Vue.prototype.$message = Message
    // 注册全局方法
    Vue.prototype.$http = http
    Vue.prototype.$api = apis
    i18n.t.bind(Vue)
  }
}
