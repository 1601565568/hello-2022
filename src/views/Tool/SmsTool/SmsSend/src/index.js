import formMixin from 'mixins/form'
import ErrorCode from '@/config/errorCode'
// 校验规则
var mixin = {
  data: function () {
    return {
      rules: {
        targetStr: [
          {required: true, message: '请输入手机号'},
          {
            validator: (rule, val, callback) => {
              let that = this
              val = val.replace(/；/g, '\\;')
              var repaceReg = /(\\;)+(\n)+|(\n)+(\\;)+|(\n)+|(\\;)+/g
              // var repaceReg = /(\\;)+(\n)+|(\n)+(\\;)+|(\n)+|(\\;)+/g
              val = val.replace(repaceReg, ';').replace(';;', ';')
              var smsNumber = val.split(';')
              that.model.result = []
              for (var i = 0; i < smsNumber.length; i++) {
                smsNumber[i] = smsNumber[i].replace(/\s/ig, '')// 去掉所有字符串中空格
                if (smsNumber[i] !== '' && smsNumber[i].match('^((13[0-9]|15[012356789]|18[012346789]|14[57]|17[678]|170[059]|14[57]|166|19[89]))\\d{8}$')) {
                  if (that.inArray(smsNumber[i], that.model.result)) {
                    // callback(new Error(smsNumber[i] + '出现重复'))
                    callback(new Error('手机号码出现重复'))
                  } else {
                    that.model.result.push(smsNumber[i])
                  }
                }
                if (smsNumber[i] !== '' && !smsNumber[i].match('^((13[0-9]|15[012356789]|18[012346789]|14[57]|17[678]|170[059]|14[57]|166|19[89]))\\d{8}$')) {
                  // callback(new Error(smsNumber[i] + '手机号码格式错误'))
                  callback(new Error('手机号码格式错误'))
                }
                if (that.model.result.length > 20) {
                  callback(new Error('每次限发20条短信'))
                }
              }
              // that.model.target = val
              callback()
            },
            trigger: ['blur']
          }
        ],
        send_content: [
          {
            required: true,
            message: '请输入短信内容',
            trigger: ['blur', 'change']
          },
          {
            min: 1,
            max: 500,
            message: '已超过可输入长度',
            trigger: ['blur', 'change']
          },
          {
            validator: (rule, val, callback) => {
              if ((val.length + this.model.signature_name.length) > 500) {
                callback(new Error('已超过可输入长度'))
              } else {
                callback()
              }
            }
          }
        ],
        signature_name: [
          {
            required: true,
            message: '请选择短信签名',
            trigger: ['blur', 'change']
          }
        ]
      },
      rules2: {
        send_content: [
          {
            required: true,
            message: '请输入短信内容',
            trigger: ['blur', 'change']
          },
          {
            min: 1,
            max: 500,
            message: '已超过可输入长度',
            trigger: ['blur', 'change']
          },
          {
            validator: (rule, val, callback) => {
              if ((val.length + this.model.signature_name.length) > 500) {
                callback(new Error('已超过可输入长度'))
              } else {
                callback()
              }
            }
          }
        ],
        signature_name: [
          {
            required: true,
            message: '请选择短信签名',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    inArray: function (val, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          return true
        }
      }
      return false
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
    onHandleSendDate: function () {
      let that = this
      that.importSendModel.fileId = that.fileList[0].id
      that.importSendModel.sendContent = that.model.send_content
      that.importSendModel.signatureName = that.model.signature_name
    },
    onUploadSuccess: function (response, file, fileList) {
      let that = this
      that.fileList = []
      if (response.success) {
        let file = {}
        file.name = response.result.download_name
        file.id = response.result.id
        that.fileList.push(file)
      }
    },
    onUploadError: function (response, file, fileList) {
      let that = this
      that.$notify.error('上传文件失败，请联系管理员')
    },
    onUploadRemove: function (file, fileList) {
      let that = this
      that.fileList = []
    },
    handleClick: function (tab, event) {
    },
    onSend: function () {
      let that = this
      that.model.target = ''
      for (var i = 0; i < that.model.result.length; i++) {
        that.model.target += that.model.result[i] + ','
      }
      that.model.target = that.model.target.substr(0, that.model.target.length - 1)
      that.$refs.smsForm.validate((valid) => {
        if (valid) {
          that.model.source_model = 33 // MANUAL_SEND_SMS("短信批量发送-手动发送", "33"),
          that.model.send_content += that.model.signature_name
          that.$nextTick(() => {
            that.submit({
              api: this.$api.touch.smsSend.smsSend,
              success: function (resp) {
                that.$notify.success('发送成功')
                that.$refs.smsForm.resetFields()
                that.model.signature_name = that.defaultSignature
              },
              error: function (resp) {
                that.$notify.error(resp.msg)
              }
            })
          })
        } else {
          return false
        }
      })
    },
    onReset: function () {
      this.$refs.smsForm.resetFields()
    },
    // 文件上传标签页重置
    onReset2: function () {
      this.$refs.file.clearFiles()
      this.$refs.smsImportForm.resetFields()
    },
    // 文件上传标签页保存 暂时未实现具体内部方法
    onSave2: function () {
      var that = this
      if (this.fileList.length > 0) {
        this.onHandleSendDate()
        this.$refs.smsImportForm.validate((valid) => {
          if (valid) {
            that.importSendModel.source_model = 34  // IMPORT_SEND_SMS("短信批量发送-导入发送", "34"),
            that.$http.fetch(this.$api.touch.smsSend.importSmsSend
              , that.importSendModel)
              .then((resp) => {
                if (resp.code === ErrorCode.SUCCESS) {
                  this.$notify.success({
                    message: resp.msg
                  })
                  that.importVisible = false
                  that.$refs.smsImportForm.resetFields()
                  that.fileList = []
                  that.model.signature_name = that.defaultSignature
                  that.$refs.file.clearFiles()
                } else {
                  that.$notify.error({
                    message: '保存失败！'
                  })
                  return false
                }
              }).catch((resp) => {
              })
          } else {
            return false
          }
        })
      } else {
        that.$notify.warning({
          message: '请上传文件！'
        })
      }
    }
  }
}
// 校验规则
// var vue
export default{
  mixins: [formMixin, mixin],
  data: function () {
    return {
      uploadUrl: this.$api.core.uploadFile('smsSend'),
      fileList: [],
      state: {
        send_content: 1,
        contentLength: 0,
        smsOneLength: 70
      },
      smsSendTabs: 'first',
      loading: false,
      defaultSignature: '',
      importSendModel: {
        fileId: '',
        source_model: '',
        templateId: '',
        sendContent: '',
        signatureName: ''
      },
      model: Object.assign({}, {}, {
        template_id: '',
        target: '',
        source_model: '',
        result: [],
        targetStr: '',
        send_content: '',
        signature_name: ''
      })
    }
  },
  computed: {
  },
  watch: {
    'model.template_id': function (value) {
      var that = this
      if (value !== '') {
        that.$http.fetch(that.$api.touch.smsTemplate.queryById, {id: value})
          .then((resp) => {
            that.model.send_content = resp.result.template
          }).catch(() => {
            that.$notify.error('获取内容失败')
          })
      }
    }
  },
  created: function () {
    // vue = this
  }, // 初始化页面的时候加载内容
  mounted: function () {
    var that = this
    that.$http.fetch(that.$api.touch.smsSignature.getDefaultSignature)
      .then((resp) => {
        that.defaultSignature = resp.result.signature_name
        that.model.signature_name = resp.result.signature_name
      }).catch(() => {
      })
  }
}
