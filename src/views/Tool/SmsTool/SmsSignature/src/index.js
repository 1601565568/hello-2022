import formMixin from 'mixins/form'
import ErrorCode from 'configs/errorCode'
import apiRequestConfirm from 'utils/apiRequestConfirm'
// 校验规则
var mixin = {
  data: function () {
    return {
      rules: {
        signature_name: [
          {
            required: true,
            message: '请输入签名,限2-30个字',
            trigger: ['blur', 'change']
          }, {
            min: 2,
            max: 30,
            message: '限2-30个字',
            trigger: ['blur', 'change']
          }, {
            validator: (rule, value, callback) => {
              vue.$http.fetch(vue.$api.touch.smsSignature.hasSignatureExist, {id: vue.model.id ? vue.model.id : 0, signature_name: value})
                .then((resp) => {
                  if (resp.code === ErrorCode.TITLE_REPEAT) {
                    callback(new Error('此签名已存在，请重新输入'))
                  } else {
                    callback()
                  }
                }).catch(() => {
                  callback(new Error('远程校验失败'))
                })
            },
            trigger: ['blur', 'change']
          }]
      } // 新增数据各个需要校验的字段
    }
  },
  methods: {
    onClose: function () {
      this.resetForm()
      this.visible = false
    },
    // 打开弹窗
    onOpenDialog: function (type, title, data) {
      this.dialogTitle = title
      this.saveType = type
      if (this.saveType === 'edit') {
        this.getSmsSignatureInfo(data)
      } else {
        this.visible = true
      }
    },
    // 保存
    onSave: function () {
      var that = this
      var info = ''
      if (that.saveType === 'edit') {
        info = '修改'
      } else if (that.saveType === 'add') {
        info = '新增'
      }
      that.validAndSubmit({
        api: vue.$api.touch.smsSignature.saveOrUpdate,
        success: function (resp) {
          if (resp.code === ErrorCode.SUCCESS) {
            that.$notify.success(resp.msg)
          } else {
            that.$notify.error(resp.msg)
          }
          that.$refs.table.$reload()
          that.resetForm()
          that.visible = false
        },
        error: function () {
          that.$notify.error(info + '失败')
        }
      })
    },
    onSavaAndSubmit: function () {
      let that = this
      that.validAndSubmit({
        api: vue.$api.touch.smsSignature.saveAndSubmit,
        success: function (resp) {
          if (resp.code === ErrorCode.YS_SUBMIT_FAIL) {
            that.$notify.error(resp.msg)
          } else {
            that.$notify.success(resp.msg)
          }
          that.$refs.table.$reload()
          that.resetForm()
          that.visible = false
        },
        error: function () {
          that.$notify.error('保存并提交审核失败')
        }
      })
    },
    getSmsSignatureInfo: function (data) {
      let that = this
      let params = {id: data.id}
      this.$http.fetch(this.$api.touch.smsSignature.queryById, params)
        .then((resp) => {
          that.setModel({
            id: resp.result.id,
            signature_name: resp.result.signature_name,
            state: resp.result.state
          })
        }).catch(() => {
        }).finally(() => {
          that.visible = true
        })
    },
    loadUserInfo: function (deptName, userName) {
      // this.model.department_name = deptName
      this.model.user_name = userName
    },
    onEffectiveChange: function (call, val, row) {
      let that = this
      let info
      let changeEffective = 0
      if (val === 0) {
        info = '该签名设为通过审核后立即生效'
        changeEffective = 1
      } else if (val === 1) {
        info = '该签名通过审核后不立即生效，此操作您可能需要手动开启签名'
        changeEffective = 0
      }
      apiRequestConfirm(info).then(() => {
        that.$http.fetch(that.$api.touch.smsSignature.effectiveUpdate, {id: row.id, isEffective: changeEffective})
          .then((resp) => {
            that.$notify.success(resp.msg)
            that.$refs.table.$reload()
          }).catch(() => {
            that.$notify.error('状态更新失败，请重试')
          })
      }).catch(() => {
      })
    },
    onDefaultChange: function (call, val, row) {
      let that = this
      let info
      let changeDefault = 0
      if (val === 0) {
        info = '该签名设为默认'
        changeDefault = 1
      } else if (val === 1) {
        info = '该签名取消默认'
        changeDefault = 0
      }
      apiRequestConfirm(info).then(() => {
        that.$http.fetch(that.$api.touch.smsSignature.defaultUpdate, {id: row.id, isDefault: changeDefault})
          .then((resp) => {
            that.$notify.success(resp.msg)
            that.$refs.table.$reload()
          }).catch(() => {
            that.$notify.error('状态更新失败，请重试')
          })
      }).catch(() => {
      })
    }

  }
}
var vue
export default{
  mixins: [formMixin, mixin],
  data: function () {
    return {
      visible: false,
      dialogTitle: '签名配置',
      saveType: '',
      tabs: 'signature',
      model: {
        signature_name: '',
        create_name: '',
        is_default: 0,
        is_effective: 1,
        sign_staus: 0,
        shop_id: ''
        // department_name: ''
      },
      rules: {}
    }
  },
  created: function () {
    vue = this
  }// 初始化页面的时候加载内容
}
