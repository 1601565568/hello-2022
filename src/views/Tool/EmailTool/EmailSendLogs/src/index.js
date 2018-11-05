import formMixin from 'mixins/form' // 引入表单验证的一些相关方法
// 校验规则
var mixin = {
  data: function () {
    return {
      rules: {

      } // 新增数据各个需要校验的字段
    }
  },
  methods: {
    // 弹窗初始化
    onInitEmailDetailForm: function () {
      this.emailSendLogDetail = {
        targets: [],
        customer_name: '',
        send_time: '',
        send_name: '',
        title_name: '',
        email_content: ''
      }
    },
    // 查看邮件详情
    onEmailDetail: function (data) {
      this.title = '邮件详情'
      this.$nextTick(function () {
        this.$http.fetch(this.$api.touch.emailSend.queryById, {id: data.id})
          .then((resp) => {
            this.emailSendLogDetail.target = resp.result.target
            this.emailSendLogDetail.targets = resp.result.target.split(',')
            this.emailSendLogDetail.send_time = resp.result.send_time
            this.emailSendLogDetail.send_name = resp.result.send_name
            this.emailSendLogDetail.send_addr = resp.result.send_addr
            this.emailSendLogDetail.title_name = resp.result.title_name
            this.emailSendLogDetail.email_content = resp.result.email_content
            this.visible = true
          }).catch(() => {
          }).finally(() => {
            this.loading = false
            this.visible = true
          })
      })
    },
    // 关闭弹窗
    onCloseDialog: function () {
      this.visible = false
      this.onInitEmailDetailForm()
    }
  }
}// 校验规则
export default{
  mixins: [formMixin, mixin],
  data: function () {
    return {
      title: '',
      visible: false,
      emailSendLogDetail: {
        customer_name: '',
        send_time: '',
        send_name: '',
        title_name: '',
        email_content: ''
      }
    }
  },
  created: function () {
  }// 初始化页面的时候加载内容
}
