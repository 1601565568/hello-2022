import formMixin from 'mixins/form'
import ErrorCode from '@/config/errorCode'
import dataCheck from 'utils/dataCheck'
export default {
  mixins: [formMixin],
  data: function () {
    let model = {
      id: 0,
      marketing_sms_limit: '',
      marketing_email_limit: '',
      marketing_wechat_limit: '',
      touch_sms_limit: '',
      touch_email_limit: '',
      touch_wechat_limit: '',
      email_send_name: '',
      email_send_address: '',
      marketing_attach_phone: '',
      marketing_attach_email: ''
    }
    let that = this
    let rules = {
      marketing_sms_limit: [{
        required: true,
        message: '请输入营销触达短信发送限制条数',
        trigger: ['blur', 'change']
      }, {
        validator: (rule, val, call) => {
          that.checkInt(val, call)
        },
        trigger: ['blur', 'change']
      }],
      marketing_email_limit: [{
        required: true,
        message: '请输入营销触达邮件发送限制条数',
        trigger: ['blur', 'change']
      }, {
        validator: (rule, val, call) => {
          that.checkInt(val, call)
        },
        trigger: ['blur', 'change']
      }],
      marketing_wechat_limit: [{
        required: true,
        message: '请输入营销触达微信发送限制条数',
        trigger: ['blur', 'change']
      }, {
        validator: (rule, val, call) => {
          that.checkInt(val, call)
        },
        trigger: ['blur', 'change']
      }],
      touch_sms_limit: [{
        required: true,
        message: '请输入关怀触达短信发送限制条数',
        trigger: ['blur', 'change']
      }, {
        validator: (rule, val, call) => {
          that.checkInt(val, call)
        },
        trigger: ['blur', 'change']
      }],
      touch_email_limit: [{
        required: true,
        message: '请输入关怀触达邮件发送限制条数',
        trigger: ['blur', 'change']
      }, {
        validator: (rule, val, call) => {
          that.checkInt(val, call)
        },
        trigger: ['blur', 'change']
      }],
      touch_wechat_limit: [{
        required: true,
        message: '请输入关怀触达微信发送限制条数',
        trigger: ['blur', 'change']
      }, {
        validator: (rule, val, call) => {
          that.checkInt(val, call)
        },
        trigger: ['blur', 'change']
      }],
      email_send_name: [{
        required: true,
        message: '请输入发件人名称,限4-50个字',
        trigger: ['blur', 'change']
      }, {
        min: 4,
        max: 50,
        message: '限4-50个字',
        trigger: ['blur', 'change']
      }],
      email_send_address: [{
        required: true,
        message: '请输入发件人邮箱地址',
        trigger: ['blur', 'change']
      }, {
        type: 'email',
        message: '邮箱地址格式不正确',
        trigger: ['blur', 'change']
      }, {
        min: 0,
        max: 100,
        message: '已超过可输入长度,限100',
        trigger: ['blur', 'change']
      }],
      marketing_attach_phone: [{
        min: 0,
        max: 4000,
        message: '已超过可输入长度',
        trigger: ['blur', 'change']
      }, {
        validator: (rule, val, callback) => {
          if (val != null) {
            let that = this
            var smsNumber = val.split(',')
            var result = []
            for (var i = 0; i < smsNumber.length; i++) {
              smsNumber[i] = smsNumber[i].replace(/\s/ig, '')// 去掉所有字符串中空格
              if (smsNumber[i] !== '' && smsNumber[i].match('^((13[0-9]|15[012356789]|18[012346789]|14[57]|17[678]|170[059]|14[57]|166|19[89]))\\d{8}$')) {
                if (that.inArray(smsNumber[i], result)) {
                // callback(new Error(smsNumber[i] + '出现重复'))
                  callback(new Error('手机号码出现重复'))
                } else {
                  result.push(smsNumber[i])
                }
              }
              if (smsNumber[i] !== '' && !smsNumber[i].match('^((13[0-9]|15[012356789]|18[012346789]|14[57]|17[678]|170[059]|14[57]|166|19[89]))\\d{8}$')) {
              // callback(new Error(smsNumber[i] + '手机号码格式错误'))
                callback(new Error('手机号码格式错误'))
              }
              if (result.length > 300) {
                callback(new Error('最多300个手机号'))
              }
            }
          }
          callback()
        }
      }],
      marketing_attach_email: [{
        min: 0,
        max: 2000,
        message: '已超过可输入长度',
        trigger: ['blur', 'change']
      }, {
        validator: function (rule, val, callback) {
          if (val != null) {
            var emails = val.replace(',,', ',')
            var emailsArray = emails.split(',')
            var result = []
            for (var i = 0; i < emailsArray.length; i++) {
              emailsArray[i] = emailsArray[i].replace(/\s/ig, '')// 去掉所有字符串中空格
              // 下面那行match中的内容为正则表达式，用于验证邮箱
              if (emailsArray[i] !== '' && emailsArray[i].match(/^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/)) {
                if (that.inArray(emailsArray[i], result)) {
                  callback(new Error('邮箱地址出现重复'))
                } else {
                  if (emailsArray[i].length > 320) {
                    callback(new Error('单个邮箱地址超过320个字符，请核实'))
                  } else {
                    result.push(emailsArray[i])
                  }
                }
              }
              if (emailsArray[i] !== '' && !emailsArray[i].match(/^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/)) {
                callback(new Error('邮箱地址格式不正确'))
              }
            }
            if (result.length > 100) {
              callback(new Error('最多100个邮箱'))
            }
          }
          callback()
        },
        trigger: ['blur']
      }]
    }
    return {
      model: model,
      rules: rules,
      loading: false
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
    checkInt: function (val, call) {
      if (!dataCheck.isNumber(val)) {
        call(new Error('格式不正确，请输入正整数'))
      }
      if (val > 9999999999) {
        call(new Error('已超过可输入长度，请重新输入'))
      }
      call()
    },
    onSave: function () {
      let that = this
      that.validAndSubmit({
        api: that.$api.touch.touchManage.saveOrUpdate,
        success: function (resp) {
          that.$notify.success(resp.msg)
          that.$refs.table.$reload()
          that.visible = false
        },
        error: function () {
        }
      })
    },
    initForm: function () {
      let that = this
      that.loading = true
      that.$http.fetch(that.$api.touch.touchManage.getTouchManageInfo).then(resp => {
        if (resp.code !== ErrorCode.DATA_NO_EXIST) {
          that.model.id = resp.result.id
          that.model.marketing_sms_limit = resp.result.marketing_sms_limit
          that.model.marketing_email_limit = resp.result.marketing_email_limit
          that.model.marketing_wechat_limit = resp.result.marketing_wechat_limit
          that.model.touch_sms_limit = resp.result.touch_sms_limit
          that.model.touch_email_limit = resp.result.touch_email_limit
          that.model.touch_wechat_limit = resp.result.touch_wechat_limit
          that.model.email_send_name = resp.result.email_send_name
          that.model.email_send_address = resp.result.email_send_address
          that.model.marketing_attach_phone = resp.result.marketing_attach_phone
          that.model.marketing_attach_email = resp.result.marketing_attach_email
        }
      }).catch(() => {
        that.$notify.error('查询数据失败')
      }).finally(() => {
        that.loading = false
      })
    }
  },
  created: function () {
    this.initForm()
  }
}
