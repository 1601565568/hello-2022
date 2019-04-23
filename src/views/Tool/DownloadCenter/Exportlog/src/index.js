import formMixin from 'mixins/form'
import ErrorCode from '@/config/errorCode'
// 校验规则
var mixin = {
  data: function () {
    return {
      rules: {
        'mobile': [{required: true, message: '请输入手机号'}, {
          min: 0,
          max: 255,
          message: '已超过可输入长度'
        }, {
          validator: (rule, value, callback) => {
            if (!/^[0-9,]+$/.test(value.substring(value.length - 1))) {
              callback(new Error('请输入数字'))
            } else if (!/^(1[1|3|5|7|8|9][0-9]{9},?)+$/.test(that.model.mobile)) {
              callback(new Error('请输入11位手机号码，多个以逗号分隔'))
            } else {
              callback()
            }
          },
          trigger: 'change,blur'
        }],
        'verificationCode': [{required: true, message: '请输入验证码'}, {
          min: 0,
          max: 6,
          message: '已超过可输入长度'
        }, {
          validator: (rule, value, callback) => {
            if (value !== undefined) {
              var val = value.replace(/\s/ig, '')// 去掉所有字符串中空格
              if (val === '') {
                callback(new Error('请输入验证码'))
              } else {
                callback()
              }
            }
          },
          trigger: 'change,blur'
        }]
      }
    }
  },
  methods: {
    // 打开弹窗

    sendCode: function () {
      let params = {
        mobile: that.model.mobile
      }
      that.$http.fetch(that.$api.core.downloadConfig.sendCaptcha, params)
        .then((resp) => {
          // 判断是否成功发送短信验证码
          if (resp.code === ErrorCode.MOBILE_ILLEGAL) {
            that.$notify.error('手机号码不合法')
          } else {
            that.captchaDisabled = true
            that.interval = setInterval(function () {
              that.setCaptchaText()
            }, 1000)
          }
        }).catch(() => {
          that.$notify.error('短信验证码发送失败,请联系客服人员')
        })
    },
    /**
     * 设置验证码按钮文本
     * @param val
     */
    setCaptchaText () {
      if (that.countDown === 0) {
        that.getCaptChaStr = '获取验证码'
        that.countDown = 59
        that.captchaDisabled = false
      } else {
        that.getCaptChaStr = '重新发送(' + that.countDown + ')'
        that.countDown--
      }
    },
    onSubmitAndDownload: function () {
      that.$refs.permissionForm.validate((valid) => {
        if (valid) {
          that.submit({
            api: that.$api.core.exportlog.validateCaptcha,
            params: {
              mobile: that.model.mobile,
              captcha: that.model.verificationCode
            },
            success: function (resp) {
              if (resp.code === ErrorCode.CAPTCHA_ERROR) {
                that.$notify.error('验证码不正确')
              } else {
                that.permisionVisible = false
                that.captchaDisabled = false
                that.model.verificationCode = ''
                that.countDown = 0
                that.onDownload()
              }
            },
            error: function () {
              that.$notify.error('校验失败')
            }
          })
        } else {
          return false
        }
      })
    },
    onCloseDiaglog: function () {
      that.permisionVisible = false
      that.captchaDisabled = false
      this.model.captcha = ''
      this.countDown = 0
      this.setCaptchaText()
    },
    onBeforeDownload: function (title, data) {
      if (data.result_state === 2) {
        that.downloadData.url = data.download_addr
        that.$http.fetch(this.$api.core.downloadConfig.queryDownLoadConfig, {id: this.$store.state.user.brand.id})
          .then((resp) => {
            if (resp.result.is_download_validate === 1) {
              that.model.mobile = resp.result.validate_mobile
              that.dialogTitle = title
              that.permisionVisible = true
            } else {
              that.onDownload()
            }
          })
      } else {
        that.$notify.error('文件不存在，请重新生成')
      }
    },
    onDownload: function () {
      this.$http.fetch(this.$api.core.exportlog.download, {url: that.downloadData.url})
        .then((resp) => {}).catch((resp) => {
          let url = window.URL.createObjectURL(new Blob([resp]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          var fileName = that.downloadData.url
          fileName = fileName.substring(fileName.lastIndexOf('\\'), fileName.length)
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
        })
    }
  }
}
var that
export default{
  mixins: [formMixin, mixin],
  data: function () {
    return {
      resultState: undefined,
      dialogTitle: '',
      permisionVisible: false,
      captchaDisabled: false,
      getCaptChaStr: '获取验证码',
      countDown: 59,
      interval: {},
      downloadData: {
        url: ''
      },
      model: {
        mobile: '',
        verificationCode: ''
      },
      downloadAddr: ''
    }
  },
  created: function () {
    that = this
  },
  watch: {
    captchaDisabled: function (val) {
      if (!val) {
        clearInterval(this.interval)
      }
    }
  }
}
