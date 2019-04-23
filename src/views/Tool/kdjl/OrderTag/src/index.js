import ErrorCode from '@/config/errorCode'
import formMixin from 'mixins/form'
import moment from 'moment'

var vm
export default {
  mixins: [formMixin],
  data: function () {
    return {
      copyMemo: {},
      visible: false,
      loading: false,
      shops: [],
      copyModel: {},
      model: {
        shop_id: '',
        trade_tag_name: '',
        trade_tag_type: '0',
        trade_tag_content: '',
        selectShop: [],
        saleTime: '',
        giftList: [{ name: '', num: '', code: '', remark: '' }]
      },
      pickerOptions: {
        disabledDate: function (time) {
          var disabled = false
          disabled = time.getTime() < moment().toDate().getTime()
          return disabled
        }
      },
      rules: {
        shop_id: [{ required: true, message: '请选择店铺', trigger: 'change' }],
        saleTime: [{ required: true, message: '请选择预发售时间', trigger: 'change' }],
        selectShop: [{ validator: (rule, value, callback) => {
          if (value.length > 0) {
            callback()
          } else {
            callback(new Error('请选择预售商品'))
          }
        },
        trigger: 'change'
        }],
        trade_tag_content: [{ validator: (rule, value, callback) => {
          if (value !== '') {
            if (value.length > 255) {
              callback(new Error('长度在 1 到 255 个字符'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        },
        trigger: 'blur'
        }],
        giftList: [{ validator: (rule, value, callback) => {
          let valName = ''
          for (let gift of value) {
            if (gift.name === '') {
              valName = '请输入赠品名称'
              break
            }
            if (gift.code === '') {
              valName = '请输入商家编码'
              break
            }
            if (gift.num === '') {
              valName = '请输入件数'
              break
            } else if (!/(^[1-9]\d*$)/.test(gift.num)) {
              valName = '请输入正确件数'
              break
            }
          }
          if (valName !== '') {
            callback(new Error(valName))
          } else {
            callback()
          }
        },
        trigger: 'blur'
        }],
        trade_tag_name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (vm.model.trade_tag_type === '0') {
              vm.$http.fetch(vm.$api.kdjl.jlOrderTag.checkTagName, { tagName: value, tagType: vm.model.trade_tag_type })
                .then((resp) => {
                  if (resp.code === ErrorCode.TITLE_REPEAT) {
                    callback(new Error(resp.msg))
                  } else {
                    callback()
                  }
                }).catch((resp) => {
                  callback(new Error(resp.msg))
                }).finally()
            } else {
              callback()
            }
          },
          trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'model.shop_id': function () {
      this.model.selectShop = []
    }
  },
  methods: {
    change (obj) {
      vm.$refs['form'].clearValidate()
      switch (obj) {
        case '1': vm.model.trade_tag_name = '预售'; break
        case '2': vm.model.trade_tag_name = '赠品'; break
        default: break
      }
    },
    add: function () {
      if (JSON.stringify(vm.copyModel) === '{}') {
        vm.copyModel = JSON.parse(JSON.stringify(vm.model))
      }
      vm.visible = true
    },
    addGift () {
      vm.model.giftList.push({ name: '', num: '', code: '', remark: '' })
    },
    delGift (index) {
      vm.model.giftList.splice(index, 1)
    },
    shopItem () {
      if (!vm.model.shop_id) {
        vm.$notify.warning('请选择店铺')
      }
    },
    setContent () {
      switch (vm.model.trade_tag_type) {
        case '1': {
          let content = {
            estimateDate: moment(vm.model.saleTime).format('YYYY-MM-DD hh:mm:ss'),
            item: []
          }
          for (let item of vm.model.selectShop) {
            content.item.push({ itemId: item.sysGoodsId, Title: item.title })
          }
          vm.model.trade_tag_content = JSON.stringify(content)
          break
        }
        case '2': {
          let gift = { giftList: vm.model.giftList }
          vm.model.trade_tag_content = JSON.stringify(gift)
          break
        }
        default: break
      }
    },
    onSave: function () { // 保存
      vm.$refs['form'].validate((valid) => {
        if (valid) {
          vm.setContent()
          vm.loading = true
          vm.$http.fetch(vm.$api.kdjl.jlOrderTag.save, vm.model)
            .then((resp) => {
              vm.$notify.success(resp.msg)
              vm.$refs.order.$reload()
              vm.onClose()
            }).catch((resp) => {
              vm.$notify.error(resp.msg)
            }).finally(() => {
              vm.loading = false
            })
        } else {
          return false
        }
      })
    },
    onClose: function () { // 关闭
      vm.$refs['form'].resetFields()
      vm.model = JSON.parse(JSON.stringify(vm.copyModel))
      vm.visible = false
    }
  },
  created: function () {
    vm = this
    vm.$http.fetch(vm.$api.core.common.queryShopListForTopByBrand)
      .then((resp) => {
        vm.shops = resp.result
      }).catch((resp) => {
        vm.$notify.error(resp.msg)
      }).finally()
  },
  mounted: function () {
  }
}
