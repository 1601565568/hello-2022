import formMixin from 'mixins/form'
import ErrorCode from '@/config/errorCode'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'
var vue
var mixin = {
  data: function () {
    return {
      rules: {
        'ys_account': [{
          required: true,
          message: '请选择通道账号',
          trigger: ['change', 'blur']
        }],
        'sp_name': [{ required: true, message: '请输入通道名称' }, {
          min: 0,
          max: 20,
          message: '已超过可输入长度',
          trigger: 'change'
        },
        {
          validator: (rule, value, callback) => {
            vue.$http.fetch(vue.$api.touch.ysChannel.hasChannelCodeExist, { id: vue.model.id ? vue.model.id : 0, channelCode: value })
              .then((resp) => {
                if (resp.code === ErrorCode.TITLE_REPEAT) {
                  callback(new Error('此通道标识已存在，请重新输入'))
                } else {
                  callback()
                }
              }).catch(() => {
                callback(new Error('远程校验失败'))
              })
          },
          trigger: 'blur'
        },
        {
          validator: (rule, value, callback) => {
            vue.$http.fetch(vue.$api.touch.ysChannel.hasSpNameExist, { id: vue.model.id ? vue.model.id : 0, spName: value })
              .then((resp) => {
                if (resp.code === ErrorCode.TITLE_REPEAT) {
                  callback(new Error('此通道标识已存在，请重新输入'))
                } else {
                  callback()
                }
              }).catch(() => {
                callback(new Error('远程校验失败'))
              })
          },
          trigger: 'blur'
        }],
        'channel_code': [{ required: true, message: '请输入通道标识' }, {
          min: 0,
          max: 30,
          message: '已超过可输入长度',
          trigger: 'change'
        },
        {
          validator: (rule, value, callback) => {
            vue.$http.fetch(vue.$api.touch.ysChannel.hasChannelCodeExist, { id: vue.model.id ? vue.model.id : 0, channelCode: value })
              .then((resp) => {
                if (resp.code === ErrorCode.TITLE_REPEAT) {
                  callback(new Error('此通道标识已存在，请重新输入'))
                } else {
                  callback()
                }
              }).catch(() => {
                callback(new Error('远程校验失败'))
              })
          },
          trigger: 'blur'
        }],
        // 'ys_account': [{required: true, message: '请选择账号'}],
        // 'send_mode': [{required: true, message: '请选择一个类型'}],
        'channel_type': [{ required: true, message: '请选择一个触发方式' }],
        'is_public': [{ required: true, message: '请选择开放性' }]
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
      let channelBrands = []
      for (var i = 0; i < that.brandOptions.length; i++) {
        if (that.brandOptions[i].isDisabled === 0) {
          let channelBrand = {
            id: 0,
            state: 1,
            brand_id: '',
            is_default: ''
          }
          channelBrand.brand_id = that.brandOptions[i].value
          if (that.brandOptions[i].isDefault !== 1) {
            channelBrand.is_default = 0
          } else {
            channelBrand.is_default = 1
          }
          channelBrands.push(channelBrand)
        }
      }
      that.model.use_range = channelBrands
      that.saveDisabled = true
      that.validAndSubmit({
        api: vue.$api.touch.ysChannel.saveOrUpdate,
        success: function (resp) {
          that.$notify.success(resp.msg)
          that.$refs.table.$reload()
          that.resetForm()
          that.dialogVisible = false
        },
        error: function () {
          that.$notify.success(info + '失败')
        },
        complete: () => {
          that.saveDisabled = false
        }
      })
    },
    // 打开弹窗
    onOpenDialog: function (type, title, data) {
      this.dialogTitle = title
      this.saveType = type
      if (this.saveType === 'edit') {
        this.getYsConfigInfoDetails(data)
      } else {
        this.dialogVisible = true
      }
    },
    // 关闭弹窗
    onCloseDialog: function () {
      // 重置表单
      this.resetForm()
      this.dialogVisible = false
    },
    onDefaultChange: function (call, val, row) {
      let that = this
      let info
      let changeDefault = 0
      if (val === 0) {
        info = '此通道设为该账号下默认通道'
        changeDefault = 1
      } else if (val === 1) {
        info = '此通道取消默认，此操作您可能需要手动选择通道'
        changeDefault = 0
      }
      apiRequestConfirm(info).then(() => {
        that.$http.fetch(that.$api.touch.ysChannel.changeDefaultStatus, { id: row.id,
          ysAccount: row.ys_account,
          isDefault: changeDefault,
          channelType: row.channel_type })
          .then((resp) => {
            that.$notify.success(resp.msg)
            that.$refs.table.$reload()
          }).catch(() => {
            that.$notify.error('状态更新失败，请重试')
          })
      }).catch(() => {
      })
    },
    getYsConfigInfoDetails: function (data) {
      let that = this
      let params = { id: data.id }
      this.$http.fetch(this.$api.touch.ysChannel.queryById, params)
        .then((resp) => {
          that.setModel({
            id: resp.result.id,
            ys_account: resp.result.ys_account,
            sp_name: resp.result.sp_name,
            send_mode: resp.result.send_mode,
            channel_code: resp.result.channel_code,
            is_public: resp.result.is_public,
            is_default: resp.result.is_default,
            channel_type: resp.result.channel_type,
            state: resp.result.state
          })
        }).catch(() => {
        }).finally(() => {
          that.dialogVisible = true
        })
    }
  }
}

export default {
  data: function () {
    return {
      id: -1,
      dialogTitle: '',
      loading: true,
      showSendModel: true,
      accountOptions: [],
      brandOptions: [],
      brandDefault: [],
      dialogVisible: false,
      model: {
        'id': 0,
        'sp_name': '',
        'channel_code': '',
        'use_range': [],
        'send_mode': 0,
        'channel_type': '',
        'is_public': '',
        'ys_account': ''
      }
    }
  },
  mixins: [mixin, formMixin],
  created: function () {
    vue = this
  },
  mounted: function () {
    let that = this
    this.$http.fetch(this.$api.touch.ysAccount.queryAccountOptions)
      .then((resp) => {
        that.accountOptions = resp.result
      })
  },
  watch: {
    'model.channel_type': function (val) {
      if (val === 2) {
        vue.showSendModel = false
      } else {
        vue.showSendModel = true
      }
    }
  }
}
