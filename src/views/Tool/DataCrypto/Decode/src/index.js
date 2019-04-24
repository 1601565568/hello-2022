import formMixin from 'web-crm/src/mixins/form' // 引入表单验证的一些相关方法
// 校验规则
var mixin = {
  data: function () {
    return {
      rules: {
        key: [{
          required: true,
          message: '请输入解密目标,限4-50个字',
          trigger: ['blur', 'change']
        }, {
          min: 4,
          max: 50,
          message: '限4-50个字',
          trigger: ['blur', 'change']
        }],
        type: [{
          required: true,
          message: '请选择类型',
          trigger: ['blur', 'change']
        }],
        content: [{
          // 延迟时间
          validator: (rule, value, callback) => {
            if (value === '') {
              // callback(new Error('请输入邮件内容'));
              callback()
            } else {
              callback()
            }
          }
        }]

      }
    }
  },
  methods: {
    // 发送邮件
    onSendEmail: function (data) {
      var that = this
      that.$refs.sendEmailForm.validate(function (valid) {
        if (valid) {
          var data = that.model
          data.isDecrypt = true
          that.$nextTick(function () {
            this.$http.fetch(this.$api.marketing.mktManage.decrypt, data)
              .then(resp => {
                if (resp.success === true) {
                  that.$message.success('解密成功')
                  that.model.result = resp.result
                  this.resetForm()
                } else {
                  that.$message.error(resp.msg)
                }
              }).catch(() => {
              }).finally(() => {
              // that.saveDisabled = false
              })
          })
        } else {
          return false
        }
      })
    },
    onEncode: function (data) {
      var that = this
      that.$refs.encodeForm.validate(function (valid) {
        if (valid) {
          var data = that.encodeModel
          data.isDecrypt = false
          that.$nextTick(function () {
            this.$http.fetch(this.$api.marketing.mktManage.decrypt, data)
              .then(resp => {
                if (resp.success === true) {
                  that.$message.success('加密成功')
                  that.encodeModel.encodeResult = resp.result
                  this.resetForm()
                } else {
                  that.$message.error(resp.msg)
                }
              }).catch(() => {
              }).finally(() => {
              // that.saveDisabled = false
              })
          })
        } else {
          return false
        }
      })
    },
    resetForm: function () {
      this.$refs.sendEmailForm.resetFields()
    }
  }
}// 校验规则
export default {
  mixins: [formMixin, mixin],
  data: function () {
    return {
      loading: false,
      sendModedata: [{
        value: 'phone',
        label: '手机号'
      }, {
        value: 'simple',
        label: '通用'
      }],
      model: {
        key: '',
        type: '',
        result: ''
      },
      encodeModel: {
        key: '',
        type: '',
        encodeResult: ''
      }
    }
  },
  created: function () {
  }// 初始化页面的时候加载内容
}
