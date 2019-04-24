import formMixin from 'web-crm/src/mixins/form'
import ErrorCode from '@/config/errorCode'

var vm
export default {
  mixins: [formMixin],
  data: function () {
    return {
      visible11: true,
      visible: false,
      trackVisible: false,
      detailVisible: false,
      tags: {},
      model: {
        smsTemplateId: '',
        mobiles: '',
        smsContent: '',
        smsSignature: ''
      },
      templateParams: {
        type: 4,
        marketingManner: 0
      },
      rules: {
        smsTemplateId: [{ required: true, message: '请选择', trigger: 'change' }],
        smsSignature: [{ required: true, message: '请选择', trigger: 'change' }],
        smsContent: [{ required: true, message: '请输入短信内容', trigger: 'change' }]
      }
    }
  },
  methods: {
    sendSms () {
      vm.visible = true
    },
    // 查询短信占位符
    querySmsPlaceholder: function () {
      let that = this
      this.$http.fetch(this.$api.core.common.querySmsPlaceholder, { type: 'sms' })
        .then((resp) => {
          that.tags = resp.result ? resp.result : {}
        })
    },
    onTrackOpen (obj) {
      vm.tradeVisible = true
      vm.model = obj.row.customerName
    },
    addSms (obj) {
      vm.visible = true
      vm.model.mobiles = '1231231231'
    },
    saveSms () {
      vm.$refs.form.validate((valid) => {
        if (valid) {
          vm.$http.fetch(vm.$api.database.customer.sendSms
            , { 'mobiles': vm.model.mobiles, 'smsContent': vm.model.smsContent })
            .then((resp) => {}).catch((resp) => {})
        } else {
          return false
        }
      })
    },
    onSave: function () {
      var that = this
      that.validAndSubmit({
        api: that.$api.database.black.save,
        success: function (resp) {
          if (resp.code !== ErrorCode.MOBILE_BLACK) {
            vm.$notify.success(resp.msg)
            vm.visible = false
          } else {
            that.$notify.error('添加失败')
          }
        },
        error: function () {
          that.$notify.error('添加失败')
        }
      })
    },
    closeDialog: function () {
      this.$refs.form.resetFields()
      this.visible = false
    },
    closeImportDialog: function () {
      this.importVisible = false
      this.$refs.importForm.resetFields()
    },
    beforeAvatarUpload: function (file) {
      const istype = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const isSize = file.size / 1024 / 1024 < 1
      if (!istype) {
        this.$notify.error('上传文件只能是xls/xlsx格式!')
      }
      if (!isSize) {
        this.$notify.error('上传文件大小不能超过 1MB!')
      }
      return istype && isSize
    },
    saveBlack: function () {
      var that = this
      this.$refs.importForm.validate((valid) => {
        if (valid) {
          if (this.$refs.file.uploadFiles.length > 0) {
            that.$refs.file.submit()
          } else {
            that.$message({
              message: '请上传文件！',
              type: 'warning'
            })
          }
        } else {
          return false
        }
      })
    },
    uploadFile: function (file) {
      var that = this
      let param = new FormData()
      param.append('file', file.file)
      that.$http.fetch(this.$api.database.black.importBlack
        , param)
        .then((resp) => {
          if (resp.code === ErrorCode.SUBMIT_FAIL) {
            that.$message({
              message: '文件上传失败！',
              type: 'warning'
            })
            return false
          } else {
            this.$message({
              message: resp.msg,
              type: 'success'
            })
            that.importVisible = false
            that.$refs.file.clearFiles()
          }
        }).catch((resp) => {})
    },
    importKdtouchblack: function () {
      this.importVisible = true
    },
    downloadFile: function () {
      this.$http.fetch(this.$api.database.black.download)
        .then((resp) => {}).catch((resp) => {
          let url = window.URL.createObjectURL(new Blob([resp]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '黑名单模板.xlsx')
          document.body.appendChild(link)
          link.click()
        })
    }
  },
  watch: {
    'model.smsTemplateId': function (val) {
      let that = this
      // 获取当前选中模板对象
      that.$refs.templateSelect.$data['options'].map(item => {
        if (item.hasOwnProperty('id') && item.id === val) {
          that.$parent.$data['smsModel'].smsContent = item.template
        }
      })
    }
  },
  created: function () {
    vm = this
  },
  mounted: function () {
  }
}
