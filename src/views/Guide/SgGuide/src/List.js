import api from 'configs/http'
import moment from 'moment/moment'
export default {
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    let paginations = {
      enable: true,
      size: 10,
      sizeOpts: [5, 10, 15],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {
      }
    ]
    const operateButtons = [
      {
        'func': function () {
          this.$emit('add')
        },
        'name': '新增导购'
      }
    ]
    let quickInput = [{
      'template': '',
      'inline': false,
      'name': 'name',
      'text': '任务名称',
      'placeholder': '请输入任务名称',
      'type': 'text',
      'value': ''
    }]
    let quickSearchNames = quickInput.map(x => x.name)
    let quickSearchModel = {}
    let searchModel = {
      sgGuide: {
        brand_id: null,
        name: null,
        nickname: null,
        sex: 1,
        mobile: null,
        birthday: null,
        work_id: '',
        password: null,
        image: ''
      },
      sgGuideShop: {
        id: null,
        shop_id: null,
        job: 0
      }
    }
    let findVo = {
      'name': null,
      'shop': null,
      'job': null,
      'guideState': 1
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    let rules = {
      'name': [
        {required: true, message: '请输入姓名', trigger: 'blur'},
        {min: 0, max: 20, message: '已超过可输入长度', trigger: 'blur,change'}
      ],
      'shop': [
        {
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.model.sgGuideShop.shop_id === null || this.model.sgGuideShop.shop_id === 0) {
              callback(new Error('请选择所属店铺'))
            } else {
              callback()
            }
          }
        }
      ],
      'nickname': [
        {required: true, message: '请输入昵称', trigger: 'blur'},
        {min: 0, max: 20, message: '已超过可输入长度', trigger: 'blur,change'}
      ],
      'mobile': [
        {required: true, message: '请输入手机号', trigger: 'blur'},
        {pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号格式错误'}
      ]
    }
    let that = this
    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          // TODO 由于特殊需求导致以下列写法
          if (item.type === 'radio') {
            that._data._table.quickSearchMap[item.name] = val
            that.$quickSearch$()
          }
        },
        enumerable: true
      })
    })
    return {
      imageRoot: api.API_ROOT + '/core/file/showImage?fileKey=',
      title: '',
      transferWay: '1',
      brandId: null,
      dialogFormVisible: false,
      shopFormVisible: false,             //  店铺弹窗
      resignFormVisible: false,           // 导购离职弹窗
      specifyTransferFormVisible: false,  // 离职-指定转移弹窗
      customFormVisible: false,           // 离职-自定义转移弹窗
      customerIds: null,                  // 转移的客户ids，用逗号隔开
      allPageCustomer: [],                // 选择的所有的客户
      thisPageCustomer: [],               // 当前页面全选的客户
      pageChange: true,                   // 当前页数
      guideId: null,                      //  当前导购的id
      shopId: null,
      receiveGuideId: null,               //  接收的导购id
      customerTotal: null,
      rules: rules,
      row: null,
      guideList: [],
      shopList: [],
      shopFindList: [],
      guideShopList: [],
      tableDataCustomer: [],        // 客户集合
      model: model,
      quickSearchModel: quickSearchModel,
      state: {},
      _pagination: pagination,
      paginations: paginations,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      _queryConfig: {expand: false}
    }
  },
  methods: {
    initShopList () {
      var _this = this
      _this.$http.fetch(_this.$api.core.sysShop.getBrandList, {
        'length': 100000,
        'start': 0,
        searchMap: {
          'shopStatus': 1
        }
      }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindList = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    queryGuideShopList (guideId) {
      var _this = this
      _this.$http.fetch(this.$api.guide.guide.queryGuideShopList, {
        guide_id: guideId
      }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.guideShopList = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败,' + resp.msg)
      })
    },
    // 新增客户
    onAddCustomer (row) {
      this.row = row
      if (row) {
        this.title = '编辑导购信息'

        this.model.sgGuide = {
          id: row.id,
          name: row.name,
          nickname: row.nickname,
          sex: row.sex,
          mobile: row.mobile,
          birthday: row.birthday === null ? null : new Date(row.birthday),
          work_id: row.work_id,
          image: row.image
        }
        this.model.sgGuideShop = {
          id: row.gsId,
          job: row.job,
          shop_id: row.shop_id
        }
      } else {
        this.title = '新增导购信息'
        this.row = null
        Object.assign(this.$data.model, this.$options.data().model)
      }
      this.dialogFormVisible = true
    },
    onSave () {
      var _this = this
      var guide = this.model.sgGuide
      console.log('guide')
      console.log(guide)
      var guideShop = this.model.sgGuideShop
      var allImageUrl = null
      _this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (guide.birthday instanceof Date) {
            guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
          }
          if (guide.birthday === null) guide.birthday = ''
          if (guide.work_id === null) guide.work_id = ''
          this.$http.fetch(this.$api.guide.guide.saveOrUpdateGuide, {
            sgGuide: guide,
            sgGuideShop: guideShop
          }).then(resp => {
            _this.closeDialog()
            _this.$notify.success('保存成功')
            this.$refs.table.$reload()
          }).catch((resp) => {
            this.model.sgGuide.image = allImageUrl
            _this.$notify.error('保存失败：' + resp.msg)
          })
        }
      })
    },
    shopEdit (row) {
      var _this = this
      _this.row = row
      if (row) {
        _this.queryGuideShopList(row.id)
        _this.shopFormVisible = true
      }
    },
    // 离职js开始
    // 查询客户列表
    findCustomerList (page, pageSize) {
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.getBrandCustomerListByGuideId, {
        searchMap: {
          'guide_id': _this.guideId,
          'shop_id': _this.shopId,
          'pageSize': _this.paginations.size,
          'page': _this.paginations.size * (_this.paginations.page - 1)
        }
      }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.tableDataCustomer = resp.result.data
          _this.paginations.total = parseInt(resp.result.recordsTotal)
          _this.chooseCustomerFocus()
        }
      }).catch((resp) => {
        // _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    // 查询导购列表
    findGuideList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.findList, {
        searchMap: {
          'guideState': 1,
          'guideId': _this.guideId
        },
        length: 10000
      }).then(resp => {
        if (resp.success && resp.result.data != null) {
          _this.guideList = resp.result.data
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    quit (row) {
      var _this = this
      _this.transferWay = '1'
      _this.$http.fetch(_this.$api.guide.guide.getBrandCustomerTotal, {
        searchMap: {
          'guide_id': row.id,
          'shop_id': row.shop_id
        }
      }).then(resp => {
        if (resp.result.recordsFiltered > 0) {
          _this.guideId = row.id
          _this.shopId = row.shop_id
          _this.customerTotal = resp.result.recordsFiltered
          _this.resignFormVisible = true
        } else {
          _this.$confirm('请确认是否对 ' + row.name + ' 进行离职操作!', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var params = {
              transGuideId: row.id,
              transStatus: 0
            }
            _this.guideLeave(params, false)
          })
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    onConfirmResign () {
      var _this = this
      var status = _this.transferWay
      _this.resignFormVisible = false
      if (status === '1') {
        _this.averageTransfer()
      } else if (status === '2') {
        _this.findGuideList()
        _this.specifyTransferFormVisible = true
      } else if (status === '3') {
        _this.findCustomerList()
        _this.findGuideList()
        _this.customFormVisible = true
      }
    },
    // 平均转移
    averageTransfer () {
      var _this = this
      _this.$confirm('请确认是否对导购客户进行平均转移操作!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          transGuideId: _this.guideId,
          transStatus: 1,
          resource: 0
        }
        _this.guideLeave(params, false)
      })
    },
    // 取消指定转移
    onCancelSpecifyTransfer () {
      var _this = this
      _this.specifyTransferFormVisible = false
      _this.receiveGuideId = null
    },
    // 保存指定导购转移
    onSaveSpecifyTransfer () {
      var _this = this
      if (_this.receiveGuideId === null || _this.receiveGuideId === 0) {
        _this.$notify.error('请选择指定导购')
        return
      }
      var params = {
        transGuideId: _this.guideId,
        receiveGuideId: _this.receiveGuideId,
        transStatus: 2,  // 对应后台枚举
        resource: 0  // 对应后台枚举
      }
      _this.guideLeave(params, false)
    },
    // 关闭自定义转移弹窗
    onCancelCustomTransfer () {
      var _this = this
      _this.paginations = {
        enable: true,
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      }
      _this.customFormVisible = false
      _this.receiveGuideId = null
    },
    // 保存自定义转移客户
    onSaveCustomTransfer () {
      var _this = this
      var isLeave = false
      if (_this.allPageCustomer.length > 0) {
        if (_this.allPageCustomer.length === _this.paginations.total) {
          isLeave = true
        }
        for (let index = 0; index < _this.allPageCustomer.length; index++) {
          if (index === 0) {
            _this.customerIds = _this.allPageCustomer[index].id
          } else {
            _this.customerIds += ',' + _this.allPageCustomer[index].id
          }
        }
      } else {
        _this.$notify.error('请选择转移的客户')
        return
      }

      if (_this.receiveGuideId === null || _this.receiveGuideId === '') {
        _this.$notify.error('请选择转移的导购')
        return
      }
      var params = {
        customerIds: _this.customerIds,
        receiveGuideId: _this.receiveGuideId,
        transGuideId: _this.guideId,
        transStatus: 3,   // 对应后台枚举
        resource: 0,      // 对应后台枚举
        isLeave: isLeave
      }
      _this.guideLeave(params, isLeave)
    },
    // 导购离职
    guideLeave (data, isClose) {
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.updateGuideCustomer, data)
      .then(resp => {
        _this.paginations = {
          enable: true,
          size: 10,
          sizeOpts: [5, 10, 15],
          page: 1,
          total: 0
        }
        _this.receiveGuideId = null
        _this.customerIds = null
        _this.guideId = null
        _this.specifyTransferFormVisible = false
        _this.customFormVisible = false
        if (!isClose) {
          _this.$refs.table.$reload()
        }
        _this.$notify.success(resp.result)
      }).catch((resp) => {
        _this.$notify.error('修改失败 ' + resp.msg)
      })
    },
    // 分页-页数改变
    customerPageChange (page) {
      var _this = this
      _this.paginations.page = page
      _this.findCustomerList()
    },
    // 分页-大小改变
    customerSizeChange (pageSize) {
      var _this = this
      _this.paginations.size = pageSize
      _this.paginations.page = 1
      _this.findCustomerList()
    },
    // 利用map key的唯一性去重
    handRepeatCustomer (selected, unSelected) {
      var _this = this
      var map = new Map()
      var arrays = []
      if (unSelected !== null && unSelected !== undefined && unSelected.length > 0) {
        for (let x = 0; x < _this.allPageCustomer.length; x++) {
          for (let y; y < unSelected.length; y++) {
            if (_this.allPageCustomer[x].id === unSelected[y]) {
              _this.allPageCustomer.splice(x, 1)
              x--
            }
          }
        }
      } else {
        for (let x = 0; x < selected.length; x++) {
          map.set(selected[x].id + '', selected[x])
        }
        for (let y = 0; y < _this.allPageCustomer.length; y++) {
          map.set(_this.allPageCustomer[y].id + '', _this.allPageCustomer[y])
        }
        map.forEach(function (value, key, map) {
          arrays.push(value)
        })
        _this.allPageCustomer = arrays
      }
    },
    selectAll: function (selected) {
      var _this = this
      // 当前页全选
      if (selected.length !== 0) {
        var arrays = []
        for (var a = 0; a < selected.length; a++) {
          arrays.push(selected[a])
        }
        _this.thisPageCustomer = arrays
        if (_this.allPageCustomer.length > 0) {
          // 数组去重
          _this.handRepeatCustomer(arrays, null)
        } else {
          _this.allPageCustomer = arrays
        }
      } else {
        // 当前页全不选
        _this.handRepeatCustomer(null, _this.thisPageCustomer)
      }
    },
    selectRow: function (selected, row) {
      var _this = this
      _this.thisPageCustomer = selected
      if (row !== null) {
        for (let x = 0; x < _this.allPageCustomer.length; x++) {
          if (_this.allPageCustomer[x].id === row.id) {
            _this.allPageCustomer.splice(x, 1)
            break
          }
        }
      }
      if (selected.length > 0) {
        _this.handRepeatCustomer(selected, null)
      }
    },
    chooseCustomerFocus: function () {
      var _this = this
      if (_this.allPageCustomer.length > 0) {
        _this.tableDataCustomer.filter(function (item, index) {
          for (var i = 0; i < _this.allPageCustomer.length; i++) {
            if (_this.allPageCustomer[i].id === item.id) {
              setTimeout(function () {
                _this.$refs.chooseCustomer.toggleRowSelection(item)
              }, 0)
            }
          }
        })
      }
    },
    disabled (shopId) {
      let retVal = this.guideShopList.some(item => {
        return item.shopId === shopId
      })
      return retVal
    },
    thisGuideDisabled (guideId) {
      let retVal = this.guideShopList.some(item => {
        return item.id === guideId
      })
      return retVal
    },
    /**
     * 校验工号
     * @param list
     */
    workIdChange: function () {
      var _this = this
      // var regin = /^(0|[1-9][0-9]*)$/
      // var flag = regin.test(_this.model.sgGuide.work_id)
      var guideId = null
      if (_this.row != null) {
        guideId = _this.row.id
      }
      _this.$http.fetch(this.$api.guide.guide.checkGuideWorkId, {
        id: guideId,
        work_id: _this.model.sgGuide.work_id
      }).then((resp) => {
        if (resp.result !== '0') {
          _this.model.sgGuide.work_id = null
          this.$notify.info('工号存在，请重新输入')
        }
      }).catch((resp) => {
        this.$notify.error('校验工号失败' + resp.result)
      })
    },
    // 处理上传图片
    'handleAvatarSuccess': function (res, file) {
      var _this = this
      _this.model.sgGuide.image = res.result.url
    },
    closeDialog () {
      console.log('closeDialog')
      Object.assign(this.$data.model, this.$options.data().model)
      this.$refs.addForm.resetFields()
      this.dialogFormVisible = false
      this.row = null
    },
    beforeAvatarUpload (file) {
      if (file.size / 1024 > 200) {
        this.$notify.error('上传图片不得大于200KB')
        return false
      }
    }
    // uploadFile: function (file) {
    //   var _this = this
    //   let param = new FormData()
    //   param.append('file', file.file)
    //   _this.$http.fetch(this.$api.guide.guide.uploadImg, param)
    //   .then((resp) => {
    //     _this.model.sgGuide.image = _this.imageRoot + resp.result.fileKey
    //   }).catch((resp) => {
    //     this.$notify.error('上传图片失败' + resp.result)
    //   })
    // }
  },
  mounted: function () {
    var _this = this
    _this.initShopList()
  }
}
