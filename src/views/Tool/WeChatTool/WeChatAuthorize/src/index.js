import formMixin from 'mixins/form'
import ErrorCode from 'configs/errorCode'

// 校验规则
var mixin = {
  data: function () {
    return {
      rules: {
        'wx_name': [
          {
            required: true,
            message: '请输入公众号',
            trigger: 'blur'
          },
          {
            min: 0,
            max: 50,
            message: '已超过可输入长度',
            trigger: 'blur,change'
          },
          {
            validator: (rule, value, callback) => {
              vue.$http.fetch(vue.$api.touch.wxAccount.hasNameExist, {id: vue.model.id, name: value})
                .then((resp) => {
                  if (resp.code === ErrorCode.TITLE_REPEAT) {
                    callback(new Error('此公众号已存在，请重新输入'))
                  } else {
                    callback()
                  }
                }).catch(() => {
                  callback(new Error('远程校验失败'))
                })
            },
            trigger: 'blur'
          }
        ],
        'app_key': [
          {
            required: true,
            message: '请输入appKey',
            trigger: 'blur'
          },
          {
            min: 0,
            max: 50,
            message: '已超过可输入长度',
            trigger: 'blur,change'
          },
          {
            validator: (rule, value, callback) => {
              vue.$http.fetch(vue.$api.touch.wxAccount.hasAppKeyExist, {id: vue.model.id, appKey: value})
                .then((resp) => {
                  if (resp.code === ErrorCode.TITLE_REPEAT) {
                    callback(new Error('此AppKey已存在,请重新输入'))
                  } else {
                    callback()
                  }
                }).catch(() => {
                  callback(new Error('远程校验失败'))
                })
            },
            trigger: 'blur'
          }
        ],
        'app_secret': [
          {
            required: true,
            message: '请输入appSecret',
            trigger: 'blur'
          },
          {
            min: 0,
            max: 50,
            message: '已超过可输入长度',
            trigger: 'blur,change'
          }
        ]
      }
    }
  },
  methods: {
    // 保存
    onSave: function () {
      var info
      if (this.saveType === 'edit') {
        info = '修改'
      } else {
        info = '添加'
      }
      var that = this
      that.saveDisabled = true
      that.validAndSubmit({
        api: this.$api.touch.wxAccount.saveOrUpdate,
        success: function (resp) {
          that.$notify.success(resp.msg)
          that.$refs.table.$reload()
          that.wxAccountVisible = false
        },
        error: function () {
          that.$notify.success(info + '失败')
        },
        complete: () => {
          that.saveDisabled = false
        }
      })
    },
    onAdd: function () {
      this.saveType = 'add'
      this.dialogTitle = '新增公众号'
      this.wxAccountVisible = true
    },
    onEdit: function (data) {
      this.saveType = 'edit'
      this.dialogTitle = '编辑公众号'
      this.getWxAccountDetails(data)
    },
    // 关闭弹窗
    onCloseDialog: function () {
      // 重置表单
      this.resetForm()
      this.wxAccountVisible = false
    },
    getWxAccountDetails: function (data) {
      let that = this
      let params = {id: data.id}
      this.$http.fetch(this.$api.touch.wxAccount.queryById, params)
        .then((resp) => {
          that.setModel({
            id: resp.result.id,
            wx_name: resp.result.wx_name,
            app_key: resp.result.app_key,
            app_secret: resp.result.app_secret,
            wx_status: resp.result.wx_status
          })
        }).catch(() => {
        }).finally(() => {
          that.wxAccountVisible = true
        })
    }

  }
}
var vue
export default {
  mixins: [formMixin, mixin],
  data: function () {
    return {
      wxAccountVisible: false,
      dialogTitle: '',
      saveType: '',
      saveDisabled: false,
      loading: false,
      model: {
        wx_name: '',
        app_key: '',
        app_secret: '',
        wx_status: 0,
        id: 0
      }
    }
  },
  created: function () {
    vue = this
  }
}
