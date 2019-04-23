import formMixin from 'mixins/form'
import ErrorCode from '@/config/errorCode'
export default {
  mixins: [formMixin],
  data: function () {
    return {
      smsVisible: false,
      title: '',
      saveType: '',
      typeOptions: [],
      model: {
        template: '',
        template_title: '',
        template_type: 0
      },
      rules: {
        template: [{
          required: true,
          message: '请输入短信内容',
          trigger: ['blur', 'change']
        }, {
          min: 0,
          max: 500,
          message: '最多500个字',
          trigger: ['blur', 'change']
        }],
        template_title: [{
          required: true,
          message: '请输入模板标题，限制2-30字',
          trigger: ['blur', 'change']
        }, {
          min: 2,
          max: 30,
          message: '限2-30个字',
          trigger: ['blur', 'change']
        }, {
          validator: (rule, value, callback) => {
            if (this.model.template_type !== '') {
              var that = this
              var id = 0
              if (typeof (that.model.id) !== 'undefined') {
                id = that.model.id
              }
              this.$http.fetch(that.$api.touch.smsTemplate.hasTitleExist, {templateTitle: that.model.template_title, templateType: that.model.template_type, id: id
              }).then((resp) => {
                if (resp.code === ErrorCode.TITLE_REPEAT) {
                  callback(new Error('此模板已存在，请重新输入'))
                } else {
                  callback()
                }
              }).catch(() => {
                callback(new Error('远程校验失败'))
              })
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        template_type: [{
          required: true,
          message: '请选择模板类型',
          trigger: ['blur', 'change']
        },
        {
          validator: (rule, value, callback) => {
            if (this.model.template_title !== '') {
              var that = this
              var id = 0
              if (typeof (that.model.id) !== 'undefined') {
                id = that.model.id
              }
              this.$http.fetch(that.$api.touch.smsTemplate.hasTitleExist, {templateTitle: that.model.template_title, templateType: that.model.template_type, id: id
              }).then((resp) => {
                if (resp.code === ErrorCode.TITLE_REPEAT) {
                  callback(new Error('此模板已存在，请重新输入'))
                } else {
                  callback()
                }
              }).catch(() => {
                callback(new Error('远程校验失败'))
              })
            } else {
              callback()
            }
          },
          trigger: ['blur', 'change']
        }]
      },
      state: {tplTags: []}
    }
  },
  watch: {
    'model.template_type': function (value) {
      switch (value.toString()) {
        // 通用
        case '0':
          this.state.tplTags = []
          break
        // 营销模板
        case '1':
          this.state.tplTags = [{key: '{Name}', text: '姓名'}, {key: '{Nick}', text: '昵称'}]
          break
        // 下单关怀模板
        case '2':
          this.state.tplTags = [{key: '{Name}', text: '姓名'}, {key: '{Nick}', text: '昵称'}, {key: '{TradeId}', text: '订单编号'}]
          break
        // 催付模板
        case '3':
          this.state.tplTags = [{key: '{Nick}', text: '昵称'}, {key: '{Name}', text: '姓名'}, {key: '{TradeId}', text: '订单编号'},
            {key: '{Created}', text: '下单时间'}, {key: '{Payment}', text: '待付金额'}, {key: '{UrgeLink}', text: '付款链接'}]
          break
        // 付款关怀模板
        case '4':
          this.state.tplTags = [{key: '{Nick}', text: '昵称'}, {key: '{Name}', text: '姓名'}, {key: '{TradeId}', text: '订单编号'}, {key: '{Payment}', text: '付款金额'}]
          break
        // 发货提醒模板
        case '5':
          this.state.tplTags = [{key: '{Nick}', text: '昵称'}, {key: '{Name}', text: '姓名'}, {key: '{MemberGrade}', text: '会员等级'},
            {key: '{TradeId}', text: '订单编号'}, {key: '{CompanyName}', text: '物流公司'}, {key: '{OutSid}', text: '运单号'},
            {key: '{ConsignTime}', text: '发货时间'}, {key: '{LogisticTrack}', text: '物流查询'}]
          break
        // 物流跟踪模板
        case '6':
          this.state.tplTags = [{key: '{Nick}', text: '昵称'}, {key: '{Name}', text: '姓名'}, {key: '{TradeId}', text: '订单编号'}, {key: '{CompanyName}', text: '物流公司'},
            {key: '{OutSid}', text: '运单号'}, {key: '{Created}', text: '下单时间'}, {key: '{ConsignTime}', text: '发货时间'}]
          break
        // 签收关怀模板
        case '7':
          this.state.tplTags = [{key: '{Nick}', text: '昵称'}, {key: '{Name}', text: '姓名'}, {
            key: '{MemberGrade}',
            text: '会员等级'
          }, {key: '{TradeId}', text: '订单编号'}, {key: '{CompanyName}', text: '物流公司'}, {
            key: '{OutSid}',
            text: '运单号'
          }, {key: '{ReceiveTime}', text: '签收时间'}]
          break
        // 确认关怀模板
        case '8':
          this.state.tplTags = [{key: '{Nick}', text: '昵称'}, {key: '{Name}', text: '姓名'}, {key: '{TradeId}', text: '订单编号'},
            {key: '{Payment}', text: '付款金额'}, {key: '{EndTime}', text: '确认收货时间'}]
          break
        // 回评模板
        case '9':
          this.state.tplTags = [{key: '{Name}', text: '姓名'}, {key: '{AffairId}', text: '工单编号'}, {
            key: '{CommentTime}',
            text: '评价时间'
          }]
          break
        // 退款关怀模板
        case '10':
          this.state.tplTags = [{key: '{Nick}', text: '昵称'}, {key: '{Name}', text: '姓名'}, {
            key: '{TradeId}',
            text: '订单编号'
          }, {key: '{RefundFee}', text: '退款金额'}, {key: '{RefundTime}', text: '退款时间'}]
          break
        // 中差评订单模板
        case '11':
          this.state.tplTags = []
          // this.state.tplTags = [{key: '{Nick}', text: '昵称'}, {key: '{Name}', text: '姓名'}, {key: '{NewGrade}', text: '新会员等级'}, {key: '{OldGrade}', text: '老会员等级'}, {key: '{UpgradeTime}', text: '升级时间'}]
          break
        // 超时发货订单模板
        case '12':
          this.state.tplTags = []
          // this.state.tplTags = [{key: '{Nick}', text: '昵称'}, {key: '{Name}', text: '姓名'}, {key: '{TradeId}', text: '订单编号'}, {key: '{Payment}', text: '付款金额'}, {key: '{EndTime}', text: '确认收货时间'}, {key: '{IntegralChange}', text: '积分变更'}, {key: '{CurIntegral}', text: '当前积分'}]
          break
        // 积分触发模板
        case '13':
          //  {key: '{IntegralChange}', text: '积分变更'}, {key: '{CurIntegral}', text: '当前积分'}
          this.state.tplTags = [{key: '{Nick}', text: '昵称'}, {key: '{Integral}', text: '客户积分'}, {key: '{IntegralUrl}', text: '花积分链接'}]
          break
        // 升级提醒模板
        case '14':
          this.state.tplTags = [{key: '{Nick}', text: '昵称'}, {key: '{Name}', text: '姓名'}, {
            key: '{NewGrade}',
            text: '新会员等级'
          }, {key: '{OldGrade}', text: '老会员等级'}, {key: '{UpgradeTime}', text: '升级时间'}]
          break
        // 生日祝福模板
        /* case '15':
           this.state.tplTags = [{key: '{Nick}', text: '昵称'}]
           break */
        // 节日关怀模板
        /* case '16':
           this.state.tplTags = [{key: '{Nick}', text: '昵称'}, {key: '{Name}', text: '姓名'}, {key: '{TradeId}', text: '订单编号'}, {key: '{Payment}', text: '付款金额'}, {key: '{EndTime}', text: '确认收货时间'}, {key: '{IntegralChange}', text: '积分变更'}, {key: '{CurIntegral}', text: '当前积分'}]
           break */
        // 到达提醒模板
        case '17':
          this.state.tplTags = [{key: '{Nick}', text: '昵称'}, {key: '{Name}', text: '姓名'}, {key: '{TradeId}', text: '订单编号'}, {key: '{LocalTime}', text: '到达时间'}, {key: '{LocalCity}', text: '到达城市'}]
          break
        // 入会关怀
        case '18':
          this.state.tplTags = [{key: '{Name}', text: '姓名'}, {key: '{MemberCenterLink}', text: '会员中心链接'}]
          break
        // 精灵短信模板
        case '19':
          this.state.tplTags = [{key: '{Nick}', text: '昵称'}, {key: '{Name}', text: '姓名'}, {key: '{TradeId}', text: '订单编号'}, {key: '{Created}', text: '下单时间'}, {key: '{PayTime}', text: '买家付款时间'}, {
            key: '{ConsignTime}', text: '卖家发货时间'}, {key: '{ItemNum}', text: '商品购买数量'}]
          break
        default:
          this.state.tplTags = [{key: '{Nick}', text: '昵称'}]
      }
    }
  },
  methods: {
    // 新增短信模板
    addTemplate: function () {
      var that = this
      that.title = '新增短信模板'
      that.smsVisible = true
    },
    // 短信模板信息修改
    updateTemplate: function (data) {
      this.saveType = 'saveType'
      this.title = '修改短信模板'
      this.model.template = data.template
      this.model.template_title = data.template_title
      this.model.id = data.id
      this.model.template_type = data.template_type
      this.smsVisible = true
    },
    // 短信模板弹窗关闭
    onCloseDialog: function (data) {
      this.resetForm()
      this.smsVisible = false
    },
    handleClick: function (tab, event) {
      var that = this
      that.$refs.smsTemplate.$search({searchMap: {marketing_manner$EQ: 0}})
    },
    tagClick: function (val) {
      this.model.template += val
    },
    onSaveOrUpdateTemplate: function () {
      var that = this
      this.validAndSubmit({
        api: this.$api.touch.smsTemplate.saveOrUpdateTemplate,
        success: function (resp) {
          that.$notify.success(resp.msg)
          if (that.saveType === 'edit') {
            delete that.model.id
          }
          that.$refs.smsTemplate.$reload()
          that.resetForm()
          that.smsVisible = false
        },
        error: function () {
        }
      })
    }
  },
  created: function () {
  },
  mounted: function () {
    this.orgModel = Object.assign({}, this.model)
    var that = this
    this.$http.fetch(that.$api.touch.smsTemplate.queryTemplateType)
      .then((resp) => {
        that.typeOptions = resp.result
      })
  }
}
