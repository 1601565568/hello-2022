import formMixin from 'mixins/form'
import ErrorCode from '@/config/errorCode'
import moment from 'moment/moment'
var vue
var mixin = {
  data: function () {
    let that = this
    return {
      rules: {
        ys_account: [
          { required: true, message: '请输入账号' },
          { min: 0, max: 20, message: '已超过可输入长度', trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              vue.$http.fetch(vue.$api.touch.ysAccount.hasAccountExist, {
                id: vue.model.id ? vue.model.id : 0,
                ysAccount: value
              })
                .then((resp) => {
                  if (resp.code === ErrorCode.TITLE_REPEAT) {
                    callback(new Error('此账号已存在，请重新输入'))
                  } else {
                    callback()
                  }
                }).catch(() => {
                  callback(new Error('远程校验失败'))
                })
            },
            trigger: ['blur']
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              if (value.length > 0 && value.length < 6) {
                callback(new Error('密码至少六位'))
              } else if (value.length > 50) {
                callback(new Error('已超过可输入长度'))
              } else {
                callback()
              }
            },
            trigger: ['blur', 'change']
          }
        ],
        use_range: [
          { required: true, message: '请选择应用品牌', trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              if (value.length < 1) {
                callback(new Error('请选择应用品牌'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      smsRules: {
        targetStr: [
          { required: true, message: '请输入手机号' },
          {
            validator: (rule, val, callback) => {
              var repaceReg = /(\\;)+(\n)+|(\n)+(\\;)+|(\n)+|(\\;)+/g
              // var repaceReg = /(\\;)+(\n)+|(\n)+(\\;)+|(\n)+|(\\;)+/g
              val = val.replace(repaceReg, ';').replace(';;', ';')
              var smsNumber = val.split(';')
              that.result = []
              var targetStr = ''
              for (var i = 0; i < smsNumber.length; i++) {
                smsNumber[i] = smsNumber[i].replace(/\s/ig, '')// 去掉所有字符串中空格
                if (smsNumber[i] !== '' && smsNumber[i].match('^((13[0-9]|15[012356789]|18[012346789]|14[57]|17[678]|170[059]|14[57]|166|19[89]))\\d{8}$')) {
                  if (that.inArray(smsNumber[i], that.result)) {
                    callback(new Error(smsNumber[i] + '出现重复'))
                  } else {
                    that.result.push(smsNumber[i])
                    targetStr += smsNumber[i] + ','
                  }
                }
                if (smsNumber[i] !== '' && !smsNumber[i].match('^((13[0-9]|15[012356789]|18[012346789]|14[57]|17[678]|170[059]|14[57]|166|19[89]))\\d{8}$')) {
                  callback(new Error(smsNumber[i] + '手机号码格式错误'))
                }
                if (that.result.length > 20) {
                  callback(new Error('每次限发20条短信'))
                }
              }
              that.testSendSms.target = targetStr.substring(0, targetStr.length - 1)
              callback()
            },
            trigger: ['blur']
          }
        ],
        send_content: [
          { required: true, message: '请输入短信内容', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '已超过可输入长度', trigger: ['blur', 'change'] }
        ],
        signature_name: [
          { required: true, message: '请选择短信签名', trigger: ['blur', 'change'] }
        ],
        sp_id: [
          { required: true, message: '请选择通道', trigger: ['blur', 'change'] }
        ]
      },
      emailRules: {
        send_name: [
          { required: true, message: '请输入发件人名称,限4-50个字', trigger: ['blur', 'change'] },
          { min: 4, max: 50, message: '限4-50个字', trigger: ['blur', 'change'] }
        ],
        send_addr: [
          { required: true, message: '请输入发件人邮箱地址', trigger: ['blur', 'change'] },
          { type: 'email', message: '邮箱地址格式不正确', trigger: ['blur', 'change'] },
          { min: 0, max: 200, message: '已超过可输入长度', trigger: ['blur', 'change'] }
        ],
        targetStr: [
          { required: true, message: '请输入收件人邮箱地址', trigger: ['blur', 'change'] },
          { min: 0, max: 10000, message: '已超过可输入长度', trigger: ['blur', 'change'] },
          {
            validator: function (rule, val, callback) {
              // 邮件格式正则
              // var myreg = /^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
              var emails = val
              if (emails.length === 0) {
                callback(new Error('请输入收件邮箱地址'))
              }
              var repaceReg = /(\\;)+(\n)+|(\n)+(\\;)+|(\n)+|(\\;)+/g
              emails = emails.replace(repaceReg, ';').replace(';;', ';')
              var emailsArray = emails.split(';')
              var result = []
              var targetStr = ''
              for (var i = 0; i < emailsArray.length; i++) {
                emailsArray[i] = emailsArray[i].replace(/\s/ig, '')// 去掉所有字符串中空格
                // 下面那行match中的内容为正则表达式，用于验证邮箱
                if (emailsArray[i] !== '' && emailsArray[i].match(/^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/)) {
                  if (that.inArray(emailsArray[i], result)) {
                    callback(new Error(emailsArray[i] + '出现重复'))
                  } else {
                    result.push(emailsArray[i])
                    targetStr += emailsArray[i] + ','
                  }
                }
                if (emailsArray[i] !== '' && !emailsArray[i].match(/^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/)) {
                  callback(new Error('邮箱地址格式不正确'))
                }
              }
              that.testSendEmail.target = targetStr.substring(0, targetStr.length - 1)
              if (result.length > 100) {
                callback(new Error('每次限发100封邮件'))
              }
              callback()
            }
          }
        ],
        title_name: [
          { required: true, message: '请输入邮件标题', trigger: 'blur' },
          { min: 0, max: 200, message: '已超过可输入长度', trigger: ['blur', 'change'] }
        ],
        editor: [
          { required: true, message: '请输入邮件内容，限制10000字', trigger: ['blur'] },
          { min: 1, max: 10007, message: '已超过可输入长度', trigger: ['blur', 'change'] }
        ],
        sp_id: [
          { required: true, message: '请选择通道', trigger: ['blur', 'change'] }
        ]
      },
      /* detailRules: {
        clientSmsPrice: [
          {type: 'number', message: '金额必须为数字值', trigger: ['blur', 'change']}
        ],
        clientMmsPrice: [
          {type: 'number', message: '金额必须为数字值', trigger: ['blur', 'change']}
        ],
        clientEmailPrice: [
          {type: 'number', message: '金额必须为数字值', trigger: ['blur', 'change']}
        ]
      }, */
      messageState: false,
      mmsState: false,
      superLetterState: false,
      mailState: false
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
    getBrands: function (useRange) {
      let that = this
      that.brandOptions = []
      var allBrands = []
      this.$http.fetch(this.$api.touch.ysChannel.queryAllBrandOptions)
        .then((resp) => {
          allBrands = resp.result
          if (allBrands !== null) {
            for (var i = 0; i < allBrands.length; i++) {
              if (allBrands[i].isDisabled === '1') {
                if (this.inArray(allBrands[i].value, useRange)) {
                  allBrands[i].isDisabled = false
                } else {
                  allBrands[i].isDisabled = true
                }
              } else {
                allBrands[i].isDisabled = false
              }
            }
            that.brandOptions = allBrands
          }
        })
    },
    // 初始化富文本框
    editorReady: function (instance) {
      // 将实例 instance 存储到 data中
      this.editorInstance = instance
      instance.setContent('') // 初始化时，对富文本编辑器进行赋值
      instance.addListener('blur', () => {
        this.testSendEmail.editor = this.editorInstance.getContent()
      })
    },
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
        api: vue.$api.touch.ysAccount.saveOrUpdate,
        success: function (resp) {
          that.$notify.success(resp.msg)
          that.resetForm()
          that.$refs.table.$reload()
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
        this.onGetYsAccountDetail(data)
      } else {
        this.getBrands([])
        this.dialogVisible = true
      }
    },
    onOpenDetail: function (type, title, data) {
      this.detailTitle = title
      this.onLoadAccountInfo(data)
      this.detailVisible = true
    },
    onOpenSendSms: function (data) {
      this.testSendSms.account = data
      this.sendSmsVisible = true
      this.$nextTick(() => {
        this.$refs.channelOption1.refresh()
      })
    },
    onOpenSendEmail: function (data) {
      this.testSendEmail.account = data
      this.sendEmailVisible = true
      this.$nextTick(() => {
        this.$refs.channelOption2.refresh()
      })
    },
    // 关闭弹窗
    onCloseDialog: function () {
      // 重置表单
      this.resetForm()
      this.dialogVisible = false
    },
    // 关闭详情弹窗
    onCloseDetail: function () {
      this.messageState = false
      this.mmsState = false
      this.superLetterState = false
      this.mailState = false
      this.detailVisible = false
    },
    onCloseSendSmsDialog: function () {
      this.$refs.smsForm.resetFields()
      this.sendSmsVisible = false
    },
    onCloseSendEmailDialog: function () {
      this.$refs.testSendEmail.resetFields()
      this.sendEmailVisible = false
    },
    onGetYsAccountDetail: function (data) {
      let that = this
      let params = { id: data.id }
      this.$http.fetch(this.$api.touch.ysAccount.queryById, params)
        .then((resp) => {
          that.setModel({
            id: resp.result.id,
            ys_account: resp.result.ys_account,
            password: resp.result.password,
            use_range: resp.result.use_range,
            remark: resp.result.remark
          })
          this.getBrands(resp.result.use_range)
        }).catch(() => {
        }).finally(() => {
          that.dialogVisible = true
        })
    },
    onLoadAccountInfo: function (data) {
      let that = this
      let params = { id: data.id }
      this.$http.fetch(this.$api.touch.ysAccount.getAccountInfo, params)
        .then((resp) => {
          that.detail.id = data.id
          that.detail.ysAccount = data.ys_account
          that.detail.use_range = data.use_range
          if (resp.code === ErrorCode.YS_ACCOUNT_NO_EXIST) {
            that.$notify.error('通道账号或密码不正确，请核对后重试')
            that.editable = false
          } else {
            that.editable = true
          }
          that.detail.totalPrice = resp.result.totalPrice
          that.detail.status = resp.result.status
          that.detail.update_time = resp.result.lastSuccessTime ? moment(resp.result.lastSuccessTime).format('YYYY-MM-DD HH:mm:ss') : resp.result.lastSuccessTime
          that.detail.smsLeftCount = resp.result.smsleftCount
          that.detail.smsTotalSendCount = resp.result.smstotalSendCount
          that.detail.clientSmsCharges = resp.result.clientSmsCharges
          // that.detail.smsPrice = resp.result.smsprice
          that.detail.emailLeftCount = resp.result.emailLeftCount
          that.detail.emailTotalSendCount = resp.result.emailTotalSendCount
          that.detail.clientEmailCharges = resp.result.clientEmailCharges
          // that.detail.emailPrice = resp.result.emailprice
          that.detail.mmsLeftCount = resp.result.mmsLeftCount
          that.detail.mmsTotalSendCount = resp.result.mmsTotalSendCount
          that.detail.clientMmsCharges = resp.result.clientMmsCharges
          that.detail.mmsPrice = resp.result.mmsprice
          that.detail.clientSmsPrice = resp.result.clientSmsCharges
          that.detail.clientMmsPrice = resp.result.clientMmsCharges
          that.detail.clientEmailPrice = resp.result.clientEmailCharges
          /* that.tempPrice.clientSmsPrice = resp.result.clientSmsCharges
          that.tempPrice.clientMmsPrice = resp.result.clientMmsCharges
          that.tempPrice.clientEmailPrice = resp.result.clientEmailCharges */
        }).catch(() => {
        }).finally(() => {
        })
    },
    // 发送短信
    onSendSms: function () {
      let that = this
      that.$refs.smsForm.validate(function (valid) {
        if (valid) {
          var data = that.testSendSms
          that.$nextTick(function () {
            this.$http.fetch(this.$api.touch.smsSend.smsSendTest, data)
              .then(resp => {
                if (resp.code !== ErrorCode.SUBMIT_FAIL) {
                  that.$notify.success('发送成功')
                  that.$refs.smsForm.resetFields()
                  that.sendSmsVisible = false
                } else {
                  that.$notify.error(resp.msg)
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
    // 发送邮件
    onSendEmail: function () {
      var that = this
      that.$refs.testSendEmail.validate(function (valid) {
        if (valid) {
          var content = that.testSendEmail.editor
          // 本方法发送的是测试邮件内容的
          var templateContent = {
            'CustomDefinitionText': '',
            'CustomDefinition': content,
            'TemplateType': 0, // 此页面只有这种类型，特殊处置
            'itemIds': ''
          }
          templateContent = JSON.stringify(templateContent)
          that.testSendEmail.email_content = templateContent
          var data = that.testSendEmail
          that.$nextTick(function () {
            that.$http.fetch(this.$api.touch.emailSend.emailSendTest, data)
              .then(resp => {
                if (resp.success === true) {
                  that.$notify.success('发送成功')
                  this.$refs.testSendEmail.resetFields()
                  this.sendEmailVisible = false
                } else {
                  that.$notify.error(resp.msg)
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
    onResetSms: function () {
      this.$refs.smsForm.resetFields()
      this.sendSmsVisible = false
    },
    onResetEmail: function () {
      this.editorInstance.setContent('')
      this.$refs.testSendEmail.resetFields()
      this.sendEmailVisible = false
    },
    onSavePrice: function () {
      let that = this
      that.$refs.detailForm2.validate(function (valid) {
        if (valid) {
          var params = {
            channelId: that.detail.id,
            clientSmsCharges: that.detail.clientSmsPrice,
            clientEmailCharges: that.detail.clientEmailPrice,
            clientMmsCharges: that.detail.clientMmsPrice
          }
          that.$http.fetch(that.$api.touch.ysAccount.updateInfo, params)
            .then(resp => {
              if (resp.code !== ErrorCode.YS_SUBMIT_FAIL) {
                that.$notify.success(resp.msg)
                that.detail.clientSmsCharges = that.detail.clientSmsPrice
                that.detail.clientEmailCharges = that.detail.clientEmailPrice
                that.detail.clientMmsCharges = that.detail.clientMmsPrice
              } else {
                that.$notify.error(resp.msg)
              }
            }).catch(() => {
            }).finally(() => {
              that.messageState = false
              that.mmsState = false
              that.superLetterState = false
              that.mailState = false
            // that.saveDisabled = false
            })
        }
      })
    },
    onEditPrice: function (tag) {
      let that = this
      if (tag === 1) {
        that.messageState = true
        that.tempPrice.clientSmsCharges = that.detail.clientSmsPrice
      }
      if (tag === 2) {
        that.mmsState = true
        that.tempPrice.clientMmsCharges = that.detail.clientMmsPrice
      }
      if (tag === 3) {
        that.mailState = true
        that.tempPrice.clientEmailPrice = that.detail.clientEmailCharges
      }
    },
    onClosePrice: function (tag) {
      let that = this
      if (tag === 1) {
        that.messageState = false
        that.detail.clientSmsPrice = that.tempPrice.clientSmsCharges
      }
      if (tag === 2) {
        that.mmsState = false
        that.detail.clientMmsPrice = that.tempPrice.clientMmsCharges
      }
      if (tag === 3) {
        that.mailState = false
        that.detail.clientEmailPrice = that.tempPrice.clientEmailCharges
      }
    }
  }
}
export default {
  data: function () {
    return {
      id: -1,
      dialogTitle: '',
      custom: 'custom',
      data: [{}],
      brandOptions: [],
      loading: true,
      editable: true,
      dialogVisible: false,
      detailTitle: '',
      detailVisible: false,
      sendSmsVisible: false,
      sendEmailVisible: false,
      model: {
        ys_account: '',
        password: '',
        use_range: [],
        send_mode: '',
        type: ''
      },
      detail: {
        ys_account: '',
        ys_status: '',
        total_price: 0,
        use_range: '',
        update_time: ''
      },
      tempPrice: {
        clientSmsCharges: '',
        clientMmsCharges: '',
        clientEmailCharges: ''
      },
      testSendSms: {
        sp_id: '',
        target: '',
        targetStr: '',
        send_content: '',
        signature_name: ''
      },
      testSendEmail: {
        sp_id: '',
        send_name: '',
        send_addr: '',
        targetStr: '',
        target: '',
        title_name: '',
        editor: ''
      },
      myConfig: {
        // 你的UEditor资源存放的路径，相对于打包后的index.html
        UEDITOR_HOME_URL: '/static/UEditor/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '80%',
        serverUrl: ''
      }
    }
  },
  mixins: [mixin, formMixin],
  created: function () {
    vue = this
  },
  mounted: function () {}
}
