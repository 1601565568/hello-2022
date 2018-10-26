import formMixin from 'mixins/form'
import CareType from 'configs/careType'
import moment from 'moment'
import dataCheck from 'utils/dataCheck'

const SMS = 'sms'
const WECHAT = 'weChat'
const EMAIL = 'email'
export default {
  mixins: [formMixin],
  data () {
    let model = {
      id: 0,
      ruleStatus: 0,
      // 是否排除黑名单
      isExcludeBlack: 0,
      // 是否排除未激活
      isExcludeNoActive: 0,
      // 交易积分 1元兑换多少
      integralPrice: 1.00,
      // 积分价值
      integralValue: 1.00,
      // 积分取整
      integralRound: 0,
      // 交易状态满足之后几天发送
      tradeStatusDay: '',
      // 积分上限
      integralLimit: '',
      // 0相对时间 1绝对时间
      effectiveType: 0,
      // 有效时长（单位：天）
      effectiveLength: '',
      // 绝对年数（0：表示当年，1：表示明年，2：表示后年），最小值为0
      yearNum: 0,
      // 绝对月日：格式（月-日：06-03）
      monthDay: '',
      // 是否包含商品（1：包含，0：排除）
      isIncludeItem: 0,
      itemConditionJson: [],
      // 是否包含店铺（1：包含，0：排除）
      isIncludeShop: 0,
      shopIds: [],
      // 交易状态 交易成功
      tradeStatus: 'TRADE_FINISHED',
      // 短信签名
      smsSign: '',
      careWays: [],
      // 短信
      smsContent: '',
      smsSignature: '',
      smsTemplateId: '',
      // 邮件
      emailTemplateId: '',
      emailContent: '',
      // 微信
      weChatContent: '',
      weChatRemark: '',
      weChatLink: '',
      weChatTemplateId: '',
      // 调度方式
      isAllSchedule: 1,
      // 调度顺序
      scheduleOrder: '',
      weChatTemplateCode: ''
    }
    let that = this
    let rules = {
      'integralValue': [{
        required: true,
        message: '请输入积分赠送规则',
        trigger: ['blur', 'change']
      }, {
        validator: (rule, val, call) => {
          that.checkDecimalField(val, call)
        },
        trigger: ['blur', 'change']
      }],
      integralLimit: [{
        required: true,
        message: '请输入积分赠送上限',
        trigger: ['blur', 'change']
      },
      {
        validator: (rule, val, call) => {
          that.checkDecimalField(val, call)
        },
        trigger: ['blur', 'change']
      }],
      tradeStatusDay: [{
        required: true,
        message: '请输入积分生效日期',
        trigger: ['blur', 'change']
      }, {
        validator: (rule, val, call) => {
          that.checkNumberField(val, call)
        },
        trigger: ['blur', 'change']
      }],
      effectiveLength: [{
        validator: (rule, val, call) => {
          if (that.model.effectiveType === 0) {
            if (!val) {
              call(new Error('请输入天数'))
            }
            that.checkNumberField(val, call)
          }
          call()
        },
        trigger: ['blur', 'change']
      }],
      monthDay: [{
        validator: (rule, val, call) => {
          if (that.model.effectiveType === 1) {
            if (!val) {
              call(new Error('请选择日期'))
            }
          }
          call()
        },
        trigger: ['change']
      }],
      careContentJson: [{
        validator: (rule, val, call) => {
          let hasSms = that.model.careWays.indexOf(SMS) > -1
          if (hasSms && (!that.model.smsContent || !that.model.smsSignature)) {
            call(new Error('短信内容及签名必须填写'))
          }
          let hasWeChat = that.model.careWays.indexOf(WECHAT) > -1
          if (hasWeChat && !that.model.weChatTemplateId) {
            call(new Error('请选择微信模板'))
          }
          let hasEmail = that.model.careWays.indexOf(EMAIL) > -1
          if (hasEmail && (!that.model.emailContent || !that.model.emailTemplateId)) {
            call(new Error('请选择邮件模板且邮件内容不能为空'))
          }
          call()
        },
        trigger: 'blur'
      }],
      smsSignature: [{
        validator: (rule, val, call) => {
          if (that.model.careWays.indexOf(SMS) > -1) {
            if (!val) {
              call(new Error('请选择短信签名'))
            }
          }
          call()
        },
        trigger: 'change'
      }],
      smsContent: [
        {
          validator: (rule, val, call) => {
            if (that.model.careWays.indexOf(SMS) > -1) {
              if (!val) {
                call(new Error('请输入短信内容'))
              }
              if (that.model.smsSignature.length + that.$refs.smsTemplate.wordCount > 500) {
                call(new Error('已超过可输入长度，请重新输入'))
              }
            }
            call()
          },
          trigger: ['change', 'blur']
        }],
      weChatTemplateId: [{
        validator: (rule, val, call) => {
          if (that.model.careWays.indexOf(WECHAT) > -1) {
            if (!val) {
              call(new Error('请选择微信模板'))
            }
          }
          call()
        },
        trigger: 'change'
      }],
      // weChatContent: [{
      //   validator: (rule, val, call) => {
      //     if (that.model.careWays.indexOf(WECHAT) > -1) {
      //       if (!val) {
      //         call(new Error('请输入微信内容'))
      //       }
      //     }
      //     call()
      //   },
      //   trigger: ['blur']
      // }],
      emailTemplateId: [{
        validator: (rule, val, call) => {
          if (that.model.careWays.indexOf(EMAIL) > -1) {
            if (!val) {
              call(new Error('请选择邮件模板'))
            }
          }
          call()
        },
        trigger: 'change'
      }],
      emailContent: [
        {
          validator: (rule, val, call) => {
            if (that.model.careWays.indexOf(EMAIL) > -1) {
              if (!val) {
                call(new Error('请输入邮件内容'))
              }
            }
            call()
          },
          trigger: ['blur', 'change']
        }],
      weChatLink: [{
        type: 'url',
        message: '请输入正确的链接',
        trigger: ['blur']
      }]
    }
    return {
      saveBtnLoading: false,
      pickerOptions: {
        disabledDate: function (time) {
          let disabled = false
          if (that.model.yearNum === 0) {
            disabled = time.getTime() <= moment().toDate().getTime()
          }
          return disabled
        }
      },
      model: model,
      rules: rules,
      loading: false,
      // 短信占位符
      tags: [],
      integralRound: [
        {
          label: '向上取整',
          value: 0
        },
        {
          label: '向下取整',
          value: 1
        },
        {
          label: '四舍五入',
          value: 2
        },
        {
          label: '保留两位小数',
          value: 3
        }],
      careWayBtnList: [{
        label: '短信',
        value: SMS
      }, {
        label: '微信',
        value: WECHAT
      }, {
        label: '邮件',
        value: EMAIL
      }],
      careWayNameStr: '',
      currCareWay: '',
      // 签名
      signatureData: [],
      // 短信模板
      smsTemplateData: [],
      // 邮件模板
      emailTemplateData: [],
      // 微信模板
      weChatTemplateData: [],
      // 微信公众号
      weChatAccountData: [],
      // 当前公众号下的微信模板数据
      currWeChatTemplateData: [],
      // 当前选择的模板详情
      weChatTempContent: {},
      currEmailTemplate: {},
      // 短信占位符数据
      smsPlaceholderData: [],
      dispatchData: [],
      // 富文本框配置
      ueditorConfig: {
        // 你的UEditor资源存放的路径，相对于打包后的index.html
        UEDITOR_HOME_URL: '/static/UEditor/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: '250',
        // 初始容器宽度
        initialFrameWidth: '520',
        serverUrl: '',
        nodeType: '',
        wordCountMsg: '当前已输入 {#count} 个字符'
      }
    }
  },
  created: function () {
    this.querySmsPlaceholder()
    this.getIntegralRule()
    this.getSmsTemplateList()
    this.getWxTemplateList(CareType.INTEGRAL_NOTIFY)
    this.getEmailTemplateList()
  },
  mounted () {
    this.$nextTick(() => {
      let limitHeight = window.innerHeight - 98
      this.$refs.integralRuleHeight.$el.children[0].style.maxHeight = limitHeight + 'px'
    })
  },
  watch: {
    'model.monthDay': function (val, oldVal) {
      if (val) {
        this.model.monthDay = moment(val).format('MM-DD')
      } else {
        this.model.monthDay = ''
      }
    },
    'model.effectiveType': function (val) {
      if (val === 0) {
        this.$refs.form.validateField('monthDay')
      } else if (val === 1) {
        this.$refs.form.validateField('effectiveLength')
      }
    },
    'model.isOpenSms': function (val) {
      if (val === 0) {
        this.$refs.form.validateField('smsSign')
        this.$refs.form.validateField('smsContent')
      }
    },
    'model.ruleStatus': function (val) {
      if (val === 0) {
        this.$refs.form.clearValidate()
      }
    },
    'model.emailContent': function (val) {
      this.$refs.form.validateField('emailContent')
    }
  },
  methods: {
    /**
     * 保存表单数据
     */
    onSave: function () {
      let vue = this
      this.validAndSubmit({
        loading: 'saveBtnLoading',
        api: vue.$api.integral.integralRule.saveOrUpdate,
        handleParams: vue.handleSubmitParams,
        success: function (resp) {
          vue.model.id = resp.result.id
          vue.$notify.success(resp.msg)
        },
        error: function () {
          vue.$notify.error('保存失败')
        }
      })
    },
    /**
     * 获取等级规则
     */
    getIntegralRule: function () {
      let that = this
      that.loading = true
      that.$http.fetch(that.$api.integral.integralRule.queryIntegralRule).then(resp => {
        if (resp.result) {
          let model = that.handleEchoData(resp.result)
          that.$set(that, 'model', model)
          // 设置内容
          that.$set(that.model, 'smsContent', model.smsContent)
          // 设置邮件模板内容，
          that.$set(that.model, 'emailContent', model.emailContent)
          that.$set(that.model, 'weChatContent', model.weChatContent)
          that.$set(that.model, 'weChatLink', model.weChatLink)
          that.$set(that.model, 'weChatRemark', model.weChatRemark)
          that.setSchedulerOrder(model.scheduleOrder)
        }
      }).catch(() => {
        that.$notify.error('查询数据失败')
      }).finally(() => {
        that.loading = false
        that.currCareWay = that.model.careWays[0] ? that.model.careWays[0] : ''
      })
    },
    /**
     * 查询短信占位符
     */
    querySmsPlaceholder: function () {
      let that = this
      this.$http.fetch(this.$api.core.common.querySmsPlaceholder, {type: CareType.INTEGRAL_NOTIFY}).then((resp) => {
        that.tags = resp.result ? resp.result : []
      })
    },
    /**
     * 处理提交参数
     * @param params
     */
    handleSubmitParams (params) {
      params.itemConditionJson = JSON.stringify(params.itemConditionJson)
      let data = Object.assign(params, this.handleNotifyWaySubmit(params))
      data.effectiveLength = params.effectiveLength ? params.effectiveLength : 0
      // 数据转换
      data = this.transObjProp2Underline(data)
      return data
    },
    /**
     * 处理通知
     * @param carePattern
     * @param data
     * @param params
     * @returns {*}
     */
    handleNotifyWaySubmit (params) {
      let tradeNotifyJson = {}
      let scheduleJson = {
        scheduleOrder: params.scheduleOrder,
        isAll: params.isAllSchedule,
        careWayNameStr: this.careWayNameStr
      }
      // 关怀方式调度
      if (params.isAllSchedule === 1) {
        scheduleJson.scheduleOrder = params.careWays.join('-')
      }
      tradeNotifyJson.hasSmsNotify = params.careWays.indexOf(SMS) > -1
      tradeNotifyJson.hasWeChatNotify = params.careWays.indexOf(WECHAT) > -1
      tradeNotifyJson.hasEmailNotify = params.careWays.indexOf(EMAIL) > -1
      if (tradeNotifyJson.hasEmailNotify) {
        tradeNotifyJson.emailTempName = this.currEmailTemplate.label
        tradeNotifyJson.emailContent = params.emailContent
        let emailTemplate = JSON.parse(this.currEmailTemplate.remark)
        tradeNotifyJson.emailHeaderContent = emailTemplate.CustomDefinitionText
        tradeNotifyJson.emailTemplateType = emailTemplate.TemplateType
        tradeNotifyJson.emailItems = emailTemplate.itemIds
      }
      if (tradeNotifyJson.hasWeChatNotify) {
        tradeNotifyJson.weChatTempContent = this.weChatTempContent
        tradeNotifyJson.weChatTemplateCode = params.weChatTemplateCode
        tradeNotifyJson.weChatContent = params.weChatContent
        tradeNotifyJson.weChatLink = params.weChatLink
        tradeNotifyJson.weChatRemark = params.weChatRemark
        tradeNotifyJson.weChatTemplateId = params.weChatTemplateId
      }
      if (tradeNotifyJson.hasSmsNotify) {
        tradeNotifyJson.smsContent = params.smsContent
        tradeNotifyJson.smsTemplateId = params.smsTemplateId
        tradeNotifyJson.smsSignature = params.smsSignature
      }
      let data = {}
      data.tradeNotifyJson = JSON.stringify(tradeNotifyJson)
      data.shopIds = params.shopIds.length > 0 ? JSON.stringify(params.shopIds) : ''
      data.scheduleJson = JSON.stringify(scheduleJson)
      return data
    },
    /**
     * 处理通知方式数据回显
     */
    handleNotifyWayEcho (data) {
      let model = {}
      // 关怀内容
      let tradeNotifyJson = JSON.parse(data.tradeNotifyJson)
      model.smsContent = tradeNotifyJson.smsContent ? tradeNotifyJson.smsContent : ''
      model.smsTemplateId = tradeNotifyJson.smsTemplateId ? tradeNotifyJson.smsTemplateId : ''
      model.smsSignature = tradeNotifyJson.smsSignature ? tradeNotifyJson.smsSignature : ''
      model.weChatContent = tradeNotifyJson.weChatContent ? tradeNotifyJson.weChatContent : ''
      model.weChatLink = tradeNotifyJson.weChatLink ? tradeNotifyJson.weChatLink : ''
      model.weChatRemark = tradeNotifyJson.weChatRemark ? tradeNotifyJson.weChatRemark : ''
      model.weChatTemplateCode = tradeNotifyJson.weChatTemplateCode ? tradeNotifyJson.weChatTemplateCode : ''
      if (tradeNotifyJson.weChatTemplateId) {
        model.weChatTemplateId = tradeNotifyJson.weChatTemplateId
        this.onChangeWeChatTemplate(model.weChatTemplateId)
      } else {
        model.weChatTemplateId = ''
      }
      if (tradeNotifyJson.emailTemplateId) {
        model.emailTemplateId = tradeNotifyJson.emailTemplateId
        this.onChangeEmailTemplate(model.emailTemplateId)
      } else {
        model.emailTemplateId = ''
      }
      model.emailContent = tradeNotifyJson.emailContent ? tradeNotifyJson.emailContent : ''
      // 关怀方式调度
      let scheduleJson = JSON.parse(data.scheduleJson)
      model.isAllSchedule = scheduleJson.isAll
      // 判断是否关怀方式全部调度
      if (model.isAllSchedule === 1) {
        model.careWays = [SMS, WECHAT, EMAIL]
      }
      // 关怀方式
      let careWays = []
      if (tradeNotifyJson.hasSmsNotify) {
        careWays.push(SMS)
      }
      if (tradeNotifyJson.hasWeChatNotify) {
        careWays.push(WECHAT)
      }
      if (tradeNotifyJson.hasEmailNotify) {
        careWays.push(EMAIL)
      }
      model.careWays = careWays
      this.onCareWaysChange(careWays)
      model.scheduleOrder = scheduleJson.scheduleOrder
      model.shopIds = data.shopIds ? JSON.parse(data.shopIds) : []
      return model
    },
    /**
     * 处理回显数据
     * @param data
     */
    handleEchoData (data) {
      // 数据转换
      let model = this.transObjProp2CamelCase(data)
      model = Object.assign(model, this.handleNotifyWayEcho(model))
      model.itemConditionJson = JSON.parse(model.itemConditionJson)
      model.effectiveLength = data.effectiveLength === 0 ? '' : data.effectiveLength
      delete model.createTime
      delete model.updateTime
      return model
    },
    checkNumberField: function (val, call) {
      if (!dataCheck.isNumber(val) || parseInt(val) <= 0) {
        call(new Error('请输入正整数'))
      }
      if (val.length > 10) {
        call(new Error('已超过可输入长度，请重新输入'))
      }
      call()
    },
    checkDecimalField: function (val, call) {
      if (!dataCheck.isDecimal(val) || parseFloat(val) <= 0) {
        call(new Error('请输入正数（两位小数）'))
      }
      if (val.length > 10) {
        call(new Error('已超过可输入长度，请重新输入'))
      }
      call()
    },
    /**
     * 获取微信模板列表
     */
    getWxTemplateList (careType) {
      let that = this
      that.$http.fetch(that.$api.core.common.getWxTemplateList,
        {careType: careType}).then((resp) => {
          that.weChatTemplateData = resp.result ? resp.result : []
        })
    },
    /**
     * 获取短信模板
     */
    getSmsTemplateList () {
      let that = this
      that.$http.fetch(that.$api.core.common.getMarketingTemplateOptions,
        {
          marketingManner: 0,
          type: 13
        }).then((resp) => {
          that.smsTemplateData = resp.result ? resp.result : []
        })
    },
    /**
     * 获取邮件模板
     */
    getEmailTemplateList () {
      let that = this
      that.$http.fetch(that.$api.core.common.getMarketingTemplateOptions,
        {
          marketingManner: 1,
          type: 13
        }).then((resp) => {
          that.emailTemplateData = resp.result ? resp.result : []
        })
    },
    /**
     * 选中关怀方式
     */
    onCheckCareWay: function (checked, val) {
      if (!checked && this.currCareWay === val) {
        this.currCareWay = this.model.careWays[0]
      } else if (checked && this.currCareWay !== val) {
        this.currCareWay = val
      }
    },
    /**
     * 鼠标移动到关怀方式
     * @param value
     */
    onMouseMoveCareWay: function (value) {
      if (this.model.careWays.indexOf(value) > -1) {
        this.currCareWay = value
      }
    },
    /**
     * 短信模板选中改变时触发
     * @param val
     */
    onChangeSmsTemplate: function (val) {
      if (val) {
        this.model.smsContent = this.smsTemplateData.find(x => {
          return x.value === val
        }).remark
      }
    },
    /**
     * 邮件模板选中改变时触发
     * @param val
     */
    onChangeEmailTemplate: function (val) {
      if (val) {
        // 获取邮件模板
        let template = this.emailTemplateData.find(x => {
          return x.value === val
        })
        if (template) {
          this.currEmailTemplate = template
          let templateJson = JSON.parse(template.remark)
          if (templateJson.hasOwnProperty('CustomDefinition')) {
            // 邮件模板内容
            this.model.emailContent = templateJson.CustomDefinition
          }
        }
      }
    },
    /**
     * 微信模板改变时触发
     * @param val
     */
    onChangeWeChatTemplate: function (val) {
      if (val) {
        this.weChatTemplateData.forEach(item => {
          if (item.value === val) {
            this.weChatTempContent = JSON.parse(item.templateContent)
            this.model.weChatContent = this.weChatTempContent.detailContent
            this.model.weChatRemark = this.weChatTempContent.remark
            this.model.weChatLink = this.weChatTempContent.detailLink
            this.model.weChatTemplateCode = item.templateCode
            /* eslint-disable */
            return
          }
        })
      }
    },
    /**
     * 获取当前格式化的时间
     */
    getCurrDateFormat () {
      let date = new Date()
      let currMonth = date.getMonth() + 1
      let currDate = date.getDate()
      return (currMonth > 9 ? currMonth : '0' + currMonth) + '月' + (currDate > 9 ? currDate : '0' + currDate) + '号'
    },
    /**
     * 关怀方式改变
     * @param val
     */
    onCareWaysChange: function (val) {
      let careWayData = []
      let careWayNames = []
      // 获取已选择关怀方式数组对象
      for (let value in val) {
        for (let index in this.careWayBtnList) {
          if (val[value] === this.careWayBtnList[index].value) {
            careWayData.push(this.careWayBtnList[index])
            careWayNames.push(this.careWayBtnList[index].label)
            break
          }
        }
      }
      this.careWayNameStr = careWayNames.join('，')
      this.dispatchData = this.setDispatchData(careWayData)
    },
    /**
     * 设置调度顺序
     */
    setSchedulerOrder (val) {
      this.$nextTick(() => {
        // 设置当前选择的发送顺序
        this.$set(this.model, 'scheduleOrder', val)
      })
    },
    /**
     * 设置调度下拉列表数据
     * @param careWayData
     * @returns {Array}
     */
    setDispatchData (careWayData) {
      let dispatchData = []
      // 组合排列关怀方式
      careWayData.forEach(data1 => {
        let dispatchLabel = [data1.label]
        let dispatchValue = [data1.value]
        careWayData.forEach(data2 => {
          if (data1.value !== data2.value) {
            dispatchLabel.push(data2.label)
            dispatchValue.push(data2.value)
          }
        })
        dispatchData.push({
          label: dispatchLabel.join('-'),
          value: dispatchValue.join('-')
        })
      })
      this.setSchedulerOrder(dispatchData[0] ? dispatchData[0].value : '')
      return dispatchData;
    }
  }
}
