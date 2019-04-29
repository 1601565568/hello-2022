import formMixin from 'web-crm/src/mixins/form'
import moment from 'moment'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'

export default {
  mixins: [formMixin],
  data: function () {
    let model = {
      id: -1,
      storeCouponResource: 1, // 优惠券来源
      // storeCouponCommon: 0, // 是否公开
      storeCouponType: 1, // 优惠券类型
      storeCouponTitle: '', // 优惠卷名称
      storeCouponValue: null, // 面额
      issueAmountType: 0, // 发行量类型
      maxIssueAmount: null, // 最大发行量
      dateValidType: 0, // 有效时间类型
      startDateTime: null, // 优惠券的生效时间
      endDateTime: null, // 优惠券的截止时间
      afterGetValidDays: null, // 领取后第N天有效
      validDays: null, // 有效天数
      useConditionType: 0, // 使用条件类型
      tradeCountValidType: 0, // 单数限制类型
      tradeCountValid: null, // 单数限制
      maxIssueCount: null, // 每人最大领取张数
      tradeAmount: null, // 订单满额门槛
      itemAmount: null, // 订单商品件数门槛
      addAmount: null, // 加钱可用门槛
      logic: 'and',
      itemCount: null, // 同一订单同一商品件数门槛
      validTime: null, // 可用时段
      validTimeType: 0, // 可用时段类型
      invalidDateType: 0, // 不可用日期类型
      invalidDateList: null, // 不可用日期列表
      itemRangeType: 0, // 商品筛选类型
      itemContainType: 0, // 商品包含类型
      itemConditionJson: [], // 商品条件
      shopRangeType: 0, // 门店指定类型
      giftJson: [] // 兑换的物品
    }
    let that = this
    let rules = {
      // 面额或折扣
      storeCouponValue: [{
        validator: (rule, val, call) => {
          if (that.model.storeCouponType === 1) {
            if (!val) {
              call(new Error('请输入面额'))
            }
          } else if (that.model.storeCouponType === 2) {
            if (!val) {
              call(new Error('请输入折扣'))
            }
          }
          call()
        },
        trigger: 'blur,change'
      }],
      // 礼品
      giftJson: [{
        validator: (rule, val, call) => {
          if (that.model.storeCouponType === 3) {
            if (!val) {
              call(new Error('请选择兑换礼品'))
            }
          }
          call()
        }
      }],
      // 发行量
      maxIssueAmount: [{
        validator: (rule, val, call) => {
          if (that.model.issueAmountType === 1) {
            if (!val) {
              call(new Error('请输入最大发行量'))
            }
          }
          call()
        }
      }],
      startDateTime: [{
        validator: (rule, val, call) => {
          if (that.model.dateValidType === 0) {
            if (!val) {
              call(new Error('请选择生效时间'))
            }
          }
          call()
        }
      }],
      endDateTime: [{
        validator: (rule, val, call) => {
          if (!val) {
            call(new Error('请选择截止时间'))
          }
          call()
        }
      }],
      afterGetValidDays: [{
        validator: (rule, val, call) => {
          if (that.model.dateValidType === 1) {
            if (!val) {
              call(new Error('不能为空'))
            }
          }
          call()
        }
      }],
      validDays: [{
        validator: (rule, val, call) => {
          if (that.model.dateValidType === 1) {
            if (!val) {
              call(new Error('不能为空'))
            }
          }
          call()
        }
      }],
      tradeAmount: [{
        validator: (rule, val, call) => {
          if (that.model.useConditionType === 1) {
            if (!val) {
              call(new Error('不能为空'))
            }
          }
          call()
        }
      }],
      itemAmount: [{
        validator: (rule, val, call) => {
          if (that.model.useConditionType === 1) {
            if (!val) {
              call(new Error('不能为空'))
            }
          }
          call()
        }
      }],
      itemCount: [{
        validator: (rule, val, call) => {
          if (that.model.useConditionType === 2) {
            if (!val) {
              call(new Error('不能为空'))
            }
          }
          call()
        }
      }],
      addAmount: [{
        validator: (rule, val, call) => {
          if (that.model.useConditionType === 3) {
            if (!val) {
              call(new Error('不能为空'))
            }
          }
          call()
        }
      }],
      tradeCountValid: [{
        validator: (rule, val, call) => {
          if (that.model.tradeCountValidType === 1) {
            if (!val) {
              call(new Error('不能为空'))
            }
          }
          call()
        }
      }],
      validTime: [{
        validator: (rule, val, call) => {
          if (that.model.validTimeType === 1) {
            if (!val || val.length <= 0) {
              call(new Error('请选择可用时段'))
            }
          }
          call()
        }
      }],
      invalidDateList: [{
        validator: (rule, val, call) => {
          if (that.model.invalidDateType === 1) {
            if (!val || val.length <= 0) {
              call(new Error('请指定日期'))
            }
          }
          call()
        }
      }]
    }
    return {
      shopIds: [],
      title: '',
      dialogVisible: false,
      forbidden: false,
      loading: false,
      rules: rules,
      TemplateModel: model,
      model: this.copyModel(model),
      /**
       * 设置日期组件不可选历史日期
       */
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  methods: {
    /**
     * 关闭弹框
     */
    closeDialog: function () {
      const that = this
      that.dialogVisible = false
    },
    // 删除优惠券
    deleteCoupon: function (row) {
      let that = this
      apiRequestConfirm('删除该优惠券').then(() => {
        that.$http.fetch(that.$api.coupon.storeCoupon.deleteCoupon, { couponId: row.id }).then((resp) => {
          if (resp.success === true) {
            that.$message.success('删除成功')
          }
        }).catch(() => { that.$message.error('删除失败') })
      }).catch(() => {})
    },
    /**
     * 编辑优惠券
     * @param row
     */
    edit (row) {
      let that = this
      that.title = '编辑优惠券'
      that.forbidden = true
      if (row) {
        // 数据转换
        let model = this.transObjProp2CamelCase(row)
        if (model.storeCouponType === 2) {
          model.storeCouponValue = model.storeCouponValue * 10
        }
        if (model.maxIssueAmount === 0) {
          model.issueAmountType = 0
        } else {
          model.issueAmountType = 1
        }
        model.giftJson = model.giftJson ? JSON.parse(model.giftJson) : []
        // 有效时间
        model.startDateTime = model.startTime ? new Date(model.startTime) : null
        model.endDateTime = model.endTime ? new Date(model.endTime) : null
        // 使用条件
        let useConditionJson = model.useConditionJson ? JSON.parse(model.useConditionJson) : null
        if (useConditionJson) {
          model.useConditionType = useConditionJson.type
          model.tradeAmount = useConditionJson.condition.tradeAmount
          model.logic = useConditionJson.condition.logic
          model.itemAmount = useConditionJson.condition.itemAmount
          model.itemCount = useConditionJson.condition.itemCount
          model.addAmount = useConditionJson.condition.addAmount
        }
        // 使用范围
        let useRange = model.useRange ? JSON.parse(model.useRange) : null
        if (useRange) {
          model.itemRangeType = useRange.itemRangeType
          model.itemContainType = useRange.itemRange.type
          model.itemConditionJson = useRange.itemRange.itemList ? useRange.itemRange.itemList : []
          model.shopRangeType = useRange.shopRangeType
          that.shopIds = useRange.shopList ? useRange.shopList : []
        }
        // 可用时段
        let validTime = model.validTime ? JSON.parse(model.validTime) : null
        if (validTime) {
          model.validTimeType = validTime.type
          if (validTime.timeRange && validTime.timeRange.startTime && validTime.timeRange.endTime) {
            let currentDate = moment(new Date()).format('YYYY-MM-DD')
            let startTime = new Date(currentDate + validTime.timeRange.startTime)
            let endTime = new Date(currentDate + validTime.timeRange.endTime)
            model.validTime = [startTime, endTime]
          } else {
            model.validTime = null
          }
        }
        // 不可用日期
        let invalidDate = model.invalidDate ? JSON.parse(model.invalidDate) : null
        if (invalidDate) {
          model.invalidDateType = invalidDate.type
          if (invalidDate.dayList && invalidDate.dayList.length > 0) {
            let invalidDateArr = []
            for (let j = 0, len = invalidDate.dayList.length; j < len; j++) {
              invalidDateArr[j] = new Date(invalidDate.dayList[j])
            }
            model.invalidDateList = invalidDateArr
          }
        }
        that.$set(that, 'model', model)
      }
      that.dialogVisible = true
    },
    /**
     * 打开弹框
     */
    addCoupon: function () {
      const that = this
      that.resetForm()
      that.title = '新增优惠券'
      that.dialogVisible = true
      that.forbidden = false
    },
    /**
     * 保存优惠券
     */
    saveCoupon: function () {
      let that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          // 封装数据
          let formValue = that.handleSaveData()
          that.$http.fetch(that.$api.coupon.storeCoupon.saveOrUpdateCoupon, formValue).then(() => {
            that.$message.success('保存成功')
            that.$refs.form.resetFields()
            that.$refs.table.$reload()
            that.dialogVisible = false
          }).catch(() => {
            that.$message.error('保存失败')
          })
        }
      })
    },
    // 处理需要保存的数据
    handleSaveData: function () {
      let that = this
      let formValue = that.model
      // 未知券
      if (formValue.storeCouponType === 0) {
        return null
      }
      // 折扣券处理折扣
      if (formValue.storeCouponType === 2) {
        formValue.storeCouponValue = that.model.storeCouponValue / 10
      }
      if (formValue.issueAmountType === 0) {
        formValue.maxIssueAmount = 0
      }
      // 有效时间
      formValue.startTime = formValue.startDateTime ? moment(formValue.startDateTime).format('YYYY-MM-DD HH:mm:ss') : null
      formValue.endTime = formValue.endDateTime ? moment(formValue.endDateTime).format('YYYY-MM-DD HH:mm:ss') : null
      delete formValue.startDateTime
      delete formValue.endDateTime
      // 使用条件
      let useConditionJson = {
        type: formValue.useConditionType,
        condition: {
          tradeAmount: formValue.tradeAmount,
          logic: formValue.logic,
          itemAmount: formValue.itemAmount,
          itemCount: formValue.itemCount,
          addAmount: formValue.addAmount
        }
      }
      formValue.useConditionJson = JSON.stringify(useConditionJson)
      // 使用范围
      let useRange = {
        itemRangeType: formValue.itemRangeType,
        itemRange: {
          type: formValue.itemContainType,
          itemList: formValue.itemConditionJson
        },
        shopRangeType: formValue.shopRangeType,
        shopList: that.shopIds
      }
      formValue.useRange = JSON.stringify(useRange)
      if (formValue.tradeCountValidType === 0) {
        formValue.tradeCountValid = 0
      }
      // 可用时段
      let validTime = {
        type: formValue.validTimeType,
        timeRange: {}
      }
      if (formValue.validTime) {
        validTime.timeRange = {
          startTime: moment(formValue.validTime[0]).format('HH:mm:ss'),
          endTime: moment(formValue.validTime[1]).format('HH:mm:ss')
        }
      }
      formValue.validTime = JSON.stringify(validTime)
      // 不可用日期
      let invalidDate = {
        type: formValue.invalidDateType,
        dayList: {}
      }
      if (formValue.invalidDateList) {
        let invalidDateArr = []
        for (let j = 0, len = formValue.invalidDateList.length; j < len; j++) {
          invalidDateArr[j] = moment(formValue.invalidDateList[j]).format('YYYY-MM-DD')
        }
        invalidDate.dayList = invalidDateArr
      }
      formValue.invalidDate = JSON.stringify(invalidDate)
      // 转换为下划线
      return formValue
    },
    // 重置表单数据
    resetForm: function () {
      let that = this
      let obj = this.copyModel(that.TemplateModel)
      this.$set(that, 'model', obj)
    },
    // 深复制对象
    copyModel: function (obj) {
      let res = {}
      for (let key in obj) {
        res[key] = obj[key]
      }
      return res
    },
    /**
     * 弹窗打开时触发
     */
    onDialogOpen: function () {
      this.$nextTick(() => {
        this.$refs.scrollbar.$el.children[0].style.height = '500px'
      })
    }
  },
  mounted () {
  }
}
