import tableMixin from 'web-crm/src/mixins/table'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'
export default {
  name: 'List',
  mixins: [tableMixin],
  data: function () {
    let that = this
    let tableButtons = [
      {
        'func': function () {
          that.onSaveOpen({})
        },
        'name': '新增话术',
      },
      {
        'func': function () {
          that.onPatchChangeOpen({})
        },
        'name': '批量管理'
      },
      {
        'func': function () {
          that.onPatchDelete({})
        },
        'name': '批量删除'
      }
    ]
    return {
      model: {
        id: null,
        wordGroupId: null,
        content: null,
        keyWord: null,
        addName: null,
        searchValue: null,
        param: {}
      },
      selectedArr: [],
      obj: {},
      parameter: {
        length: 10,
        searchMap: {},
        start: 0
      },
      addName: null,
      modelObj: {},
      index: 0,
      checkText: '',
      titleText: '',
      dialogFormVisible: false,
      dialogVisiblePatchChange: false,
      dialogVisible: false,
      loadingTable: false,
      tableList: [],
      wordGroupList: [],
      _table: {
        table_buttons: tableButtons
      },
      rules: {
        'wordGroupId': [{ required: true, message: '话术类别不能为空' }],
        'content': [{ required: true, message: '话术内容不能为空' }]
      }
    }
  },
  mounted: function () {
    this.findQuicklyWordGroupList()
    this.findAddName()
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  methods: {
    findAddName () {
      this.$http.fetch(this.$api.guide.findAddName, {}).then(resp => {
        if (resp.success && resp.result) {
          this.model.addName = resp.result
          this.addName = resp.result
        }
      })
    },
    findQuicklyWordGroupList () {
      this.$http.fetch(this.$api.guide.findQuicklyWordGroupList, {}).then(resp => {
        if (resp.success && resp.result.data.length > 0) {
          this.wordGroupList = resp.result.data
        }
      })
    },
    handleSelectionChange (val) {
      this.selectedArr = val
    },
    exchangeSort (type, id) {
      let parms = { type, id }
      this.$http
        .fetch(this.$api.guide.updateQuicklyWordSort, parms)
        .then(resp => {
          this.$reload()
        })
        .catch(resp => {
          this.$notify.error(resp.msg)
        })
    },
    closeDialog () {
      this.dialogFormVisible = false
      this.dialogVisiblePatchChange = false
      this.model = {
        id: null,
        wordGroupId: null,
        content: null,
        keyWord: null,
        addName: null,
        searchValue: null,
        param: {}
      }
    },
    onSaveOpen (row) { // 新增或编辑
      this.dialogFormVisible = true
      this.dialogVisiblePatchChange = false
      this.titleText = (row.id && '编辑') || '新增'
      this.model = Object.assign({}, row)
      if (!row || !row.id) {
        this.model.addName = this.addName
      }
    },
    onPatchChangeOpen () { // 批量管理
      if (!this.selectedArr.length > 0){
        this.$notify.warning("您没有选择任何数据")
        return
      }
      this.dialogVisiblePatchChange = true
      this.dialogFormVisible = false
      this.titleText = '批量管理'
    },
    onSave () { // 快捷话术保存功能
      let that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          that.$http.fetch(that.$api.guide.saveOrUpdateQuicklyWord, that.model).then(() => {
            that.closeDialog()
            that.$notify.success('保存成功')
            that.$reload()
          }).catch((resp) => {
            that.$notify.error(resp.msg || '保存失败')
          })
        }
      })
    },
    onPatchChange () { // 快捷话术批量管理
      let that = this
      let wordGroupId = that.model.wordGroupId
      let keyWord = that.model.keyWord
      let obj = { quicklyWordIds: '', wordGroupId: wordGroupId, keyWord: keyWord }
      let arr = []
      that.selectedArr.map(item => {
        arr.push(item.id)
      })
      obj.quicklyWordIds = arr.join(',')
      that.$http.fetch(that.$api.isv.delSysConfig, obj.then(() => {
        that.closeDialog()
        that.$notify.success('删除成功')
        that.$reload()
      }).catch((resp) => {
        that.$notify.error(resp.msg || '删除失败')
      }))
    },
    onDelete (row) { // 快捷话术删除
      apiRequestConfirm('永久删除该数据')
        .then(() => {
          let that = this
          that.$http.fetch(that.$api.guide.deleteQuicklyWord, { id: row.id }).then(() => {
            that.dialogFormVisible = false
            that.newestDialog = false
            that.$notify.success('删除成功')
            that.$reload()
          }).catch((resp) => {
            that.$notify.error(resp.msg || '删除失败')
          })
        }).catch(() => {
        // 点击取消事件
        })
    },
    onPatchDelete () { // 快捷话术批量删除
      if (!this.selectedArr.length > 0){
        this.$notify.warning("您没有选择任何数据")
        return
      }
      apiRequestConfirm('永久删除该数据')
        .then(() => {
          let that = this
          let obj = { quicklyWordIds: '' }
          let arr = []
          that.selectedArr.map(item => {
            arr.push(item.id)
          })
          obj.quicklyWordIds = arr.join(',')
          that.$http.fetch(that.$api.guide.patchDeleteQuicklyWord, obj).then(() => {
            that.closeDialog()
            that.$notify.success('删除成功')
            that.$reload()
          }).catch((resp) => {
            that.$notify.error(resp.msg || '删除失败')
          })
        }).catch(() => {
        // 点击取消事件
        })
    },
    /**
     * 处理请求参数
     * @param params
     * @returns {*}
     */
    $handleParams: function (params) {
      this.param = params
      if (params.searchMap && params.searchMap.time && params.searchMap.time.length > 0) {
        params.searchMap.timeStart = params.searchMap.time[0]
        params.searchMap.timeEnd = params.searchMap.time[1]
      }
      delete params.searchMap.time
      return params
    },
    $queryList$: function (params) {
      let that = this
      let tableConfig = this._data._table
      tableConfig.loadingtable = true
      return this.$http.fetch(this.$api.guide.findQuicklyWordList, params).then((resp) => {
        that._data._table.data = resp.result.data
        that._data._pagination.total = parseInt(resp.result.recordsTotal)
        if (that._data._pagination.total > 0) {
          that._data._table.key = 1
        } else if (that._data._pagination.total === 0) {
          that._data._table.key = 2
        }
      }).catch(() => {
        that.$notify.error('网络异常，获取数据失败！')
      }).finally(() => {
        tableConfig.loadingtable = false
      })
    }
  }
}
