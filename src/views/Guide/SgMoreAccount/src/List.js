export default {
  data: function () {
    let quickInput = [{
      'template': '',
      'inline': false,
      'name': 'name',
      'text': '任务名称',
      'placeholder': '请输入任务名称',
      'type': 'text',
      'value': ''
    }]
    let quickSearchModel = {}
    let searchModel = {
      sgGuide: {
        image: ''
      }
    }
    let findVo = {
      'shopName': null, // 门店名称
      'city': null, // 门点所在区域市
      'district': null, // 门点所在区域区
      'province': null, // 门点所在区域省
      'shopType': null, // 门店类型
      'phone': null, // 联系电话
      'area_region': null, // 所属地区
      'shopStatus': null, // 营业状态
      'area': [] // 所属区域
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    let that = this
    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          // todo 由于特殊需求导致以下列写法
          if (item.type === 'radio') {
            that._data._table.quickSearchMap[item.name] = val
            that.$quickSearch$()
          }
        },
        enumerable: true
      })
    })
    return {
      dialogFormVisible: false, // 点击上传弹窗
      model
    }
  },
  methods: {
    clickOnTheUpload (row) { // 点击上传按钮
      this.dialogFormVisible = true
    }
  },
  mounted: function () {
  }
}
