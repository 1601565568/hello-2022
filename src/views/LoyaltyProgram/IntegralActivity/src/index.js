import formMixin from 'mixins/form'
import moment from 'moment'
import ErrorCode from 'configs/errorCode'

var vm
function checkNum () {
  return [
    {validator: (rule, value, callback) => {
      var reg1 = /^([+]?)\d*\.?\d+$/ // 验证数字
      var reg2 = /^\d+(?:\.\d{1,2})?$/  // 验证两位小数，小数可有可无，如果有最多两位
      if (!reg1.test(value)) {
        callback(new Error('请输入数字，且最多只能输入两位小数'))
      } else if (!reg2.test(value)) {
        callback(new Error('请输入数字，且最多只能输入两位小数'))
      } else if (value.toString().split('.').length > 2) {
        callback(new Error('请输入数字，且最多只能输入两位小数'))
      } else if (value.toString().split('.')[0].length >= 10) {
        callback(new Error('请输入小于10位的整数位'))
      } else {
        callback()
      }
    },
      trigger: 'blur'}]
}

function checked () {
  return [{validator: (rule, value, callback) => {
    if (value.length > 0) {
      if (value.length >= 10) {
        callback(new Error('请输入小于10位的整数'))
      } else {
        callback()
      }
    } else {
      callback(new Error('请选择活动条件'))
    }
  },
    trigger: 'blur'}]
}

function checkInt (value) {
  if (!/(^[1-9]\d*$)/.test(value)) {
    return false
  } else if (value.toString().length >= 10) {
    return false
  } else {
    return true
  }
}

function checkNumber (value) {
  var reg1 = /^([+]?)\d*\.?\d+$/ // 验证数字
  var reg2 = /^\d+(?:\.\d{1,2})?$/  // 验证两位小数，小数可有可无，如果有最多两位
  if (!reg1.test(value)) {
    return false
  } else if (!reg2.test(value)) {
    return false
  } else if (value.toString().split('.').length > 2) {
    return false
  } else if (value.toString().split('.')[0].length >= 10) {
    return false
  } else {
    return true
  }
}

function checkTrade (obj) {
  return [{validator: (rule, value, callback) => {
    if (vm.activity.checked.length > 0) {
      var result = vm.activity.checked.filter(function (indexObj) { if (indexObj === obj) { return obj } })
      if (result.length > 0) {
        switch (result[0]) {
          case '1': checkNumber(value) ? callback() : callback(new Error('请输入小于10位的整数位，且最多只能输入两位小数')); break
          case '2': checkInt(value) ? callback() : callback(new Error('请输入小于10位正整数')); break
          case '3': vm.activity.items.length > 0 ? callback() : callback(new Error('请选择商品')); break
          default: break
        }
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
    trigger: 'blur'}]
}

function checkGet (obj) {
  return [{validator: (rule, value, callback) => {
    if (vm.activity.getChecked.length > 0) {
      var result = vm.activity.getChecked.filter(function (indexObj) { if (indexObj === obj) { return obj } })
      if (result.length > 0) {
        switch (result[0]) {
          case '1': checkInt(value) ? callback() : callback(new Error('请输入小于10位的正整数')); break
          case '2': checkNumber(value) ? callback() : callback(new Error('请输入数字，且最多只能输入两位小数')); break
          case '3': checkNumber(value) ? callback() : callback(new Error('请输入数字，且最多只能输入两位小数')); break
        }
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
    trigger: 'blur'}]
}

function checkPut (obj) {
  return [{validator: (rule, value, callback) => {
    if (vm.activity.putChecked.length > 0) {
      var result = vm.activity.putChecked.filter(function (indexObj) { if (indexObj === obj) { return obj } })
      if (result.length > 0) {
        switch (result[0]) {
          case '1': checkInt(value) ? callback() : callback(new Error('请输入正整数')); break
          case '2': checkNumber(value) ? callback() : callback(new Error('请输入数字，且最多只能输入两位小数')); break
          case '3': checkNumber(value) ? callback() : callback(new Error('请输入数字，且最多只能输入两位小数')); break
        }
      } else {
        callback()
      }
    } else {
      callback()
    }
  },
    trigger: 'blur'}]
}

export default {
  mixins: [formMixin],
  data: function () {
    return {
      copyActivity: {},
      visible: false,
      title: '新增积分活动',
      weekValue: '1',
      week: [{value: '1', label: '星期一'}, {value: '2', label: '星期二'}, {value: '3', label: '星期三'}, {value: '4', label: '星期四'}, {value: '5', label: '星期五'}, {value: '6', label: '星期六'}, {value: '7', label: '星期日'}],
      dayValue: '1',
      day: [{value: '1', label: '1号'}, {value: '2', label: '2号'}, {value: '3', label: '3号'}, {value: '4', label: '4号'}, {value: '5', label: '5号'}, {value: '6', label: '6号'}, {value: '7', label: '7号'}, {value: '8', label: '8号'},
        {value: '9', label: '9号'}, {value: '10', label: '10号'}, {value: '11', label: '11号'}, {value: '12', label: '12号'}, {value: '13', label: '13号'}, {value: '14', label: '14号'}, {value: '15', label: '15号'}, {value: '16', label: '16号'},
        {value: '17', label: '17号'}, {value: '18', label: '18号'}, {value: '19', label: '19号'}, {value: '20', label: '20号'}, {value: '21', label: '21号'}, {value: '22', label: '22号'}, {value: '23', label: '23号'}, {value: '24', label: '24号'},
        {value: '25', label: '25号'}, {value: '26', label: '26号'}, {value: '27', label: '27号'}, {value: '28', label: '28号'}, {value: '29', label: '29号'}, {value: '30', label: '30号'}, {value: '31', label: '31号'}],
      monthDay: '01-01',
      tradeTitle: '倍',
      getTitle: '倍',
      putTitle: '折扣',
      shops: [],
      id: '',
      activity: {
        checked: [],
        getChecked: [],
        putChecked: [],
        items: [],
        shopSelect: '0', // 店铺选择全部或者部分
        activityType: 0,
        activityName: '',
        startTime: '',
        endTime: '',
        activityTimes: 0,
        isAllCrowd: 1,
        tradeRlue: '0',
        tradeIntegral: '',
        tradePrice: '',
        tradeNum: '',
        getRlue: '0',
        getIntegral: '',
        getNum: '',
        getGive: '',
        getTop: '',
        putRlue: '0',
        putIntegral: '',
        putNum: '',
        putGive: '',
        puTop: ''
      },
      pickerOptions0: {
        disabledDate: function (time) {
          var disabled = false
          disabled = time.getTime() <= (moment().toDate().getTime() - 24 * 60 * 60 * 1000)
          return disabled
        }
      },
      pickerOptions1: {
        disabledDate: function (time) {
          var disabled = false
          if (vm.activity.startTime) {
            disabled = time.getTime() <= (moment(vm.activity.startTime).toDate().getTime() - 24 * 60 * 60 * 1000)
          } else {
            disabled = time.getTime() <= (moment().toDate().getTime() - 24 * 60 * 60 * 1000)
          }
          return disabled
        }
      },
      saveLoading: false,
      rules: {
        activityName: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'},
          {validator: (rule, value, callback) => {
            vm.$http.fetch(vm.$api.integral.integralActivity.queryByActivityName, {activityName: value, type: vm.activity.activityType, id: vm.id})
                .then((resp) => {
                  if (resp.code === ErrorCode.TITLE_REPEAT) {
                    callback(new Error(resp.msg))
                  } else {
                    callback()
                  }
                }).catch((resp) => {
                  callback(new Error(resp.msg))
                }).finally()
          }}
        ],
        startTime: [
          {required: true, message: '请选择开始时间', trigger: 'change'}
        ],
        endTime: [
          {required: true, message: '请选择结束时间', trigger: 'change'},
          {validator: (rule, value, callback) => {
            var start = this.activity.startTime
            if (start !== '') {
              if (moment(value).toDate().getTime() > moment(start).toDate().getTime()) {
                callback()
              } else {
                callback(new Error('结束时间必须大于开始时间'))
              }
            } else {
              callback()
            }
          },
            trigger: 'change'}
        ],
        tradeNum: checkTrade('2'),
        tradePrice: checkTrade('1'),
        items: checkTrade('3'),
        getNum: checkGet('1'),
        getGive: checkGet('2'),
        getTop: checkGet('3'),
        putNum: checkPut('1'),
        putGive: checkPut('2'),
        putTop: checkPut('3'),
        tradeIntegral: checkNum(),
        getIntegral: checkNum(),
        putIntegral: checkNum(),
        shopSelect: [{ required: true, message: '请选择商品', trigger: 'change' }],
        checked: checked(),
        getChecked: checked(),
        putChecked: checked()
      }
    }
  },
  watch: {
    'activity.items': function (old, newObj) {
      let checked = vm.activity.checked.filter(obj => obj === '3')
      if (vm.activity.items.length > 0) {
        if (checked.length === 0) {
          vm.activity.checked.push('3')
        }
      } else {
        vm.activity.checked.forEach((item, index) => {
          if (item === '3') {
            vm.activity.checked.splice(index, 1)
          }
        })
      }
    }
  },
  methods: {
    startChange (obj) {
      // var time = moment(obj).format('HH:mm:ss')
      if (obj !== null) {
        if (obj.getTime() >= new Date().getTime()) {
          return obj
        } else {
          let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          vm.activity.startTime = date
        }
      }
      // var timestamp = parseInt(time.split(':')[0] * 60 * 60) + parseInt(time.split(':')[1] * 60) + parseInt(time.split(':')[2])
      // if (obj.getTime() < moment(obj).toDate().getTime() + (24 * 60 * 60 - timestamp) * 1000) {
      //  var now = moment(obj).toDate().getTime() + (24 * 60 * 60 - timestamp) * 1000
      //  vm.activity.startTime = new Date(now)
      // } else {
      //  return obj
      // }
    },
    endChange (obj) {
      if (obj !== null) {
        if (vm.activity.startTime) {
          if (moment(vm.activity.startTime).toDate().getTime() < moment(obj).toDate().getTime()) {
            return obj
          } else {
            vm.activity.endTime = new Date()
          }
        } else {
          vm.activity.endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    },
    tradeChange (obj) {
      if (obj === '0') {
        vm.tradeTitle = '倍'
      } else {
        vm.tradeTitle = '积分'
      }
    },
    getChange (obj) {
      if (obj === '0') {
        vm.getTitle = '倍'
      } else {
        vm.getTitle = '积分'
      }
    },
    putChange (obj) {
      if (obj === '0') {
        vm.putTitle = '折扣'
      } else {
        vm.putTitle = '积分'
      }
    },
    change: function () {
      this.$refs['form'].clearValidate()
    },
    addActivity: function () {
      this.title = '新增积分活动'
      if (JSON.stringify(vm.copyActivity) === '{}') {
        vm.copyActivity = JSON.parse(JSON.stringify(vm.activity))
      }
      this.visible = true
    },
    updateActivity: function (obj) {
      if (JSON.stringify(vm.copyActivity) === '{}') {
        var data = JSON.parse(JSON.stringify(vm.activity))
        vm.copyActivity = data
      }
      this.title = '修改积分活动'
      var activity = vm.activity
      vm.id = obj.id
      activity.activityName = obj.integral_activities_name
      activity.activityType = obj.integral_activities_type
      activity.activityTimes = obj.integral_activities_times
      switch (obj.integral_activities_times) {
        case 1: vm.weekValue = obj.integral_activities_times_config; break
        case 2: vm.dayValue = obj.integral_activities_times_config; break
        case 3: vm.monthDay = obj.integral_activities_times_config; break
      }
      vm.setDeatil(obj)
      activity.startTime = moment(obj.start_time)
      activity.endTime = moment(obj.end_time)
      activity.isAllCrowd = obj.is_all_crowd
      this.visible = true
    },
    setDeatil (obj) {
      var json = JSON.parse(obj.integral_activities_rule)
      switch (obj.integral_activities_type) {
        case 0: { vm.activity.tradeRlue = json.type; vm.activity.tradeIntegral = json.amount; vm.tradeChange(json.type); vm.setTradeDetail(obj); break }
        case 1: { vm.activity.getRlue = json.type; vm.activity.getIntegral = json.amount; vm.getChange(json.type); vm.setGetTradeDetail(obj); break }
        case 2: { vm.activity.putRlue = json.type; vm.activity.putIntegral = json.amount; vm.putChange(json.type); vm.setPutTradeDetail(obj); break }
      }
    },
    setTradeDetail (obj) {
      var checked = []
      var json = JSON.parse(obj.integral_activities_condition)
      if (typeof (json.orderPrice) !== 'undefined') {
        checked.push('1')
        vm.activity.tradePrice = json.orderPrice
      }
      if (typeof (json.orderAmount) !== 'undefined') {
        checked.push('2')
        vm.activity.tradeNum = json.orderAmount
      }
      if (typeof (json.itemType) !== 'undefined') {
        checked.push('3')
        vm.activity.shopSelect = json.itemType.toString()
        vm.$http.fetch(vm.$api.database.goods.getGoodsByIds, {sysGoodIds: json.items})
          .then((resp) => {
            vm.activity.items = resp.result
          }).catch((resp) => {
            vm.$notify.error(resp.msg)
          }).finally()
      }
      if (obj.is_all_shop === 0) {
        vm.$http.fetch(vm.$api.core.sysShop.getShopByIds, {ids: obj.shop_range})
          .then((resp) => {
            vm.shops = resp.result
          }).catch((resp) => {
            vm.$notify.error(resp.msg)
          }).finally()
      }
      vm.activity.checked = checked
    },
    setGetTradeDetail (obj) {
      var checked = []
      var json = JSON.parse(obj.integral_activities_condition)
      if (typeof (json.times) !== 'undefined') {
        checked.push('1')
        vm.activity.getNum = json.times
      }
      if (typeof (json.everyDayRange) !== 'undefined') {
        checked.push('2')
        vm.activity.getGive = json.everyDayRange
      }
      if (typeof (json.totalRange) !== 'undefined') {
        checked.push('3')
        vm.activity.getTop = json.totalRange
      }
      vm.activity.getChecked = checked
    },
    setPutTradeDetail (obj) {
      var checked = []
      var json = JSON.parse(obj.integral_activities_condition)
      if (typeof (json.times) !== 'undefined') {
        checked.push('1')
        vm.activity.putNum = json.times
      }
      if (typeof (json.everyDayRange) !== 'undefined') {
        checked.push('2')
        vm.activity.putGive = json.everyDayRange
      }
      if (typeof (json.totalRange) !== 'undefined') {
        checked.push('3')
        vm.activity.putTop = json.totalRange
      }
      vm.activity.putChecked = checked
    },
    onSave: function () {
      vm.$refs.form.validate((valid) => {
        if (valid) {
          var activities = {
            integral_activities_type: vm.activity.activityType,
            integral_activities_name: vm.activity.activityName,
            integral_activities_times: vm.activity.activityTimes,
            integral_activities_times_config: vm.selectConfig(vm.activity.activityTimes),
            start_time: moment(vm.activity.startTime).format('YYYY-MM-DD HH:mm:ss'),
            end_time: moment(vm.activity.endTime).format('YYYY-MM-DD HH:mm:ss'),
            is_all_crowd: vm.activity.isAllCrowd,
            integral_activities_rule: JSON.stringify(vm.setRule()),
            integral_activities_condition: JSON.stringify(vm.setCondition()),
            is_all_shop: vm.activity.activityType === 0 ? (vm.shops.length > 0 ? 0 : 1) : 1,
            shop_range: vm.activity.activityType === 0 ? (vm.shops.length > 0 ? vm.shops.map(shop => { return shop.id }).join(',') : '') : ''
          }
          if (vm.id !== '') {
            activities.id = vm.id
          }
          vm.saveLoading = true
          vm.$http.fetch(vm.$api.integral.integralActivity.saveOrUpdate, activities)
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
          return false
        }
      })
    },
    setCondition () {
      switch (vm.activity.activityType) {
        case 0: return vm.setTradeCondition()
        case 1: return vm.setgetTradeCondition()
        case 2: return vm.setPutTradeCondition()
      }
    },
    setTradeCondition () {
      var data = {}
      for (let index of vm.activity.checked) {
        switch (index) {
          case '1': data.orderPrice = vm.activity.tradePrice; break
          case '2': data.orderAmount = vm.activity.tradeNum; break
          case '3': data.itemType = vm.activity.shopSelect; data.items = vm.activity.items.map(item => { return item.sysGoodsId }).join(','); break
          default: break
        }
      }
      return data
    },
    setgetTradeCondition () {
      var data = {}
      for (let index of vm.activity.getChecked) {
        switch (index) {
          case '1': data.times = vm.activity.getNum; break
          case '2': data.everyDayRange = vm.activity.getGive; break
          case '3': data.totalRange = vm.activity.getTop; break
          default: break
        }
      }
      return data
    },
    setPutTradeCondition () {
      var data = {}
      for (let index of vm.activity.putChecked) {
        switch (index) {
          case '1': data.times = vm.activity.putNum; break
          case '2': data.everyDayRange = vm.activity.putGive; break
          case '3': data.totalRange = vm.activity.putTop; break
          default: break
        }
      }
      return data
    },
    setRule () {
      switch (vm.activity.activityType) {
        case 0: return {type: vm.activity.tradeRlue, amount: vm.activity.tradeIntegral}
        case 1: return {type: vm.activity.getRlue, amount: vm.activity.getIntegral}
        case 2: return {type: vm.activity.putRlue, amount: vm.activity.putIntegral}
      }
    },
    selectConfig (obj) {
      switch (obj) {
        case 0: return ''
        case 1: return vm.weekValue
        case 2: return vm.dayValue
        case 3: return moment(vm.monthDay).format('MM-DD')
      }
    },
    onClose: function () {
      this.monthDay = '01-01'
      this.tradeTitle = '倍'
      this.getTitle = '倍'
      this.putTitle = '折扣'
      this.shops = []
      this.weekValue = '1'
      this.dayValue = '1'
      this.id = ''
      vm.activity = JSON.parse(JSON.stringify(vm.copyActivity))
      this.$refs['form'].resetFields()
      this.visible = false
    }
  },
  created: function () {
    vm = this
  },
  mounted: function () {}
}
