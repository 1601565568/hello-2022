import { redpacketTypeMap, timeTypeForever, redpacketTypeList, setTypeList, normalType, closeType, normalRed, luckyRed, diyRed, timeTypeInterval } from '../const'
import { getErrorMsg } from '@/utils/toast'
export default {
  data () {
    return {
      redpacketTypeMap, timeTypeForever, redpacketTypeList, setTypeList, normalType, closeType, normalRed, luckyRed, diyRed, timeTypeInterval
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
    }
  }
}
