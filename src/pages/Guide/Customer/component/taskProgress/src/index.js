import ElProgress from '@nascent/nui/lib/progress'
import LocalStorage from 'store/dist/store.legacy.min.js'
export default {
  props: {
    shopCustomerTransferTaskStatus: null,
    shopId: {
      type: String
    }
  },
  components: {
    ElProgress
  },
  data () {
    return {
      isShow: false, // 是否显示进度
      user: '', // 当前操作用户
      userId: null,
      teriminalType: 1, // 终端类型
      taskProgressStaute: 0, // 显示成功状态  1成功
      isClose: 1,
      pageContent: '', // 页面文案显示
      showBtn: false,
      showLookBtn: false
    }
  },
  watch: {
    shopCustomerTransferTaskStatus: {
      handler (newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.changeShopCustomerTransferTaskStatus(newVal)
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    progress: function () {
      let shopCustomerTransferTaskStatus = this.shopCustomerTransferTaskStatus
      if (
        !shopCustomerTransferTaskStatus ||
        (shopCustomerTransferTaskStatus &&
          parseInt(shopCustomerTransferTaskStatus.totalCount) === 0)
      ) {
        return parseInt(1)
      } else {
        let result = parseInt(
          (
            ((parseInt(shopCustomerTransferTaskStatus.successCount) +
              parseInt(shopCustomerTransferTaskStatus.errorCount)) *
              100) /
            parseInt(this.shopCustomerTransferTaskStatus.totalCount)
          ).toFixed(0)
        )
        return result < 1 ? 1 : result
      }
    }
  },
  methods: {
    lookTransDetail () {
      const taskId = this.shopCustomerTransferTaskStatus.taskId
      const operatorName = this.shopCustomerTransferTaskStatus.operatorName || ''
      const transferTime = this.shopCustomerTransferTaskStatus.transferTime || ''
      const route = this.$router.resolve({
        name: 'TRANS_CUSTOMER_DETAIL',
        query: {
          taskId,
          operatorName,
          transferTime
        }
      })
      window.open(route.href, '_blank')
    },
    init () {
      let user = this.$store.state.user.remumber.remumber_login_info.productConfig.user
      let { nick, nickId } = user
      this.user = nick
      this.userId = nickId
    },
    changeShopCustomerTransferTaskStatus (val) {
      if (!val) {
        this.isShow = false
        return false
      }
      this.formatContent(val)
      // 终端相等，用户ID相等
      if (
        val.terminalType === this.teriminalType &&
        val.operator === this.userId
      ) {
        this.isShow = true
      }
      this.isShow = val.showProgress === 1
      if (
        parseInt(val.status) === 3 &&
        parseInt(val.totalCount) !== 0 &&
        parseInt(val.successCount) === parseInt(val.totalCount)
      ) {
        this.taskProgressStaute = 1
      } else if (
        parseInt(val.status) === 3 &&
        parseInt(val.totalCount) === 0 &&
        parseInt(val.successCount) === 0 &&
        parseInt(val.totalCount) === 0
      ) {
        this.taskProgressStaute = 1
      } else {
        this.taskProgressStaute = 0
      }
    },
    formatContent (val) {
      var content = ''
      let TaskStatus = this.formatTaskStatus(val)
      this.showBtn = false
      this.showLookBtn = false
      const str = TaskStatus.transferRange === 1 ? '更换专属导购' : '更换专属导购和企业微信好友关系'
      let sucStr = TaskStatus.transferRange === 2 ? '；好友转移待24小时确认结果' : ''
      if (TaskStatus.totalCount === 0) {
        content = `该门店会员正在${str},更换进度...`
      }
      if (TaskStatus.totalCount !== 0 && status !== 3) {
        content = `该门店${TaskStatus.totalCount}个会员正在${str}，更换进度：`
      }
      if (
        TaskStatus.totalCount !== 0 &&
        TaskStatus.status === 3 &&
        TaskStatus.totalCount !== TaskStatus.successCount
      ) {
        // if (TaskStatus.transferRange === 1) {
        //   this.showBtn = true
        // } else if (TaskStatus.transferRange === 2) {
        //   this.showLookBtn = true
        // }
        this.showLookBtn = true
        this.showBtn = true
        // content = `该门店${TaskStatus.totalCount}个会员${str}情况，成功：${TaskStatus.successCount}人；失败：${TaskStatus.errorCount}人` + sucStr
        if (TaskStatus.successCount === 0) {
          sucStr = '；未进行好友转移'
        }
        content = `会员转移成功${TaskStatus.successCount}人，失败${TaskStatus.errorCount}人` + sucStr
      }
      if (
        TaskStatus.totalCount !== 0 &&
        TaskStatus.status === 3 &&
        TaskStatus.totalCount === TaskStatus.successCount
      ) {
        // content = `该门店${TaskStatus.totalCount}个会员${str}成功` + sucStr
        content = `会员转移成功${TaskStatus.totalCount}人` + sucStr
        this.showLookBtn = true
      }
      /* 特殊情况处理 */
      if (
        TaskStatus.status === 3 &&
        parseInt(TaskStatus.totalCount) === 0 &&
        parseInt(TaskStatus.successCount) === 0 &&
        parseInt(TaskStatus.totalCount) === 0
      ) {
        // content = `该门店${TaskStatus.totalCount}个会员${str}成功` + sucStr
        content = `会员转移成功${TaskStatus.totalCount}人` + sucStr
        this.showLookBtn = true
      }
      this.pageContent = content
    },
    formatTaskStatus (val) {
      return {
        ...val,
        totalCount: parseInt(val.totalCount),
        successCount: parseInt(val.successCount),
        errorCount: parseInt(val.errorCount),
        status: parseInt(val.status)
      }
    },
    onCloseCustomerTransferTask () {
      this.$http
        .fetch(this.$api.guide.shop.closeCustomerTransferTask, {
          taskId: this.shopCustomerTransferTaskStatus.taskId,
          operator: this.userId,
          operatorName: this.user,
          terminalType: 1,
          shopId: this.shopId
        })
        .then(res => {
          if (res.success) {
            this.$emit('onResetCustomerTransferTask', 1)
          } else {
            this.$notify.warning(`${res.msg}`)
          }
        })
        .catch(err => {
          this.$notify.warning(`${err.msg}`)
        })
    },
    onRedoCustomerTransferTask () {
      this.$http
        .fetch(this.$api.guide.shop.redoCustomerTransferTask, {
          taskId: this.shopCustomerTransferTaskStatus.taskId,
          operator: this.userId,
          operatorName: this.user,
          terminalType: 1,
          shopId: this.shopId
        })
        .then(res => {
          if (res.success) {
            this.$emit('onResetCustomerTransferTask', 2)
          } else {
            this.$notify.error(res.msg)
          }
        })
        .catch(err => {
          this.$notify.error(`${err.msg}`)
        })
    }
  },
  mounted () {
    this.init()
  }
}
