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
      'image': null,
      'id': null
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
      dialogUploadVisible: false, // 点击上传弹窗
      model: null,
      dayNum: null, // 每日透出次数
      weight: null, // 权重
      id: null,
      changeText: '每日透出次数'
    }
  },
  methods: {
    ElSliderChange (val, row) {
      this.weight = Number(val)
      this.id = row.id
      this.changeText = '投出权重'
      this.updateMoreAccount()
    },
    BlurIput (val, row) {
      this.dayNum = Number(val)
      this.id = row.id
      this.changeText = '每日透出次数'
      this.updateMoreAccount()
    },
    async updateMoreAccount () { // 修改权重或者透出次数
      let _this = this
      await _this.$http.fetch(_this.$api.guide.guide.updateMoreAccount, {
        dayNum: _this.dayNum,
        id: _this.id,
        weight: _this.weight
      }).then(resp => {
        if (resp.success) {
          _this.$notify.success(this.changeText + '设置成功!：' + resp.msg)
          _this.$refs.table.$reload()
        }
      }).catch((resp) => {
        _this.$notify.error(this.changeText + '设置失败!: ' + resp.msg)
      })
    },
    handleRemove (file, fileList) {
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    uploadFile (row) {
      var _this = this
      _this.dialogUploadVisible = true
    },
    onSaveImage () {
    },
    closeDialog () {
      var _this = this
      _this.dialogUploadVisible = false
    }
  },
  mounted: function () {
  }
}
