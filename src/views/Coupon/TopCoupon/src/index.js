import formMixin from 'web-crm/src/mixins/form'
import moment from 'moment'
var vm
export default {
  mixins: [formMixin],
  data: function () {
    return {
      visibleCoupon: false,
      visibleDetail: false,
      title: '新增用户',
      baseUrl: '',
      expire: true,
      saveLoading: false,
      authTime: '',
      coupon: {
        id: '', // id
        condition: '0', // 金额满足
        coupon_title: '', // 优惠券名称
        shop_id: '', //  店铺id
        start_time: '', // 生效时间
        end_time: '', // 失效时间
        denominations: '', // 面额
        coupon_condition: '', // 满多少钱
        coupon_jingling_power: '' // 精灵支持
      },
      pickerOptions0: {
        disabledDate: function (time) {
          var disabled = false
          disabled = time.getTime() < moment().subtract(1, 'days').toDate().getTime()
          return disabled
        }
      },
      pickerOptions1: {
        disabledDate: function (time) {
          var disabled = false
          if (vm.coupon.start_time) {
            disabled = time.getTime() < moment(vm.coupon.start_time).add(1, 'days').toDate().getTime()
          } else {
            disabled = time.getTime() < moment().toDate().getTime()
          }
          return disabled
        }
      },
      rules: {
        coupon_title: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        start_time: [
          { type: 'date', required: true, message: '请选择生效时间', trigger: 'change' }
        ],
        end_time: [
          { type: 'date', required: true, message: '请选择失效时间', trigger: 'change' },
          { validator: (rule, value, callback) => {
            var start = this.coupon.start_time
            if (start !== '') {
              if (moment(value).toDate().getTime() > moment(start).toDate().getTime()) {
                callback()
              } else {
                callback(new Error('失效时间必须大于生效时间'))
              }
            } else {
              callback()
            }
          } }
        ],
        shop_id: [
          { required: true, message: '请选择店铺', trigger: 'change' }
        ],
        denominations: [
          { required: true, message: '请选择面额', trigger: 'change' }
        ],
        coupon_condition: [{ type: 'number', required: true, message: '请输入正确的金额', trigger: 'blur' }, { validator: (rule, value, callback) => {
          let regex = /^[0-9]+$/
          if (this.coupon.denominations === '') {
            callback()
          } else if (regex.test(value)) {
            if (value.length >= 10) {
              callback(new Error('请输入 1 到 10位的正整数金额'))
            } else if (parseInt(this.coupon.denominations) >= parseInt(value)) {
              callback(new Error('请输入大于面额的金额'))
            } else {
              callback()
            }
          } else {
            callback(new Error('请输入 1 到 10位的正整数金额'))
          }
        },
        trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    addCoupon: function () {
      this.title = '新增淘系优惠券'
      this.visibleCoupon = true
    },
    // 授权
    grantAuth () {
      var that = this
      if (this.coupon.shop_id !== '') {
        var url = this.baseUrl
        url = url.replace('{shopId}', this.coupon.shop_id)
        this.$confirm('尊敬的客户，因创建优惠券是一种高危的动作，淘宝需要我们进行临时短授权后才能够保存创建优惠券。若授权遇到问题而导致授权失败，将无法保存创建优惠券，请与我们联系！<span class="text-info">注：授权时请用主号登录</span>', '提示', {
          confirmButtonText: '已完成授权',
          cancelButtonText: '授权遇到问题',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          that.changeShop(that.coupon.shop_id, true)
        }).catch(() => {
        })
        window.open(url, 'newwindow', 'width=800,height=500,toolbar=no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no')
      } else {
        this.$notify.warning('请先选择店铺')
      }
    },
    updateCoupon: function (obj) {
      this.title = '修改淘系优惠券'
    },
    timeOut () {
      this.expire = true
    },
    onSave: function () {
      vm.$refs.form.validate((valid) => {
        if (valid) {
          if (!vm.expire) {
            var couponCondition = 0
            if (this.coupon.condition !== '0') {
              couponCondition = this.coupon.coupon_condition
            }
            var coupon = {
              coupon_condition: couponCondition * 100,
              coupon_title: this.coupon.coupon_title,
              shop_id: this.coupon.shop_id,
              start_time: moment(this.coupon.start_time).format('YYYY-MM-DD 00:00:00'),
              end_time: moment(this.coupon.end_time).format('YYYY-MM-DD 00:00:00'),
              denominations: this.coupon.denominations * 100,
              coupon_jingling_power: this.coupon.coupon_jingling_power
            }
            vm.saveLoading = true
            vm.$http.fetch(vm.$api.marketing.coupon.saveOrUpdate, coupon)
              .then((resp) => {
                vm.$notify.success(resp.msg)
                vm.$refs.table.$reload()
                vm.onClose()
              }).catch((resp) => {
                vm.$notify.error(resp.msg)
              }).finally(function () {
                vm.saveLoading = false
              })
          } else {
            vm.$notify.warning('请先店铺授权')
          }
        } else {
          return false
        }
      })
    },
    changeShop: function (obj, isAuth) {
      vm.$http.fetch(vm.$api.marketing.coupon.checkAuth, { shopId: obj })
        .then((resp) => {
          if (new Date().getTime() < moment(resp.result.expires_time).toDate().getTime()) {
            vm.authTime = resp.result.expires_time
            vm.expire = false
          } else {
            vm.expire = true
          }
        }).catch((resp) => {
          vm.expire = true
        }).finally(function () {
          if (typeof (isAuth) !== 'undefined' && vm.expire) {
            vm.$confirm('授权失败，请重新授权！', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'warning'
            }).then(() => {
            }).catch(() => {})
          }
        })
    },
    onState () {
      vm.$http.fetch(vm.$api.marketing.coupon.setAuthInvalid, { shopId: this.coupon.shop_id })
        .then((resp) => {
          vm.$notify.success(resp.result)
          vm.expire = true
        }).catch((resp) => {
          vm.$notify.error(resp.result)
        })
    },
    onClose: function () {
      this.visibleCoupon = false
      this.coupon.condition = '0'
      this.$refs['form'].resetFields()
    },
    onDetailClose () {
      this.$refs.detailTable.$resetInputAction$()
      this.$refs.detailTable._data._table.data = []
      this.visibleDetail = false
    },
    openDetail (obj) {
      this.visibleDetail = true
      this.$nextTick(function () {
        this.$refs.detailTable.model.shop_id = obj.shop_id
        this.$refs.detailTable.model.coupon_id = obj.coupon_id
        this.$refs.detailTable.$reload()
      })
    }
  },
  watch: {},
  created: function () {
    vm = this
    vm.$http.fetch(this.$api.marketing.coupon.getCouponUrl)
      .then((resp) => {
        vm.baseUrl = resp.result
        vm.baseUrl = vm.baseUrl.replace('{hostname}', window.location.hostname + ':' + window.location.port + this.$http.config.API_ROOT)
      })
  },
  mounted: function () {}
}
