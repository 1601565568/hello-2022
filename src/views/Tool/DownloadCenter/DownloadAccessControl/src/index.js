import formMixin from 'mixins/form'
import ErrorCode from '@/config/errorCode'

var that
export default {
  mixins: [formMixin],
  data () {
    let model = {
      // 默认开启
      is_download_validate: 0,
      validate_mobile: '',
      id: 0,
      captcha: ''
    }
    let that = this
    let rules = {
      'validate_mobile': [{
        validator: (rule, val, callback) => {
          if (!val) {
            callback(new Error('请输入验证手机号'))
          }
          if (val.length > 20) {
            callback(new Error('已超过可输入长度'))
          }
          that.$http.fetch(that.$api.core.downloadConfig.validateMobile, {mobile: that.model.validate_mobile}).then((resp) => {
            if (resp.code === ErrorCode.MOBILE_ILLEGAL) {
              callback(new Error('手机号码不合法'))
            }
            callback()
          }).catch(() => {
            callback(new Error('远程校验失败'))
          })
        },
        trigger: 'blur'
      }],
      captcha: [{
        required: true,
        message: '请输入验证码',
        trigger: 'blur'
      }, {
        pattern: /^[0-9]*$/,
        message: '请输入6位数字',
        trigger: ['blur']
      }]
    }
    return {
      model: model,
      rules: rules,
      originalModel: {},
      visible: false,
      captchaDisabled: false,
      getCaptChaStr: '获取验证码',
      countDown: 59,
      interval: {},
      saveBtnLoading: false
    }
  },
  created: function () {
    that = this
    that.getDownLoadConfig()
  },
  methods: {
    /**
     * 保存表单
     */
    onSave: function () {
      that.validAndSubmit({
        loading: 'saveBtnLoading',
        api: that.$api.core.downloadConfig.saveOrUpdate,
        params: {
          mobile: that.model.validate_mobile,
          captcha: that.model.captcha,
          id: that.model.id
        },
        success: function (resp) {
          if (resp.code === ErrorCode.CAPTCHA_ERROR) {
            that.$notify.error('验证码不正确')
          } else {
            that.onClose()
            that.$notify.success(resp.msg)
            that.$set(that, 'originalModel', JSON.parse(JSON.stringify(that.model)))
          }
        },
        error: function () {
          that.$notify.error('修改失败')
        }
      })
    },
    /**
     * 保存并验证
     */
    onValidate: function () {
      if (this.originalModel.validate_mobile === this.model.validate_mobile &&
        this.originalModel.is_download_validate === this.model.is_download_validate) {
        this.$notify.info('未作出任何修改')
      } else {
        // 判断下载验证是否关闭
        that.$refs.firstForm.validate(valid => {
          if (valid) {
            that.visible = true
          }
        })
      }
    },
    /**
     * 关闭弹窗
     */
    onClose: function () {
      this.visible = false
      this.captchaDisabled = false
      this.model.captcha = ''
      this.$refs.form.resetFields()
      // this.captchaDisabled = false
      // this.countDown = 0
      // this.setCaptchaText()
    },
    /**
     * 发送短信验证码
     */
    onSendCaptcha: function () {
      let params = {
        mobile: that.model.validate_mobile
      }
      that.$http.fetch(that.$api.core.downloadConfig.sendCaptcha, params).then((resp) => {
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
      // 倒计时
      if (that.countDown === 0) {
        that.getCaptChaStr = '获取验证码'
        that.countDown = 59
        that.captchaDisabled = false
      } else {
        that.getCaptChaStr = '重新发送(' + that.countDown + ')'
        that.countDown--
      }
    },
    /**
     * 获取当前品牌的下载配置
     */
    getDownLoadConfig () {
      that.$http.fetch(that.$api.core.downloadConfig.queryDownLoadConfig).then((resp) => {
        let data = resp.result
        if (data) {
          let model = {
            is_download_validate: data.state ? 1 : 0,
            validate_mobile: data.mobile ? data.mobile : '',
            id: data.id,
            captcha: ''
          }
          that.setModel(model)
        }
        that.$nextTick(() => {
          that.$set(that, 'originalModel', JSON.parse(JSON.stringify(that.model)))
        })
      })
    },
    resetSendCaptchaBtn: function () {
      this.captchaDisabled = false
      this.countDown = 0
      this.setCaptchaText()
    }
  },
  watch: {
    captchaDisabled: function (val) {
      if (!val) {
        clearInterval(this.interval)
      }
    },
    'model.validate_mobile': function (val) {
      this.resetSendCaptchaBtn()
    }
  }
}
