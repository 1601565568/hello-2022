import tableMixin from 'mixins/table'
export default {
  name: 'NsTableMaterialSubdivision',
  mixins: [tableMixin],
  props: {
    url: Object
  },
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {
      }
    ]
    const operateButtons = [
      {
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
    let model = Object.assign({}, {
      'name': null
    }, {})
    let rules = {
      'name': [
        {required: true, message: '请输入分组名称', trigger: 'blur'},
        {min: 0, max: 20, message: '长度在20个字符以内', trigger: 'blur'}
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
          if (item.type === 'radio') {
            that._data._table.quickSearchMap[item.name] = val
            that.$quickSearch$()
          }
        },
        enumerable: true
      })
    })
    return {
      title: '',
      transferWay: '1',
      brandId: null,
      dialogFormVisible: false,
      shopFormVisible: false,
      resignFormVisible: false,
      specifyTransferFormVisible: false,
      rules: rules,
      guideId: null,
      transferGuideId: null,
      row: null,
      guideList: [],
      shopList: [],
      shopFindList: [],
      guideShopList: [],
      model: model,
      quickSearchModel: quickSearchModel,
      state: {},
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: {expand: false}
    }
  },
  mounted: function () {
    var vm = this
    vm.querySubTableList(1)
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
    this.$refs.quickText.$el.onkeydown = function (event) {
      if (event.keyCode === 13) {
        return false
      }
    }
  },
  // 修改分组
  edit (row) {
    var that = this
    that.title = '修改分组'
    that.model.id = row.id
    that.model.name = row.name
    this.dialogFormVisible = true
  },
  computed: {},
  methods: {
    querySubTableList (brandId) {
      var _this = this
      _this.$http.fetch(_this.$api.guide.materialSubdivision.querySubTableList, {
        length: 100,
        searchMap: {
          brandId: brandId
        }
      }).then(resp => {
        if (resp.success && resp.result.data != null) {
          _this.querySubTableList = resp.result.data
        }
      }).catch((resp) => {
        _this.$message.error('查询失败：' + resp.msg)
      })
    },
    // 新增分组
    onAddGroup (row) {
      this.row = row
      this.title = '添加素材分组'
      this.model.id = null
      this.model.name = null
      this.model.sourceId = null
      this.dialogFormVisible = true
    },
    // 编辑
    on_Edit (row) {
      this.row = row
      this.title = '编辑分组'
      this.model.id = row.id
      this.model.name = row.name
      this.dialogFormVisible = true
    },
    onSave (row) {
      var that = this
      let id = that.model.id
      let name = that.model.name
      that.$refs.form.validate((valid) => {
        if (valid) {
          this.$http.fetch(this.$api.guide.materialSubdivision.saveMaterialSubdivision, {
            id: id,
            name: name
          }).then(resp => {
            that.dialogFormVisible = false
            that.$message.success('保存成功')
            this.$reload()
          }).catch((resp) => {
            that.$message.error('保存失败' + resp.msg)
          })
        }
      })
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    onUpdateGroup: function () {
      if (this.sels == null || this.sels.length < 1) {
        this.$message.error('请选择分组')
      } else {
        var ids = this.sels.map(item => item.id).join()
        var names = this.sels.map(item => item.name).join()
        var Sid = ids.split(',')
        // 删除任务
        this.$confirm('是否确认删除分组【' + names + '】？', '删除分组提示', {
          confirmButtonText: '确定',
          type: 'warning',
          cancelButtonText: '取消'
        }).then(() => {
          for (var i = 0; i < Sid.length; i++) {
            this.$http.fetch(this.$api.guide.materialSubdivision.deleteMaterialSubdivisionById, {id: Sid[i]})
              .then(resp => {
                this.$message.success('删除成功')
                this.$reload()
              }
              ).catch((resp) => {
                this.$message.error('删除失败：' + resp.msg)
              })
          }
        })
      }
    },
    //  删除分组
    onDeleteMaterialSubdivisionById: function (id, name) {
      var that = this
      var Sid = id
      // 删除任务
      that.$confirm('是否确认删除分组【' + name + '】？', '删除分组提示', {
        confirmButtonText: '确定',
        type: 'warning',
        cancelButtonText: '取消'
      }).then(() => {
        that.$http.fetch(that.$api.guide.materialSubdivision.deleteMaterialSubdivisionById, {id: Sid})
          .then(resp => {
            that.$message.success('删除成功')
            that.$reload()
          }).catch((resp) => {
            that.$message.error('删除失败：' + resp.msg)
          })
      })
    },
    // 解析后台传进来的字符串
    strToJson (str) {
      if (str && str.length > 0) {
        return JSON.parse(str)
      } else {
        return null
      }
    }
  }
}
