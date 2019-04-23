import tableMixin from 'mixins/table'
import NsDatetime from '../../NsDatetime'
import $ from 'jquery'
import ErrorCode from '@/config/errorCode'
import moment from 'moment'

export default {
  name: 'NsCustomerDetail',
  mixins: [tableMixin],
  data: function () {
    return {
      url: '', // 设置url
      copyModel: {},
      detailVisible: false, // 设置显示隐藏
      sysCustomerId: '',
      visible: false,
      customerModel: {
        // 积分分页
        interactPagination: {
          enable: true,
          size: 15,
          sizeOpts: [15, 25, 50, 100],
          page: 1,
          total: 0
        },
        // 优惠券分页
        couponPagination: {
          enable: true,
          size: 15,
          sizeOpts: [15, 25, 50, 100],
          page: 1,
          total: 0
        },
        // 触达分页
        touchPagination: {
          enable: true,
          size: 15,
          sizeOpts: [15, 25, 50, 100],
          page: 1,
          total: 0
        },
        // 消费分页
        consumePagination: {
          enable: true,
          size: 15,
          sizeOpts: [15, 25, 50, 100],
          page: 1,
          total: 0
        },
        // 昵称分页
        outNickPagination: {
          enable: true,
          size: 15,
          sizeOpts: [15, 25, 50, 100],
          page: 1,
          total: 0
        },
        activeName: 'dataBase',
        dialogTitle: '客户信息',
        DetailTitle: '',
        time: [],
        userData: [
          {
            title: '总积分',
            num: 0
          }, {
            title: '可用积分',
            num: 0
          }, {
            title: '余额',
            num: 0
          }, {
            title: '优惠券',
            num: 0
          }
        ],
        customer: {
          userAttr: [], // 用户属性
          base: [], // 基础信息
          tradeAttr: [], // 交易属性
          extAttr: [], // 扩展属性
          rightList: [], // 权益黑名单
          touchList: [], // 触达黑名单
          touchBlackType: '无', // 触达黑名单填写
          rightBlackType: '无', // 触达黑名单填写
          rightVisible: false, // 是否显示权益黑名单
          touchVisible: false, // 是否显示权益黑名单
          SMSUnsubscribe: '', // 短信退订
          lastCareTime: '', // 最后关怀时间
          remark: '' // 备注
        },
        integralType: [],
        integralTable: [], // 积分表格
        integralForm: { // 积分搜素表单
          time: [],
          integralSource: '',
          integralType: ''
        },
        tradeStatus: [], // 订单状态
        consumeTable: [], // 消费表格
        consumeForm: { // 消费搜索表单
          outTradeId: '',
          tradeStatus: '',
          time: []
        },
        consumeCount: [], // 消费记录的统计
        orderDetail: { // 子订单详情
          outTradeId: '',
          payTime: '',
          created: '',
          payment: '',
          TradeStatusName: '',
          discountFee: '',
          postFee: '',
          order: []
        },
        consumeButton: [{ // 消费表格按钮
          'func': function (obj) {
            var that = this
            var orderDetail = that.customerModel.orderDetail
            that.customerModel.DetailTitle = '订单详情'
            orderDetail.created = obj.row.created
            orderDetail.TradeStatusName = obj.row.TradeStatusName
            orderDetail.payTime = obj.row.pay_time
            orderDetail.discountFee = obj.row.discount_fee
            orderDetail.postFee = obj.row.post_fee
            orderDetail.outTradeId = obj.row.out_trade_id
            orderDetail.payment = obj.row.payment
            that.$http.fetch(that.$api.database.trade.queryOrderByOutTradeId, { 'outTradeId': obj.row.out_trade_id })
              .then((resp) => {
                if (resp.success) {
                  orderDetail.order = resp.result
                  that.customerModel.orderVisible = true
                }
              })
          },
          'icon': '$.noop',
          'name': '\u8be6\u60c5',
          'auth': ``,
          'visible': ``
        }],
        orderVisible: false, // 子订单详情
        activityForm: { // 活动搜素表单
          outTradeId: '',
          tradeStatus: '',
          time: []
        },
        touchTable: [], // 触达表格
        touchForm: { // 触达搜索表单
          sendSource: '',
          typeMark: '',
          time: []
        },
        touchDetail: {
          sendSource: '',
          typeMark: '',
          sendTime: '',
          content: ''
        },
        touchType: [{ label: '短信', value: 1 }, { label: '邮件', value: 2 }, { label: '微信', value: 3 }], // 触达来源
        touchButton: [{ // 触达表格按钮
          'func': function (obj) {
            this.customerModel.DetailTitle = '触达详情'
            var touchDetail = this.customerModel.touchDetail
            touchDetail.typeMark = obj.row.typeMarkName
            touchDetail.sendSource = obj.row.typeMarkName
            touchDetail.sendTime = obj.row.send_time
            touchDetail.content = obj.row.content
            this.customerModel.orderVisible = true
          },
          'icon': '$.noop',
          'name': '\u8be6\u60c5',
          'auth': ``,
          'visible': ``
        }],
        touchList: [
          { title: '短信触达次数', number: '0' },
          { title: '邮件触达次数', number: '0' },
          { title: '微信触达次数', number: '0' }
        ], // 统计触达记录
        couponList: {
          expiredCount: 0,
          noExpiredCount: 0,
          usedCount: 0
        }, // 统计优惠卷
        couponTable: [],
        couponStatus: '', // 优惠券状态
        couponForm: { // 优惠券搜索表单
          couponTitle: '',
          channel: '',
          time: [],
          couponDetailStatus: '',
          couponStatus: ''
        },
        otherType: '0', // 其他类型
        outNickTable: [], // 昵称表格
        nickCount: 0, // 昵称个数
        outNickForm: { // 昵称搜索表单
          platform: '',
          time: [],
          outNick: ''
        }, // 昵称表格
        interactForm: {
          name: '',
          date: '',
          selectValue: '',
          options: [{
            value: '全部',
            label: '全部'
          }, {
            value: '抽奖',
            label: '抽奖'
          }, {
            value: '问卷调查',
            label: '问卷调查'
          }]
        }
      }
    }
  },
  watch: {},
  methods: {
    '$handleParams': function (params) {
      if (params.searchMap && params.searchMap.time && params.searchMap.time.length > 0) {
        params.searchMap.startTime = params.searchMap.time[0]
        params.searchMap.endTime = params.searchMap.time[1]
      }
      delete params.searchMap.time
      return params
    },
    onCloseDetail () {
      switch (this.activeName) {
        case 'consume': {
          var orderDetail = this.customerModel.orderDetail
          orderDetail.created = ''
          orderDetail.TradeStatusName = ''
          orderDetail.payTime = ''
          orderDetail.discountFee = ''
          orderDetail.postFee = ''
          orderDetail.outTradeId = ''
          orderDetail.payment = ''
          orderDetail.order = []
          break
        }
        case 'touch': {
          var touchDetail = this.customerModel.touchDetail
          touchDetail.sendSource = ''
          touchDetail.content = ''
          touchDetail.typeMark = ''
          touchDetail.sendTime = ''
          break
        }
      }
      this.customerModel.orderVisible = false
    },
    onCloseRight () {
      this.customerModel.customer.rightVisible = false
    },
    onCloseTouch () {
      this.customerModel.customer.touchVisible = false
    },
    setTouchType (obj) {
      switch (obj) {
        case 1: return '短信'
        case 2: return '邮件'
        case 3: return '微信'
        default: return ''
      }
    },
    onSaveRight () {
      var that = this
      var touchList = this.customerModel.customer.rightList
      var rightBlackStr = ''
      if (touchList.length > 0) {
        touchList = touchList.sort()
        for (let touch of touchList) {
          rightBlackStr += touch + ','
        }
        rightBlackStr = ',' + rightBlackStr
      }
      this.$http.fetch(that.$api.database.right.insertBySysCustomerIdAndBrandId, { 'sysCustomerId': this.sysCustomerId, 'rightBlackStr': rightBlackStr })
        .then((resp) => {
          if (resp.success) {
            that.$notify.success({
              message: '权益黑名单' + resp.msg
            })
            this.customerModel.customer.rightList = []
            that.setRightBlackType(rightBlackStr)
            that.customerModel.customer.rightVisible = false
          }
        })
    },
    onSaveTouch () {
      var that = this
      var touchList = []
      if (this.customerModel.customer.touchList.length > 0) {
        touchList = this.customerModel.customer.touchList
      }
      this.$http.fetch(that.$api.database.black.insertBySysCustomerIdAndBrandId, { 'sysCustomerId': this.sysCustomerId, 'blackType': touchList })
        .then((resp) => {
          if (resp.success) {
            that.$notify.success({
              message: '触达黑名单' + resp.msg
            })
            that.setTouchBlackType(that.customerModel.customer.touchList)
            that.customerModel.customer.touchVisible = false
          }
        })
    },
    change (val) {
      var that = this
      that.$http.fetch(that.$api.database.interact.minorIntegralTypeByType, { 'type': val })
        .then((resp) => {
          if (resp.success) {
            that.customerModel.integralForm.integralType = ''
            that.customerModel.integralType = resp.result
          }
        })
    },
    onClose () {
      this.customerModel.customer.base.splice(0, this.customerModel.customer.base.length)
      $.extend(this.customerModel, this.copyModel)
      this.customerModel.integralForm.time = []
      this.customerModel.integralForm.integralSource = ''
      this.customerModel.integralForm.integralType = ''
      this.customerModel.consumeForm.outTradeId = ''
      this.customerModel.consumeForm.tradeStatus = ''
      this.customerModel.consumeForm.time = []
      this.customerModel.touchForm.sendSource = ''
      this.customerModel.touchForm.typeMark = ''
      this.customerModel.touchForm.time = []
      this.customerModel.consumeCount = []
      this.customerModel.outNickForm.outNick = ''
      this.customerModel.outNickForm.platform = ''
      this.customerModel.outNickForm.time = []
      this.customerModel.couponForm.couponTitle = ''
      this.customerModel.couponForm.channel = ''
      this.customerModel.couponForm.time = []
      this.sysCustomerId = ''
      let copyTouchList = [
        { title: '短信触达次数', number: '0' },
        { title: '邮件触达次数', number: '0' },
        { title: '微信触达次数', number: '0' }
      ]
      this.$set(this.customerModel, 'touchType', copyTouchList)
      this.customerModel.customer.tradeAttr = []
      this.customerModel.customer.userAttr = []
      this.detailVisible = false
    },
    handleClick (tab, event) {
      switch (tab.name) {
        case 'integral': {
          this._data._pagination = this.customerModel.interactPagination
          this.model = this.customerModel.integralForm
          this.$set(this, 'url', this.$api.database.interact.queryTableBySysCustomerId)
          this.model.sysCustomerId = this.sysCustomerId
          if (this.customerModel.integralTable.length === 0) {
            let promise = this.$reload()
            promise.then(() => {
              this.customerModel.integralTable = this._data._table.data
              $.extend(this.customerModel.interactPagination, this._data._pagination)
            })
          }
          break
        }
        case 'consume': {
          this._data._pagination = this.customerModel.consumePagination
          this.model = this.customerModel.consumeForm
          this.model.sysCustomerId = this.sysCustomerId
          this.$set(this, 'url', this.$api.database.trade.queryTableBySysCustomerId)
          if (this.customerModel.consumeTable.length === 0) {
            let promise = this.$reload()
            promise.then(() => {
              this.customerModel.consumeTable = this._data._table.data
              $.extend(this.customerModel.consumePagination, this._data._pagination)
            })
          }
          break
        }
        case 'touch': {
          this._data._pagination = this.customerModel.touchPagination
          this.model = this.customerModel.touchForm
          this.model.sysCustomerId = this.sysCustomerId
          this.$set(this, 'url', this.$api.care.careLog.queryCareLogBySysCustomerId)
          if (this.customerModel.touchTable.length === 0) {
            let promise = this.$reload()
            promise.then(() => {
              this.customerModel.touchTable = this._data._table.data
              $.extend(this.customerModel.touchPagination, this._data._pagination)
            })
          }
          break
        }
        case 'coupon': {
          this._data._pagination = this.customerModel.couponPagination
          this.model = this.customerModel.couponForm
          this.model.sysCustomerId = this.sysCustomerId
          this.$set(this, 'url', this.$api.database.customerDetail.queryCouponBySysCustomerId)
          if (this.customerModel.couponTable.length === 0) {
            let promise = this.$reload()
            promise.then(() => {
              this.customerModel.couponTable = this._data._table.data
              $.extend(this.customerModel.couponPagination, this._data._pagination)
            })
          }
          break
        }
        case 'other': {
          this._data._pagination = this.customerModel.outNickPagination
          this.model = this.customerModel.outNickForm
          this.model.sysCustomerId = this.sysCustomerId
          this.$set(this, 'url', this.$api.database.customerDetail.queryShopCustomerBySysCustomerId)
          if (this.customerModel.outNickTable.length === 0) {
            let promise = this.$reload()
            promise.then(() => {
              this.customerModel.outNickTable = this._data._table.data
              this.customerModel.nickCount = this._data._table.data != null ? this._data._table.data.length : 0
              $.extend(this.customerModel.outNickPagination, this._data._pagination)
            })
          }
          break
        }
        default:break
      }
    },
    searchAction () {
      this._data._pagination.page = 1
      let promise = this.$reload()
      promise.then(() => {
        this.setData()
      })
    },
    sizeChange (page) {
      let promise = this.$sizeChange$(page)
      promise.then(() => {
        this.setData()
      })
    },
    pageChange: function (page) {
      let promise = this.$pageChange$(page)
      promise.then(() => {
        this.setData()
      })
    },
    setData () {
      switch (this.customerModel.activeName) {
        case 'integral': {
          this.customerModel.integralTable = this._data._table.data
          $.extend(this.customerModel.interactPagination, this._data._pagination)
          break
        }
        case 'consume': {
          this.customerModel.consumeTable = this._data._table.data
          $.extend(this.customerModel.consumePagination, this._data._pagination)
          break
        }
        case 'touch': {
          this.customerModel.touchTable = this._data._table.data
          $.extend(this.customerModel.touchPagination, this._data._pagination)
          break
        }
        case 'coupon': {
          this.customerModel.couponTable = this._data._table.data
          $.extend(this.customerModel.couponPagination, this._data._pagination)
          break
        }
        case 'other': {
          this.customerModel.outNickTable = this._data._table.data
          $.extend(this.customerModel.outNickPagination, this._data._pagination)
          break
        }
        default:break
      }
    },
    setCouponStatus (obj) { // 设置优惠券状态
      switch (obj) {
        case '0': this.customerModel.couponForm.couponDetailStatus = ''; this.customerModel.couponForm.couponStatus = obj; this.customerModel.couponStatus = obj; break
        case '1': this.customerModel.couponForm.couponDetailStatus = ''; this.customerModel.couponForm.couponStatus = obj; this.customerModel.couponStatus = obj; break
        case 'used': this.customerModel.couponForm.couponStatus = ''; this.customerModel.couponForm.couponDetailStatus = obj; this.customerModel.couponStatus = obj; break
        default:break
      }
      this.searchAction()
    },
    setOtherType (obj) {
      this.customerModel.otherType = obj
      switch (obj) {
        case '0': break
        case '1': break
        case '2': break
        default:break
      }
    },
    Fen2Yuan (num) {
      if (typeof num !== 'number' || isNaN(num)) { return 0 }
      return (num / 100).toFixed(2)
    },
    getGroupCareLog () { // 获取分组的触达记录
      this.customerModel.touchList = [
        { title: '短信触达次数', number: '0' },
        { title: '邮件触达次数', number: '0' },
        { title: '微信触达次数', number: '0' }
      ]
      var that = this
      that.$http.fetch(that.$api.care.careLog.groupCareLogBySysCustomerId, { 'sysCustomerId': this.sysCustomerId })
        .then((resp) => {
          if (resp.success) {
            if (resp.result !== null) {
              for (let type of resp.result) {
                switch (type.send_source) {
                // 短信0 邮件1 微信2
                  case 1: that.customerModel.touchList[0].number = type.count; break
                  case 2: that.customerModel.touchList[1].number = type.count; break
                  case 3: that.customerModel.touchList[2].number = type.count; break
                  default:break
                }
              }
            }
          }
        })
    },
    getGroupCoupon () { // 获取优惠卷个数
      var that = this
      that.$http.fetch(that.$api.marketing.coupon.groupBySysCustomerId, { 'sysCustomerId': this.sysCustomerId })
        .then((resp) => {
          if (resp.success) {
            if (resp.result.statusCount.length > 0) {
              for (let status of resp.result.statusCount) {
                switch (status.status) {
                  case 0: this.customerModel.couponList.noExpiredCount = status.count; break
                  case 1: this.customerModel.couponList.expiredCount = status.count; break
                  default: break
                }
              }
            }
            this.customerModel.couponList.usedCount = resp.result.usedCount
            this.customerModel.userData[3].num = resp.result.count
          }
        })
    },
    onOpenDetail (sysCustomerId) {
      this.getCustomerDetail(sysCustomerId)
    },
    setTouchBlackType (touchType) { // 设置触达黑名单
      var touchCopyType = JSON.parse(JSON.stringify(touchType))
      this.customerModel.customer.touchList = []
      if (touchCopyType.length > 0) {
        let type = ''
        for (let touch of touchCopyType) {
          if (touch.toString() === '0') {
            type += '手机号，'
          } else if (touch.toString() === '1') {
            type += '邮件，'
          } else if (touch.toString() === '2') {
            type += '微信，'
          }
          this.customerModel.customer.touchList.push(touch.toString())
        }
        this.customerModel.customer.touchBlackType = type.slice(0, type.length - 1)
      } else {
        this.customerModel.customer.touchBlackType = '无'
      }
    },
    setCareTime (obj) {
      let time = []
      if (obj.last_ordering_concern_time !== null) {
        time.push(obj.last_ordering_concern_time)
      }
      if (obj.last_pay_concern_time !== null) {
        time.push(obj.last_pay_concern_time)
      }
      if (obj.last_urge_time !== null) {
        time.push(obj.last_urge_time)
      }
      if (obj.last_ship_remind_time !== null) {
        time.push(obj.last_ship_remind_time)
      }
      if (obj.last_arrival_reminder_time !== null) {
        time.push(obj.last_arrival_reminder_time)
      }
      if (obj.last_receive_concern_time !== null) {
        time.push(obj.last_receive_concern_time)
      }
      if (obj.last_confirm_concern_time !== null) {
        time.push(obj.last_confirm_concern_time)
      }
      if (obj.last_memberup_time !== null) {
        time.push(obj.last_memberup_time)
      }
      if (time.length > 2) {
        let indexTime = time[0]
        for (let i = 1; i < time.length; i++) {
          if (moment(indexTime).toDate().getTime() < moment(time[i]).toDate().getTime()) {
            indexTime = time[i]
          }
        }
        this.customerModel.customer.lastCareTime = indexTime
      } else if (time.length === 1) {
        this.customerModel.customer.lastCareTime = time[0]
      } else {
        this.customerModel.customer.lastCareTime = ''
      }
    },
    setRightBlackType (rightType) { // 设置权益黑名单
      this.customerModel.customer.rightList = []
      var copyType = JSON.parse(JSON.stringify(rightType))
      if (copyType !== null && copyType !== 'null') {
        copyType = copyType.slice(1, copyType.length - 1)
        let type = ''
        for (let right of copyType.split(',')) {
          switch (right) {
            case '1': { type += '交易积分，'; break }
            case '2': { type += '互动积分，'; break }
            case '3': { type += '会员等级，'; break }
            case '4': { type += '会员权益，'; break }
            default: { break }
          }
          this.customerModel.customer.rightList.push(right)
        }
        this.customerModel.customer.rightBlackType = type.slice(0, type.length - 1)
      } else {
        this.customerModel.customer.rightBlackType = '无'
      }
    },
    getCustomerDetail: function (sysCustomerId) {
      this.sysCustomerId = sysCustomerId
      this.customerModel.customer.base = []
      this.customerModel.customer.tradeAttr = []
      this.customerModel.customer.userAttr = []
      var that = this
      that.$http.fetch(that.$api.database.customerDetail.queryCustomerDetail, {
        'sysCustomerId': sysCustomerId
      })
        .then((resp) => {
          if (resp.code !== ErrorCode.DATA_NO_EXIST) {
            that.setTouchBlackType(resp.result.touchBlackType)
            that.setRightBlackType(resp.result.rightBlackType)
            var customer = resp.result.customer
            var rfm = resp.result.rfm
            var customerModel = this.customerModel.customer
            if (customer != null) {
              customerModel.userAttr = resp.result.attr
              customerModel.customerName = customer.customerName
              customerModel.mobile = customer.mobile
              customerModel.sex = customer.sex
              customerModel.base.push({ title: '生日', value: customer.birthday })
              if (customer.birthday != null) {
                var year = customer.birthday.substr(0, 4)
                var yearNow = new Date().getFullYear()
                customerModel.base.push({ title: '年龄', value: yearNow - year })
              } else {
                customerModel.base.push({ title: '年龄', value: '' })
              }
              customerModel.base.push({ title: '身份证', value: customer.idcard })
              customerModel.base.push({ title: '来源', value: customer.platFormName + ' ' + customer.tag_name })
              customerModel.base.push({ title: '会员等级', value: customer.gradeName == null ? '会员等级0' : customer.gradeName })
              customerModel.base.push({ title: '会员卡号', value: customer.member_card })
              customerModel.base.push({ title: '开卡时间', value: customer.in_member_time })
              customerModel.base.push({ title: '开卡渠道', value: '' })
              customerModel.base.push({ title: '固定电话', value: customer.phone })
              customerModel.base.push({ title: 'QQ', value: customer.qq })
              customerModel.base.push({ title: 'Email', value: customer.email })
              customerModel.base.push({ title: '支付宝', value: customer.buyerAlipayNo })
              customerModel.base.push({ title: '所在地区', value: customer.province + customer.city + customer.district })
              customerModel.base.push({ title: '详细地址', value: customer.address })
              customerModel.isRightBlack = customer.is_right_black === 1
              customerModel.isMemberBlack = customer.is_member_black === 1
              if (customer.is_un_sub_scribe === 1) {
                customerModel.SMSUnsubscribe = '退订'
              } else {
                customerModel.SMSUnsubscribe = '不退订'
              }
              customerModel.remark = customer.customer_remark
            }
            if (rfm != null) {
              that.setCareTime(rfm)
              customerModel.tradeAttr.push({ title: '订单数量', value: rfm.buy_total_num })
              customerModel.tradeAttr.push({ title: '付款总额', value: rfm.pay_amount })
              customerModel.tradeAttr.push({ title: '每笔单件', value: rfm.price_unit })
              customerModel.tradeAttr.push({ title: '每笔件数', value: rfm.item_unit })
              customerModel.tradeAttr.push({ title: '退款次数', value: rfm.refund_times })
              customerModel.tradeAttr.push({ title: '退款总额', value: rfm.refund_amount })
              customerModel.tradeAttr.push({ title: '最早付款时间', value: rfm.first_pay_time })
              customerModel.tradeAttr.push({ title: '最晚付款时间', value: rfm.last_pay_time })
              customerModel.tradeAttr.push({ title: '付款休眠天数', value: rfm.dormancyDay })
              this.customerModel.consumeCount.push({
                title: '订单总数',
                number: rfm.pay_all_times === null ? 0 : rfm.pay_all_times
              })
              this.customerModel.consumeCount.push({
                title: '付款总额',
                number: rfm.pay_amount === null ? 0 : rfm.pay_amount
              })
              this.customerModel.consumeCount.push({
                title: '平均每笔订单付款额',
                number: rfm.price_unit === null ? 0 : rfm.price_unit
              })
              this.customerModel.consumeCount.push({
                title: '退款次数',
                number: rfm.refund_times === null ? 0 : rfm.refund_times
              })
              this.customerModel.consumeCount.push({
                title: '退款总额',
                number: rfm.refund_amount === null ? 0 : rfm.refund_amount
              })
            }
          } else {
            this.customerModel.customer.base = [
              { title: '生日', value: '' }, { title: '年龄', value: '' }, { title: '身份证', value: '' }, { title: '来源', value: '' },
              { title: '会员等级', value: '' }, { title: '会员卡号', value: '' }, { title: '开卡时间', value: '' }, {
                title: '开卡渠道',
                value: ''
              },
              { title: '固定电话', value: '' }, { title: 'QQ', value: '' }, { title: 'Email', value: '' }, {
                title: '支付宝',
                value: ''
              },
              { title: '所在地区', value: '' }, { title: '详细地址', value: '' }
            ]
            this.customerModel.customer.tradeAttr = [
              { title: '订单数量', value: '' }, { title: '付款总额', value: '' }, { title: '每笔单件', value: '' },
              { title: '每笔件数', value: '' }, { title: '退款次数', value: '' }, { title: '退款总额', value: '' },
              { title: '最早付款时间', value: '' }, { title: '最晚付款时间', value: '' }, { title: '付款休眠天数', value: '' }
            ]
            this.customerModel.consumeCount = [
              { title: '订单总数', number: 0 }, { title: '付款总额', number: 0 },
              { title: '平均每笔订单付款额', number: 0 }, { title: '平均每笔订单付款额', number: 0 },
              { title: '退款次数', number: 0 }, { title: '退款总额', number: 0 }]
          }
          this.detailVisible = true
        }).catch((resp) => {
          that.$notify.error(resp.msg)
        }).finally(() => {
        })
      this.getGroupCareLog()
      this.getGroupCoupon()
    }
  },
  components: {
    NsDatetime
  },
  created () {
    this.copyModel = Object.assign(this, {}, this.customerModel)
  },
  mounted () {}
}
