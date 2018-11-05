import tableMixin from 'mixins/table'
import NsArea from 'components/NsArea'

export default {
  props: {
    url: Object
  },
  components: {NsArea},
  name: 'NsTableSgShop',
  mixins: [tableMixin],
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {}
    ]
    const operateButtons = [
      {}
    ]
    let findVo = {
      name: null,     // 门店名字
      status: null,   // 门店状态
      type: null,     // 门店类型0直营 1加盟
      brand_id: null // 品牌ID
    }
    let searchModel = {
      sgShop: {
        'id': null,
        'name': null,
        'address': null,
        'status': null,
        'type': null,
        'brand_id': null,
        'province': null,
        'city': null,
        'district': null,
        'guideIds': [], // 店长ID
        'guideNames': ''
      }
    }
    let quickSearchModel = {}
    let model = Object.assign({}, {}, findVo, searchModel)
    return {
      // selectedOptions3: [110000, 110100],
      key: {
        children: 'children',
        label: 'label',
        value: 'label',
        disabled: 'disabled'
      },
      area: [],
      titlename: '新增门店',
      count: 0,
      locals: 0,
      totalNum: 0,
      totalNumChooseShop: 0,
      cookieState: false,
      isOpen: false, // 搜索条件状态
      tableData: [],  // 门店列表数据
      tableDataChooseShop: [],  // 选择店长列表数据
      state: {},
      brandList: null,
      model: model,
      quickSearchModel: quickSearchModel,
      serchShop: {
        name: null,
        brand_id: null,
        page: 0,
        pageSize: 10
      },
      importVisible: {},
      rules: Object.assign({
        name: [
          {required: true, message: '请输入门店名称', trigger: 'blur'},
          {min: 1, max: 20, message: '长度在20个字符以内', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请输入详细地址', trigger: 'blur'},
          {min: 0, max: 50, message: '长度在50个字符以内', trigger: 'blur'}
        ]
      }, {}, {}),
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchMap: {}
      },
      _queryConfig: {expand: false},
      dialogFormVisible: false,
      dialogChooseShopVisible: false,
      diashopimportVisible: false
    }
  },
  mounted: function () {
    var vm = this
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
    vm.initBrandList()
  },
  computed: {},
  methods: {
    onChange (data) {
      console.log(data)
      let that = this
      that.model.sgShop.province = data[0]
      that.model.sgShop.city = data[1]
      that.model.sgShop.district = data[2]
    },
    clean () {
      this.locals = 0
      this.$refs.form.resetFields()
    },
    onImportshop () {
      this.diashopimportVisible = true
    },
    cancelchooseShop () {
      this.dialogChooseShopVisible = false
    },
    chooseShophandleCurrentChange (val) {
      this.serchShop.page = val
      this.chooseShopNamesFocus()
    },
    chooseShophandleSizeChange (val) {
      this.serchShop.pageSize = val
      this.chooseShopNamesFocus()
    },
    dialogFormVisiblex () {
      this.area = []
      this.locals = 0
      this.$refs.form.resetFields()
      this.dialogFormVisible = false
    },
    showHelp () {
      this.cookieState = !this.cookieState
    },
    onSuccess: function (response, file, fileList) {
      if (response.success) {
        this.diashopimportVisible = false
        this.$message.success(response.msg)
        this.$reload()
      } else {
        this.$message.error(response.msg)
      }
    },
    onProgress: function (event, file, fileList) {
      this.progressing = 0.5
    },
    onAddShop () {
      var that = this
      that.titlename = '新增门店'
      that.area = []
      that.locals = 2
      that.model.sgShop.id = null
      that.model.sgShop.name = null
      that.model.sgShop.address = null
      that.model.sgShop.district = null
      that.model.sgShop.city = null
      that.model.sgShop.province = null
      that.model.sgShop.status = 0
      that.model.sgShop.type = 0
      that.model.sgShop.guideIds = null
      that.model.sgShop.guideNames = null
      that.dialogFormVisible = true
    },
    editList () {
      let rows = this.$refs.shopForm.selection
      if (rows && rows.length) {
        this.dialogFormVisible = true
      } else {
        this.$message.warning('请选择至少一条记录')
      }
    },
    // 表单重置
    resetFun () {
      this.model.sgShop = {
        name: null,
        status: null,
        type: null,
        brand_id: this.brand_id,
        page: 1,
        pageSize: 10
      }
      this.$searchAction$()
    },
    // 选择店长表单重置
    resetShop () {
      this.serchShop = {
        name: null,
        status: null,
        type: null,
        brand_id: this.brand_id,
        page: 1,
        pageSize: 10
      }
      this.chooseShopNamesFocus()
    },
    edit (row) {
      var that = this
      that.area = []
      that.locals = 3
      that.titlename = '编辑门店'
      that.serchShop.page = 0
      that.serchShop.pageSize = 10
      that.model.sgShop.id = row.id
      that.model.sgShop.name = row.name
      that.model.sgShop.address = row.address
      that.model.sgShop.status = row.status
      that.model.sgShop.type = row.type
      that.model.sgShop.brand_id = row.brand_id
      that.model.sgShop.city = row.city
      that.model.sgShop.district = row.district
      that.model.sgShop.province = row.province
      this.area.push(row.province)
      this.area.push(row.city)
      this.area.push(row.district)
      if (row.guideId != null) {
        that.model.sgShop.guideIds = row.guideId.split(',')
      } else {
        that.model.sgShop.guideIds = row.guideId
      }
      that.model.sgShop.guideNames = row.guideNames
      this.dialogFormVisible = true
    },
    // 新增门店校验保存
    save: function () {
      var that = this
      that.$refs.form.validate(function (result) {
        if (result) {
          let shop = that.model.sgShop
          that.$http.fetch(that.$api.guide.shop.saveOrUpdateShop, {
            sgShop: shop
          }).then(resp => {
            that.dialogFormVisible = false
            that.$message.success(resp.msg)
            that.$reload()
          }).catch((resp) => {
            that.$message.error(resp.msg)
          })
        }
      })
    },
    // 保存选中店长的状态
    saveChooseShop () {
      var that = this
      this.model.guideNames = ''
      if (this.model.guideIds.length === 0) {
        that.dialogChooseShopVisible = false
      } else {
        let guideIds = this.model.guideIds
        this.$http.fetch(this.$api.guide.shop.findNameShop, {
          guideIds: guideIds
        })
        .then(resp => {
          that.$message.success(resp.msg)
          that.model.guideNames = resp.result
        }).catch((resp) => {
          that.$message.error(resp.msg)
        })
        that.dialogChooseShopVisible = false
      }
    },
    // 选中某行
    selectRow: function (selected, row) {
      var that = this
      var check = false
      for (var i = 0; i < selected.length; i++) {
        if (selected[i].id === row.id) {
          check = true
          break
        }
      }
      if (check) {
        if (that.model.guideIds == null) {
          that.model.guideIds = []
          that.model.guideIds.push(row.id)
        } else {
          that.model.guideIds.push(row.id)
        }
      } else {
        // 删除未勾选商品数据
        for (var j = 0; j < that.model.guideIds.length; j++) {
          if (that.model.guideIds[j] === row.id) {
            that.model.guideIds.splice(j, 1)
            break
          }
        }
      }
    },
    // 表格勾选所有数据
    selectAll: function (selected) {
      if (this.model.guideIds == null) {
        this.model.guideIds = []
      }
      if (selected.length === 0) {
        // 当前页全部不选中
        for (var i = 0; i < this.tableDataChooseShop.length; i++) {
          this.selectRow(selected, this.tableDataChooseShop[i])
        }
        ;
      } else {
        // 当前页全部选中
        for (let i = 0; i < selected.length; i++) {
          var c = true
          for (var j = 0; j < this.model.guideIds.length; j++) {
            if (selected[i].id === this.model.guideIds[j]) {
              c = false
              break
            }
          }
          if (c) {
            this.model.guideIds.push(selected[i].id)
          }
        }
      }
    },
    // 对选择的数据进行打√处理
    chooseShopNamesFocus: function () {
      // 判断已经有的店长
      var that = this
      if (that.count !== 1) {
        that.chooseShopfindList()
      }
      that.count = 0
      // 对数据进行处理，执行打√操作
      that.tableDataChooseShop.filter(function (item, index) {
        if (that.model.guideIds != null) {
          for (var k = 0; k < that.model.guideIds.length; k++) {
            if (that.model.guideIds[k] === item.id) {
              setTimeout(function () {
                that.$refs.shopFormChooseShop.toggleRowSelection(item)
              }, 0)
            }
          }
        }
      })
      this.dialogChooseShopVisible = true
    },
    // 删除门店
    deleteShop: function (id) {
      var that = this
      if (confirm('确定删除？')) {
        var shopId = id
        that.$http.fetch(that.$api.guide.shop.deleteShop, {shopId: shopId})
        .then((data) => {
          if (data.success === true) {
            that.dialogFormVisible = false
            that.$message.success(data.msg)
            that.findList()
          }
        }).catch((data) => {
          that.$message.error(data.msg)
        })
      }
    },
    // 查找门店列表
    findList () {
      // let that = this
      this.$http.fetch(this.$api.guide.shop.findList, {beanMap: this.model.sgShop}).then(resp => {
        if (resp.success && resp.result.data != null) {
          this.totalNum = resp.result.recordsTotal
          this.tableData = resp.result.data
          this.$reload()
        }
      })
    },
    // 文件上传-门店导入
    'saveImportShop': function () {
      if (this.$refs.shopFile.uploadFiles.length > 0) {
        this.$refs.shopFile.submit()
        this.diashopimportVisible = false
      } else {
        this.$message({
          message: '上传文件未选择！',
          type: 'warning'
        })
      }
    },
    // 选择店长列表
    chooseShopfindList: function (k) {
      const that = this
      that.$http.fetch(that.$api.guide.shop.queryGuideListByBrandId, {searchMap: that.serchShop})
      .then(data => {
        if (data.success && data.result != null) {
          that.totalNumChooseShop = data.result.count
          that.tableDataChooseShop = data.result.list
        }
        if (k === '009') {
          k = 0
          that.count = 1
          that.chooseShopNamesFocus()
        }
      })
    },
    // 初始化
    initBrandList () {
      const that = this
      this.$http.fetch(this.$api.guide.shop.initBrandList).then(data => {
        if (data.success && data.result != null) {
          if (data.result[0]) {
            // that.findVo.brandId = data.result[0].id
            that.model.sgShop.brand_id = 1
            // 店长给的品牌Id
            that.serchShop.brand_id = 1
            that.brandList = [{name: '测试品牌', id: 1}]
            // that.brandList = data.result
          }
        }
      })
    }
  }
}
