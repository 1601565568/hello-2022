import { redpacketTypeMap, timeTypeForever, redpacketTypeList, setTypeList, normalType, closeType, normalRed, luckyRed, diyRed, timeTypeInterval, setTypeMap, activityPost } from '../const'
export default {
  data () {
    return {
      redpacketTypeMap,
      timeTypeForever,
      redpacketTypeList,
      setTypeList,
      normalType,
      closeType,
      normalRed,
      luckyRed,
      diyRed,
      timeTypeInterval,
      setTypeMap,
      activityPost,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < new Date(new Date().toLocaleDateString()) - 182 * 24 * 3600 * 1000
        }
      }
    }
  },
  methods: {
    /**
     * 修改列表model里的字段并筛选
     * @param {*} [obj={}]
     */
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    /**
     * 页面跳转
     * @param {*} path
     * @param {*} [query={}]
     */
    handleJump (path, query = {}) {
      this.$router.push({
        path,
        query
      })
    },
    /**
     * 修改状态
     * @param {*} api
     * @param {*} [payload={}]
     * @param {boolean} isReload 是否回到列表第一页
     */
    changeState (api, payload = {}, isReload = false) {
      this.$http.fetch(api, payload).then(res => {
        if (res.success) {
          if (isReload) {
            this.$searchAction$()
          } else {
            this.$reload()
          }
        }
      }).catch((resp) => {
        this.$notify.error(resp.msg)
      })
    },
    /**
     * 排序
     * @param {*} data
     */
    handleSort (data) {
      const sortType = data.order === 'ascending' ? 1 : data.order === 'descending' ? 0 : ''
      const sortName = sortType !== '' ? data.prop : ''
      this.changeSearchfrom({ sortName, sortType })
    },
    generateHideElement (name, value) {
      var tempInput = document.createElement('input')
      tempInput.type = 'hidden'
      tempInput.name = name
      tempInput.value = value
      return tempInput
    },
    /**
     * 导出
     * @param {*} data
     */
    handleExport (data) {
      this.$notify.info('导出中，请稍后片刻')
      const url = this.exportApi
      const form = document.createElement('form')
      // let str = ''
      Object.keys(data).map(item => {
        if (Array.isArray(data[item])) {
          form.appendChild(this.generateHideElement(item, data[item].join(',')))
          // str += `${item}=${data[item].join(',')}&`
        } else {
          // str += `${item}=${data[item]}&`
          form.appendChild(this.generateHideElement(item, data[item]))
        }
      })
      // this.$http.fetch({ url: 'redpack/record/receiver/export',
      //   method: 'post',
      //   responseType: 'blob',
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   } }, str)
      //   .then(data => {
      //   })
      //   .catch(error => {
      //   })
      // console.log(this.$http.fetch)
      form.setAttribute('action', url)
      form.setAttribute('method', 'post')
      document.body.appendChild(form)
      form.submit()
      // console.log(form.submit)
    }
  }
}
