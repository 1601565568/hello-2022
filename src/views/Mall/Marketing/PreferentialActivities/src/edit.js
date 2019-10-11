import formMixin from '@nascent/ecrp-ecrm/src/mixins/form'
import moment from 'moment'
import { getErrorMsg } from '@/utils/toast'
export default {
  name: 'edit',
  mixins: [formMixin],
  data: function () {
    let rules = {
      name: [
        {
          required: true,
          message: '请填写活动名称',
          trigger: 'change'
        }, {
          min: 0,
          max: 25,
          message: '最多输入25个字',
          trigger: 'blur,change'
        }
      ],
      activityTime: [{
        required: true,
        validator: (rule, value, callback) => {
          if (!(!value || !(value[0] || value[1]))) {
            callback()
          } else {
            callback(new Error('请输入活动时间'))
          }
        },
        trigger: 'blur'
      }]
    }
    return {
      title: '',
      saveLoading: false,
      model: {
        name: null,
        activityTime: [],
        remark: null,
        goodsType: 1,
        shopType: 1,
        shopOptional: true,
        goodsOptional: true
      },
      goodsInfo: null,
      shopQueryParams: {
        goodsIds: null,
        activityId: null,
        goodsType: 1
      },
      goodsQueryParams: {
        shopIds: null,
        activityId: null,
        shopType: 1
      },
      activityId: null,
      shopInfo: [],
      rules: rules,
      saveBtnLoading: false,
      tableList: [],
      couponList: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  methods: {
    // 返回到列表
    backList: function (val) {
      this.$emit('showList', val)
    },
    /**
     * 活动详情回显
     * @param activityId 活动ID
     */
    showData: function (activityId) {
      let that = this
      that.model.goodsOptional = true
      that.model.shopOptional = true
      // 打开编辑页面
      if (activityId) {
        that.title = '编辑活动'
        that.saveLoading = true
        that.$http.fetch(that.$api.guide.marketing.queryActivityDetail, { activityId: activityId }).then((resp) => {
          let data = resp.result
          that.activityId = activityId
          that.model.name = data.name
          that.model.remark = data.remark
          let activityTime = []
          activityTime.push(data.startTime)
          activityTime.push(data.endTime)
          that.model.activityTime = activityTime
          that.model.shopType = data.shopType
          that.model.goodsType = data.goodsType
          that.shopInfo = data.shopInfo
          that.goodsInfo = data.goodsInfo
          data.rules.forEach(rule => {
            if (!rule.coupons) {
              rule.coupons = rule.coupons ? rule.coupons : [{ id: null, num: null }]
            }
          })
          that.tableList = data.rules
          that.saveLoading = false
          if (that.shopInfo && that.shopInfo.length > 0) {
            let shopArr = []
            for (let i = 0; i < that.shopInfo.length; i++) {
              shopArr.push(that.shopInfo[i])
            }
            that.goodsQueryParams.shopIds = shopArr.join(',')
          }
          that.goodsQueryParams.activityId = activityId
          that.goodsQueryParams.shopType = that.model.shopType
          if (that.goodsInfo && that.goodsInfo.length > 0) {
            let goodsArr = []
            for (let i = 0; i < that.goodsInfo.length; i++) {
              goodsArr.push(that.goodsInfo[i].sys_item_id)
            }
            that.shopQueryParams.goodsIds = goodsArr.join(',')
          }
          that.shopQueryParams.activityId = activityId
          that.shopQueryParams.goodsType = that.model.goodsType
          // 部分门店时查询门店表格
          if (data.shopType === 1) {
            that.queryShopOptional()
            that.$refs.shopsTable.findList(null, activityId)
          }
          // 部分商品时查询门店表格
          if (data.goodsType === 1) {
            that.queryGoodsOptional()
            that.$refs.goodsTable.findList(null, activityId)
          }
        }).catch((resp) => {
          that.$notify.error(getErrorMsg('活动查询失败', resp))
        })
      } else {
        // 打开新增页面
        that.title = '新增活动'
        that.queryGoodsOptional()
        that.queryShopOptional()
        that.cleanData()
      }
    },
    /**
     * 表单数据清空
     */
    cleanData: function () {
      let that = this
      that.model = {
        name: null,
        activityTime: [],
        remark: null,
        shopOptional: true,
        goodsOptional: true,
        goodsType: 1,
        shopType: 1
      }
      that.activityId = null
      that.tableList = []
      that.addNewRule()
      that.goodsInfo = []
      that.shopQueryParams = {
        goodsIds: null,
        goodsType: 1,
        activityId: null
      }
      that.goodsQueryParams = {
        shopIds: null,
        shopType: 1,
        activityId: null
      }
      that.shopInfo = []
      that.$refs.goodsTable.findList()
      that.$refs.shopsTable.findList()
    },
    // 增加营销设置规则
    addNewRule: function () {
      let that = this
      if (that.tableList.length < 5) {
        let setting = {
          level: null,
          restrict: null,
          type: 1,
          usePaymentPreferential: false,
          amount: null,
          discount: null,
          integral: null,
          usePostagePreferential: false,
          paymentPreferentialType: 0,
          giveIntegral: false,
          giveCoupon: false,
          giveGift: false,
          coupons: [{ id: null, num: null }]
        }
        that.tableList.push(setting)
        setting.level = that.tableList.length
      }
    },
    // 添加优惠券
    addCoupon: function (coupons) {
      let coupon = {
        id: null,
        num: null
      }
      coupons.push(coupon)
    },
    // 删除优惠券
    deleteCoupon: function (coupons, index) {
      coupons.splice(index, 1)
    },
    // 删除营销设置规则
    deleteRule: function (rule) {
      let that = this
      that.tableList.splice(rule.level - 1, 1)
      for (let i = rule.level - 1; i < that.tableList.length; i++) {
        that.tableList[i].level = that.tableList[i].level - 1
      }
    },
    // 保存活动
    onSave: function () {
      let that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          // 校验优惠设置、商品、门店等
          valid = that.handleSaveData()
          if (!valid) {
            return
          }
          that.saveLoading = true
          let params = Object.assign({}, that.model, { 'rules': that.tableList })
          if (that.model.activityTime[0]) {
            params.startTime = moment(that.model.activityTime[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (that.model.activityTime[1]) {
            params.endTime = moment(that.model.activityTime[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          params.goodsIds = that.shopQueryParams.goodsIds
          params.shopIds = that.goodsQueryParams.shopIds
          params.id = that.activityId
          this.validAndSubmit({
            loading: 'saveBtnLoading',
            api: that.$api.guide.marketing.saveOrUpdateActivity,
            params: params,
            success: function () {
              that.$notify.success('保存成功')
              that.backList()
            },
            error: function (resp) {
              that.$notify.error(getErrorMsg('保存失败', resp))
            },
            complete: function () {
              that.saveLoading = false
            }
          })
        }
      })
    },
    // 校验活动的设置是否正确
    handleSaveData: function () {
      // 校验规则
      let that = this
      if (!that.tableList || that.tableList.length <= 0) {
        this.$message.error('请添加营销优惠设置')
        return false
      }
      // 校验商品
      if (that.model.goodsType === 1 && (!that.goodsInfo || that.goodsInfo.length <= 0)) {
        this.$message.error('请选择活动商品')
        return false
      }
      if (that.model.goodsType === 0) {
        that.queryGoodsOptional()
        if (!that.model.goodsOptional) {
          this.$message.error('无法指定全部商品')
          return false
        }
      }
      // 校验门店
      if (that.model.shopType === 1 && (!that.shopInfo || that.shopInfo.length <= 0)) {
        this.$message.error('请选择活动门店')
        return false
      }
      if (that.model.shopType === 0) {
        that.queryShopOptional()
        if (!that.model.shopOptional) {
          this.$message.error('无法指定全部门店')
          return false
        }
      }
      that.tableList.forEach(rule => {
        if (rule.giveCoupon) {
          rule.couponJson = JSON.stringify(rule.coupons)
        }
      })
      return true
    },
    // 选择商品
    addGoods: function () {
      let that = this
      let goodsArr = []
      for (let i = 0; i < that.goodsInfo.length; i++) {
        goodsArr.push(that.goodsInfo[i].sys_item_id)
      }
      that.shopQueryParams.goodsIds = goodsArr.join(',')
      that.$refs.goodsTable.findList(that.shopQueryParams.goodsIds, null)
      that.queryShopOptional()
    },
    // 删除商品
    deleteGoods: function (sysItemId) {
      let that = this
      let goodsArr = []
      for (let i = 0; i < that.goodsInfo.length; i++) {
        if (sysItemId === that.goodsInfo[i].sys_item_id) {
          that.goodsInfo.splice(i, 1)
          continue
        }
        goodsArr.push(that.goodsInfo[i].sys_item_id)
      }
      that.shopQueryParams.goodsIds = goodsArr.join(',')
    },
    // 选择门店
    addShop: function (val) {
      let that = this
      that.shopInfo = val
      let shopArr = []
      for (let i = 0; i < that.shopInfo.length; i++) {
        shopArr.push(that.shopInfo[i])
      }
      that.goodsQueryParams.shopIds = shopArr.join(',')
      that.$refs.shopsTable.findList(that.goodsQueryParams.shopIds, null)
      that.queryGoodsOptional()
    },
    // 删除已选择的门店
    deleteShops: function (shopId) {
      let that = this
      let shopArr = []
      for (let i = 0; i < that.shopInfo.length; i++) {
        if (shopId === that.shopInfo[i].id) {
          that.shopInfo.splice(i, 1)
          continue
        }
        shopArr.push(that.shopInfo[i])
      }
      that.goodsQueryParams.shopIds = shopArr.join(',')
    },
    /**
     * 查询是否可选择全部商品
     * @param shopIds
     */
    queryGoodsOptional: function () {
      let that = this
      that.$http.fetch(that.$api.guide.marketing.queryGoodsOptional,
        { shopIds: that.goodsQueryParams.shopIds, activityId: that.goodsQueryParams.activityId, shopType: that.model.shopType }).then((resp) => {
        that.model.goodsOptional = resp.result
      }).catch((resp) => {})
    },
    /**
     * 查询是否可选择全部门店
     * @param goodsIds
     */
    queryShopOptional: function () {
      let that = this
      that.$http.fetch(that.$api.guide.marketing.queryShopOptional,
        { goodsIds: that.shopQueryParams.goodsIds, activityId: that.shopQueryParams.activityId, goodsType: that.model.goodsType }).then((resp) => {
        that.model.shopOptional = resp.result
      }).catch((resp) => {})
    },

    goodsTypeChange: function (val) {
      let that = this
      that.shopQueryParams.goodsType = val
      that.queryShopOptional()
    },
    shopTypeChange: function (val) {
      let that = this
      that.goodsQueryParams.shopType = val
      that.queryGoodsOptional()
    },
    setCouponTitle: function (coupon) {
      let that = this
      let obj = that.couponList.find((item) => {
        // eslint-disable-next-line no-return-assign
        return item.couponId = coupon.id
      })
      coupon.title = obj.couponTitle
    }
  },
  mounted: function () {
    this.couponList = []
    this.$http.fetch(this.$api.guide.marketing.findStoreCouponListByBrandId).then((resp) => {
      if (resp.result) {
        this.couponList = resp.result
      }
    })
  }
}
