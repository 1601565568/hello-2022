import formMixin from 'mixins/form'
import ErrorCode from 'configs/errorCode'
// import moment from 'moment'
import apiRequestConfirm from 'utils/apiRequestConfirm'
// 校验规则
var mixin = {
  data: function () {
    return {
      rules: {
        before_time: [{required: true, message: '请选择积分清零范围', trigger: ['change', 'blur']}, {
          validator: function (rule, val, callback) {
            var now = new Date()
            var pickTime = new Date(val)
            if (now < pickTime) {
              callback(new Error('请选择今天之前时间点'))
            } else {
              callback()
            }
          },
          trigger: ['change', 'blur']
        }],
        operate_remark: [{required: true, message: '请输入操作备注', trigger: ['blur', 'change']},
          {min: 1, max: 300, message: '已超过可输入长度', trigger: ['blur', 'change']}]
      }
    }
  },
  methods: {
    // 方法名以on开头
    onOpenDialog: function () {
      this.visible = true
    },
    onClose: function () {
      this.resetForm()
      this.visible = false
    },
    onSave: function () {
      let that = this
      that.$refs.form.validate(function (valid) {
        if (valid) {
          apiRequestConfirm('将清零' + that.model.before_time + '前获得的全部积分，此操作提交后立即执行，无法取消').then(() => {
            that.validAndSubmit({
              api: that.$api.integral.integralClearTask.createIntegralClearTask,
              success: function (resp) {
                if (resp.code === ErrorCode.SUCCESS) {
                  that.$notify.success(resp.msg)
                  that.$refs.form.resetFields()
                  that.visible = false
                  that.$refs.table.$reload()
                } else {
                  that.$notify.error(resp.msg)
                }
              },
              error: function () {
              }
            })
          }).catch(() => {
          })
        }
      })
    }
  }
}
export default{
  mixins: [formMixin, mixin],
  data: function () {
    return {
      visible: false,
      dialogTitle: '',
      saveType: '',
      loading: false,
      tabs: 'integralClearTask',
      model: {
        id: '',
        operate_remark: '',
        before_time: ''
      },
      rules: {},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      }
    }
  },
  created: function () {
   // vue = this
  }// 初始化页面的时候加载内容
}
