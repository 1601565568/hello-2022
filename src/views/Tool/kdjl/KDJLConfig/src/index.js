import formMixin from 'mixins/form'
import store from 'store/dist/store.legacy.min.js'

var vm
function check () {
  return [
    { validator: (rule, value, callback) => {
      var reg1 = /^(-)?\d+(\.\d+)?$/ // 验证数字
      var reg2 = /^\d+(?:\.\d{1,2})?$/ // 验证两位小数，小数可有可无，如果有最多两位
      if (!reg1.test(value)) {
        callback(new Error('请输入数字，且最多只能输入两位小数'))
      } else if (!reg2.test(value)) {
        callback(new Error('请输入数字，且最多只能输入两位小数'))
      } else if (parseFloat(value) === 0) {
        callback(new Error('请输入大于0的数字,且最多只能输入两位小数'))
      } else if (value.toString().split('.').length > 2) {
        callback(new Error('请输入数字，且最多只能输入两位小数'))
      } else if (value.toString().split('.')[0].length >= 10) {
        callback(new Error('请输入小于10位的整数位'))
      } else {
        callback()
      }
    },
    trigger: 'blur' }]
}
export default {
  mixins: [formMixin],
  data: function () {
    return {
      shops: [],
      shopName: '',
      area: [{ area: [] }],
      loading: false,
      key: {
        children: 'children',
        label: 'label',
        value: 'id',
        disabled: 'disabled'
      },
      copyModel: {},
      shopId: '',
      model: {
        id: '',
        isOpenBulletin: false,
        isCheckAddrWithMemo: false,
        isTownAddrConfirm: false,
        is_most_service_warn: '1',
        is_trade_weigh: '1',
        is_send_addr_with_memo: '1',
        is_with_service_nick: '1',
        is_with_time: '1',
        auto_flag: 0,
        is_open_bulletin: '',
        jingling_bulletin: '',
        is_check_addr_with_memo: '1',
        check_addr_with_memo: '',
        is_town_addr_confirm: '1',
        town_addr_confirm_context: '',
        is_auto_generate_memo: '1',
        deliver_goods_areas: ''
      },
      show: false,
      companyData: [],
      company: [],
      companyTag: [],
      showProvince: false,
      checkProvinces: [],
      checkProvince: '',
      provinceTable: [],
      provinceCopy: [],
      feeShow: false,
      title: '', // 设置标题
      width: '', // 设置宽度
      fee: {
        province_id: '',
        id: '',
        shop_id: '',
        province: '',
        first_weight: 0,
        first_weight_price: 0,
        transportation: '',
        continue_weight_price: 0,
        status: '',
        province_from_id: '',
        company_code: ''
      },
      rules: {
        first_weight: check(),
        first_weight_price: check(),
        continue_weight_price: check(),
        transportation: [{ min: 0, max: 200, message: '长度小于 200 个字符', trigger: 'blur' }],
        status: [{ min: 0, max: 200, message: '长度小于 200 个字符', trigger: 'blur' }]
      },
      oldCompany: [],
      oldArea: []
    }
  },
  methods: {
    handleClick (obj) {
      if (vm.checkProvince !== '') {
        vm.fee.id = obj.id
        vm.fee.province_id = obj.value
        vm.fee.province = obj.province
        vm.fee.first_weight = obj.first_weight
        vm.fee.first_weight_price = obj.first_weight_price
        vm.fee.transportation = obj.transportation
        vm.fee.continue_weight_price = obj.continue_weight_price
        vm.fee.status = obj.status
        vm.feeShow = true
      } else {
        vm.$notify.warn('请先设置店铺发货地址')
      }
    },
    saveFee () {
      vm.fee.province_from_id = vm.checkProvince.split(';')[2]
      vm.$refs.fee.validate((valid) => {
        if (valid) {
          vm.fee.first_weight = vm.fee.first_weight.toString().replace(/\b(0+)/gi, '')
          vm.fee.first_weight_price = vm.fee.first_weight_price.toString().replace(/\b(0+)/gi, '')
          vm.fee.continue_weight_price = vm.fee.continue_weight_price.toString().replace(/\b(0+)/gi, '')
          vm.$http.fetch(vm.$api.kdjl.baseSetting.saveOrUpdateFee, vm.fee)
            .then((resp) => {
              vm.$notify.success(resp.msg)
              vm.provinceTable.forEach(function (val, i) {
                if (vm.fee.province_id === val.value) {
                  let obj = {
                    value: vm.fee.province_id,
                    province: vm.fee.province,
                    first_weight: vm.fee.first_weight,
                    first_weight_price: vm.fee.first_weight_price,
                    transportation: vm.fee.transportation,
                    continue_weight_price: vm.fee.continue_weight_price,
                    status: vm.fee.status
                  }
                  vm.provinceTable.splice(i, 1, obj)
                  return false
                }
              })
            }).catch((resp) => {
              vm.$notify.error(resp.msg)
            }).finally(() => {
              vm.fee.province_from_id = ''
              vm.fee.id = ''
              vm.fee.value = ''
              vm.fee.province = ''
              vm.fee.first_weight = 0
              vm.fee.first_weight_price = 0
              vm.fee.transportation = 0
              vm.fee.continue_weight_price = 0
              vm.closeFee()
            })
        } else {
          return false
        }
      })
    },
    closeFee () {
      this.$refs['fee'].resetFields()
      vm.feeShow = false
    },
    showCompany () {
      vm.showProvince = false
      vm.width = '600px'
      vm.title = '选择本店铺合作的物流信息'
      vm.show = true
    },
    closeCompany (obj) {
      vm.company.splice(obj, 1)
      vm.companyTag.splice(obj, 1)
      vm.show = false
    },
    checkCompany () {
      let isExt = true
      vm.area.forEach(function (old) {
        let ext = vm.oldArea.filter(function (index) {
          return old.area.join(';') === index.area.join(';')
        })
        if (ext.length === 0) {
          isExt = false
          return false
        }
      })
      return isExt
    },
    showSetting (obj) {
      if (vm.oldArea[0].area.length > 0 && vm.checkCompany()) {
        vm.showProvince = true
        vm.checkProvinces.splice(0, vm.checkProvinces.length)
        vm.checkProvince = ''
        let ext = vm.oldCompany.filter(function (index) {
          return index.code === obj.code
        })
        vm.fee.company_code = obj.code
        if (ext.length > 0) {
          let areaData = store.get('DS_area')
          if (vm.area[0].area.length > 0) {
            for (let index of vm.area) {
              let province = areaData.filter(obj => obj.id === index.area[0])
              let city = province[0].children.filter(obj => obj.id === index.area[1])
              let district = city[0].children.filter(obj => obj.id === index.area[2])
              let ext = vm.checkProvinces.filter(obj => obj.key === index.area.join(';'))
              if (ext.length === 0) {
                vm.checkProvinces.push({
                  key: index.area.join(';'),
                  label: province[0].label + ' ' + city[0].label + ' ' + district[0].label
                })
              }
            }
            vm.checkProvince = vm.checkProvinces[0].key
          }
          vm.setFee(vm.checkProvinces[0].key)
          vm.width = '770px'
          vm.title = '【' + obj.name + '】' + '物流公司配置'
        } else {
          vm.$notify.warning('请先保存物流公司再开始配置物流公司信息！')
        }
      } else {
        vm.$notify.warning('请先保存所在地区再开始配置物流公司信息！')
      }
    },
    change (obj) {
      vm.setFee(obj)
    },
    setFee (form) {
      vm.provinceTable = JSON.parse(JSON.stringify(vm.provinceCopy))
      vm.fee.shop_id = vm.shopId
      vm.$http.fetch(vm.$api.kdjl.baseSetting.queryFee, { shopId: vm.fee.shop_id, code: vm.fee.company_code, from: form.split(';')[2] })
        .then((resp) => {
          let data = resp.result
          if (data != null && data.length > 0) {
            for (let indObj of data) {
              vm.provinceTable.forEach((province, index) => {
                if (indObj.province_id === province.value) {
                  let obj = {
                    id: indObj.id,
                    value: province.value,
                    province: province.province,
                    first_weight: indObj.first_weight,
                    first_weight_price: indObj.first_weight_price,
                    transportation: indObj.transportation,
                    continue_weight_price: indObj.continue_weight_price,
                    status: indObj.status
                  }
                  vm.provinceTable.splice(index, 1, obj)
                  return false
                }
              })
            }
          }
        }).catch((resp) => {
          vm.$notify.error(resp.msg)
        }).finally(() => {
          vm.show = true
        })
    },
    saveCompany () {
      vm.companyTag = []
      for (let i of vm.company) {
        for (let data of vm.companyData) {
          if (i === data.key) {
            vm.companyTag.push({
              name: data.label,
              code: data.key
            })
          }
        }
      }
      vm.show = false
    },
    getCompany () {
      vm.companyData = []
      vm.$http.fetch(vm.$api.kdjl.baseSetting.queryCompany)
        .then((resp) => {
          if (resp.result != null) {
            resp.result.forEach((city, index) => {
              vm.companyData.push({
                label: city.name,
                key: city.code,
                disable: false
              })
            })
          }
        }).catch((resp) => {
          vm.$notify.error(resp.msg)
        }).finally(() => {})
    },
    changeShop (obj) {
      vm.shopId = obj
      for (let shop of vm.shops) {
        if (shop.value === obj) {
          vm.shopName = shop.label
        }
      }
      vm.company = []
      vm.companyTag = []
      vm.area = []
      vm.setData()
    },
    setDefault (obj, index) {
      if (obj.length > 0) {
        var data = vm.area[index]
        vm.area.splice(index, 1)
        vm.area.unshift(data)
      } else {
        vm.$notify.warning('默认地址不能为空！')
      }
    },
    add () {
      vm.area.push({ area: [] })
    },
    deleteArea (index) {
      vm.area.splice(index, 1)
    },
    onSave () {
      if (vm.area.length > 0) {
        var deliverGoodsAreas = []
        for (let area of vm.area) {
          if (area.area.length > 0) {
            deliverGoodsAreas.push(area.area.join(';'))
          }
        }
        if (deliverGoodsAreas.length > 0) {
          vm.model.deliver_goods_areas = deliverGoodsAreas.join(',')
        }
      }
      vm.model.shop_id = vm.shopId
      vm.model.is_open_bulletin = vm.model.isOpenBulletin ? 1 : 0
      vm.model.is_check_addr_with_memo = vm.model.isCheckAddrWithMemo ? 1 : 0
      vm.model.is_town_addr_confirm = vm.model.isTownAddrConfirm ? 1 : 0
      vm.loading = true
      if (vm.companyTag.length > 0) {
        let express = ''
        for (let tag of vm.companyTag) {
          express += tag.code + '|' + tag.name + ','
        }
        vm.model.cooperation_express = express.slice(0, express.length - 1)
      } else {
        vm.model.cooperation_express = ''
      }
      vm.$http.fetch(vm.$api.kdjl.baseSetting.saveOrUpdate, vm.model)
        .then((resp) => {
          vm.model.id = resp.result
          vm.oldArea = JSON.parse(JSON.stringify([{ area: [] }]))
          vm.oldArea = JSON.parse(JSON.stringify(vm.area))
          vm.oldCompany = ''
          vm.oldCompany = JSON.parse(JSON.stringify(vm.companyTag))
          vm.$notify.success(resp.msg)
        }).catch((resp) => {
          vm.$notify.error(resp.msg)
        }).finally(() => {
          vm.loading = false
        })
    },
    setSaveCompany (obj) {
      if (obj.length > 0) {
        if (obj.split(',').length > 0) {
          for (let express of obj.split(',')) {
            if (express.split('|').length === 2) {
              vm.company.push(express.split('|')[0])
              vm.companyTag.push({
                name: express.split('|')[1],
                code: express.split('|')[0]
              })
            }
          }
        }
      }
      vm.oldCompany = JSON.parse(JSON.stringify(vm.companyTag))
    },
    setData () {
      vm.oldArea = vm.oldArea.splice(0, vm.oldArea.length)
      vm.$http.fetch(vm.$api.kdjl.baseSetting.queryByShopId, { shopId: vm.shopId })
        .then((resp) => {
          if (resp.result !== null) {
            var data = resp.result
            vm.model.id = data.id
            vm.model.is_most_service_warn = data.is_most_service_warn.toString()
            vm.model.is_trade_weigh = data.is_trade_weigh.toString()
            vm.model.is_send_addr_with_memo = data.is_send_addr_with_memo.toString()
            vm.model.is_with_service_nick = data.is_with_service_nick.toString()
            vm.model.is_with_time = data.is_with_time.toString()
            vm.model.auto_flag = data.auto_flag
            vm.model.jingling_bulletin = data.jingling_bulletin
            vm.model.isOpenBulletin = data.is_open_bulletin === 1
            vm.model.isCheckAddrWithMemo = data.is_check_addr_with_memo === 1
            vm.model.isTownAddrConfirm = data.is_town_addr_confirm === 1
            vm.model.check_addr_with_memo = data.check_addr_with_memo
            vm.model.town_addr_confirm_context = data.town_addr_confirm_context
            vm.model.is_auto_generate_memo = data.is_auto_generate_memo.toString()
            vm.model.deliver_goods_areas = data.deliver_goods_areas
            vm.model.is_auto_generate_memo = data.is_auto_generate_memo.toString()
            if (data.deliver_goods_areas !== null) {
              vm.area = []
              for (let area of data.deliver_goods_areas.split(',')) {
                vm.area.push({ area: area.split(';') })
              }
            } else {
              vm.area = [{ area: [] }]
            }
          } else {
            vm.area = [{ area: [] }]
          }
          vm.oldArea = JSON.parse(JSON.stringify(vm.area))
          if (typeof (data) !== 'undefined' && data.cooperation_express !== null) {
            vm.setSaveCompany(data.cooperation_express)
          }
        }).catch((resp) => {
          vm.$notify.error(resp.msg)
        }).finally()
    },
    getProvince () {
      vm.$http.fetch(vm.$api.core.common.queryProvince)
        .then((resp) => {
          for (let idx of resp.result) {
            vm.provinceTable.push({
              value: idx.value,
              province: idx.label,
              first_weight: '',
              first_weight_price: '',
              transportation: '',
              continue_weight_price: '',
              status: '',
              id: ''
            })
          }
        }).catch((resp) => {
          vm.$notify.error(resp.msg)
        }).finally(() => {
          vm.provinceCopy = JSON.parse(JSON.stringify(vm.provinceTable))
        })
    }
  },
  watch: {},
  created: function () {
    vm = this
    vm.getProvince()
    vm.copyModel = JSON.parse(JSON.stringify(vm.model))
    vm.$http.fetch(vm.$api.core.common.queryShopListForTopByBrand)
      .then((resp) => {
        vm.shops = resp.result
      }).catch((resp) => {
        vm.$notify.error(resp.msg)
      }).finally(() => {
        if (vm.shops.length > 0) {
          vm.shopId = vm.shops[0].value
          vm.shopName = vm.shops[0].label
          vm.setData()
        }
      })
    vm.getCompany()
  },
  mounted: function () {
  }
}
