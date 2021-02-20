import { getErrorMsg } from '@/utils/toast'
import listPageMixin from '@/mixins/listPage'

export default {
  mixins: [listPageMixin],
  data: function () {
    return {
      model: {
        customerNick: '',
        guideIds: [],
        deleteTime: []
      },
      dataList: []
    }
  },
  created: function () {
    this.loadListFun()
  },
  methods: {
    // 加载列表
    async loadListFun (data) {
      let that = this
      that.loading = true
      let searchObj = data || that.searchObj
      // 好友昵称
      searchObj.searchMap.customerNick = that.model.customerNick
      // 员工
      searchObj.searchMap.guideIds = that.model.guideIds
      // 删除开始时间
      let deleteStartTime = ''
      // 删除结束时间
      let deleteEndTime = ''
      if (that.model.deleteTime !== null && that.model.deleteTime.length === 2) {
        deleteStartTime = that.model.deleteTime[0]
        deleteEndTime = that.model.deleteTime[1]
      }
      searchObj.searchMap.deleteStartTime = deleteStartTime
      searchObj.searchMap.deleteEndTime = deleteEndTime
      await that.$http
        .fetch(that.$api.weWork.weWorkCustomer.queryDeleteCustomerList, searchObj)
        .then(resp => {
          that.dataList = resp.result.data
          that.pagination.total = parseInt(resp.result.recordsTotal)
        })
        .catch(resp => {
          that.$notify.error(getErrorMsg('查询失败', resp))
        }).finally(() => {
          that.loading = false
        })
    },
    // 提交搜索
    submitForm () {
      this.loadListFun()
    },
    // 重置
    resetForm () {
      this.model.customerNick = ''
      this.model.guideIds = []
      this.model.deleteTime = []
      this.loadListFun()
    }
  }
}
