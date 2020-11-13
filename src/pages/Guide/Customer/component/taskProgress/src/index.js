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
      nick: '', // 当前操作用户
      teriminalType: 1, // 终端类型
      taskProgressStaute: 0, // 显示成功状态  1成功
      isClose: 1
    }
  },
  watch: {
    shopCustomerTransferTaskStatus (newVal) {
      this.changeShopCustomerTransferTaskStatus(newVal)
    }
  },
  computed: {
    progress: function () {
      if (this.shopCustomerTransferTaskStatus && parseInt(this.shopCustomerTransferTaskStatus.totalCount) === 0) {
        return 1
      } else {
        return parseInt(this.shopCustomerTransferTaskStatus.successCount) / parseInt(this.shopCustomerTransferTaskStatus.totalCount)
      }
    }

  },
  methods: {
    init () {
      let remumberLoginInfo = LocalStorage.get('remumber_login_info')
      let { nick } = remumberLoginInfo
      this.nick = nick
    },
    changeShopCustomerTransferTaskStatus (val) {
      if (!val) {
        this.isShow = false
        return false
      }
      if (
        val.terminalType === this.teriminalType &&
        val.operator === this.nick
      ) {
        this.isShow = true
      } else {
        this.isShow = false
        return false
      }
      if (parseInt(val.status) === 3) {
        if (parseInt(val.successCount) === parseInt(val.totalCount)) {
          // 成功数等于总数算完成转移
          this.taskProgressStaute = 1
        } else {
          this.taskProgressStaute = 0
        }
      }
    },
    onCloseCustomerTransferTask () {
      this.$http.fetch(this.$api.guide.shop.closeCustomerTransferTask, {
        taskId: this.shopCustomerTransferTaskStatus.taskId,
        operator: this.nick,
        terminalType: 1,
        shopId: this.shopId
      }).then((res) => {
        if (res.success) {
          this.$emit('onResetCustomerTransferTask')
        } else {
          this.$notify.error(`关闭任务失败${res.msg}`)
        }
      }).catch((err) => {
        this.$notify.error(`关闭任务接口${err.msg}`)
      })
    },
    onRedoCustomerTransferTask () {
      this.$http.fetch(this.$api.guide.shop.redoCustomerTransferTask, {
        taskId: this.shopCustomerTransferTaskStatus.taskId,
        operator: this.nick,
        terminalType: 1,
        shopId: this.shopId
      }).then((res) => {
        if (!res.success) {
          this.$emit('onResetCustomerTransferTask')
        } else {
          this.$notify.error(res.msg)
        }
      }).catch((err) => {
        this.$notify.error(`重新任务接口失败${err.msg}`)
      })
    }
  },
  mounted () {
    this.init()
  }
}
