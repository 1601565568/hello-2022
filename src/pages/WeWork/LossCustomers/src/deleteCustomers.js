import { getErrorMsg } from '@/utils/toast'
import listPageMixin from '@/mixins/listPage'

export default {
  mixins: [listPageMixin],
  data: function () {
    const operateButtons = [
      {
        func: function (obj) {
          // console.log(this, 'this')
          // this.$parent.$refs.detail.onOpenDetail(obj.row.sys_customer_id)
          this.onUserDetail(obj.row)
        },
        // icon: '$.noop',
        name: '详情',
        auth: '',
        visible: ''
      }
    ]
    return {
      // 判断客道、ecrp环境
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType,
      operateButtons: operateButtons,
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
      this.pagination.page = 1
      this.searchObj.start = 0
      this.searchObj.searchMap = {}
      this.loadListFun()
    },
    // 重置
    resetForm () {
      this.model.customerNick = ''
      this.model.guideIds = []
      this.model.deleteTime = []
      this.pagination.page = 1
      this.searchObj.start = 0
      this.searchObj.searchMap = {}
      this.loadListFun()
    },
    checkUrl (url) {
      if (url !== null && url !== '') {
        if (url.indexOf('img.alicdn.com') !== -1) {
          url = url + '_200x200.jpg'
        }
      }
      return url
    },
    // 查询外部联系人详情，根据shopId和unionId查询
    onUserDetail (val) {
      // console.log(val, '打开')
      this.$refs.NsFriendDetail.showDetailDialog(val)
    }
  }
}
