import tableMixin from 'web-crm/src/mixins/table'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'
import Emotion from './EmotionConfig.js' // 表情配置文件

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
        'name': '新增话术'
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
        content: '',
        keyWord: null,
        name: null,
        addName: null,
        searchValue: null,
        param: {}
      },
      addOrEditModel: {
        id: null,
        name: null
      },
      selectedArr: [],
      obj: {},
      parameter: {
        length: 15,
        searchMap: {},
        start: 0
      },
      emotionList: Emotion,
      addName: null,
      modelObj: {},
      allClassArr: { name: '全部分类', id: null, label: '全部分类' },
      newClassArr: { name: '请选择分类', id: null, label: '请选择分类' },
      InternetMemeShow: false,
      orignalGroup: null,
      orignalKeyWord: null,
      index: 0,
      checkText: '',
      titleText: '',
      dialogFormVisible: false,
      dialogVisiblePatchChange: false,
      dialogVisibleSaveQuicklyWordGroup: false,
      dialogVisible: false,
      offsetHeight: false,
      loadingTable: false,
      height: 0,
      showOrder: false,
      tableList: [],
      wordGroupList: null,
      selectwordGroupList: null,
      _table: {
        table_buttons: tableButtons
      },
      rules: {
        'wordGroupId': [{ required: true, message: '话术类别不能为空' }],
        'keyWord': [
          {
            validator: (rule, value, callback) => {
              if (this.model.keyWord !== '' && this.model.keyWord !== null) {
                if ((this.model.keyWord.split('，').length - 1) > 4) {
                  callback(new Error('关键词最多设置五个词'))
                } else if (this.model.keyWord.length > 25) {
                  callback(new Error('关键词长度在 25 以内'))
                }
              }
              callback()
            }
          }
        ],
        'content': [{ required: true, message: '话术内容不能为空' }],
        'name': [{ required: true, message: '分类内容不能为空' }]
      },
      addOrEditRules: {
        'name': [{ required: true, message: '分类内容不能为空' },
          { max: 10, message: '长度在 10 以内', trigger: 'blur' }]
      }
    }
  },
  updated () {
    this.$refs.elTree.offsetHeight > window.screen.availHeight ? this.offsetHeight = true : this.offsetHeight = false
  },
  mounted: function () {
    this.findQuicklyWordGroupList()
    this.findAddName()
    this.height = window.innerHeight - 170
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  methods: {
    renderHeader (h, data) {
      return h('div', { attrs: { class: 'cell' } }, [h('span', ['排序 ']), h('el-tooltip', { attrs: { class: 'el-icon-question bg-white', effect: 'light', content: '调整排列顺序小程序同步', placement: 'bottom' } }, [h('i', { 'class': 'el-icon-question', style: 'color:rgb(153, 153, 153)' })])])
    },
    onkeydown (e) {
      let key = window.event.keyCode
      if (key === 13) {
        return false
      }
    },
    faceFace () { // 表情头像按钮
      this.InternetMemeShow = !this.InternetMemeShow
    },
    setEmotionWords (list) { // 选中的表情添加按钮
      this.model.content = this.model.content + list
    },
    onClickNode (data) { // 树节点点击事件
      if (data.id !== null) {
        this.showOrder = true
      } else {
        this.showOrder = false
      }
      this.model.wordGroupId = data.id
      this.parameter.searchMap = this.model
      this.$queryList$(this.parameter)
    },
    deleteTheGroup (data) { // 树形菜单删除按钮
      this.$http.fetch(this.$api.guide.deleteQuicklyWordGroup, { id: data.id }).then(resp => {
        if (resp.success) {
          this.findQuicklyWordGroupList()
          this.$notify.success('删除分组成功')
        }
      }).catch(resp => {
        this.$notify.error(resp.msg || '删除失败')
      })
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      this.changeQuicklyWordGroupSort(draggingNode.data.id, dropNode.data.id)
    },
    allowDrop (draggingNode, dropNode, type) {
      return type !== 'inner' && dropNode.data.id !== null
    },
    allowDrag (draggingNode) {
      return draggingNode.data.id !== null
    },
    changeQuicklyWordGroupSort (startId, endId) {
      this.$http.fetch(this.$api.guide.changeQuicklyWordGroupSort, { startId: startId, endId: endId }).then(resp => {
        if (resp.success && resp.result) {
          this.model.addName = resp.result
          this.addName = resp.result
        }
      })
    },
    saveOrUpdateQuicklyWordGroup () {
      if (!(this.addOrEditModel.name.length > 10)) {
        this.$http.fetch(this.$api.guide.saveOrUpdateQuicklyWordGroup, this.addOrEditModel).then(resp => {
          if (resp.success) {
            this.addOrEditModel.id ? this.$notify.success('编辑成功') : this.$notify.success('新增成功')
            this.findQuicklyWordGroupList()
            this.closeDialog()
          }
        }).catch(resp => {
          this.addOrEditModel.id ? this.$notify.error(resp.msg || '编辑失败') : this.$notify.error(resp.msg || '新增失败')
        })
      }
    },
    findAddName () {
      this.$http.fetch(this.$api.guide.findAddName, {}).then(resp => {
        if (resp.success && resp.result) {
          this.model.addName = resp.result
          this.addName = resp.result
        }
      }).catch(resp => {
        this.$notify.warning(resp.msg || '系统异常')
      })
    },
    findQuicklyWordGroupList () {
      this.$http.fetch(this.$api.guide.findQuicklyWordGroupList, {}).then(resp => {
        if (resp.success && resp.result.data.length > 0) {
          resp.result.data.map(item => {
            item.shanchu1 = 'iconfont icon-shanchu1'
            item.bianji1 = 'iconfont icon-bianji1'
          })
          this.wordGroupList = resp.result.data
          this.selectwordGroupList = this.wordGroupList.slice(0)
          this.selectwordGroupList.unshift(this.newClassArr)
          this.wordGroupList.unshift(this.allClassArr)
        }
      }).catch(resp => {
        this.$notify.error(resp.msg || '系统异常')
      })
    },
    handleSelectionChange (val) {
      this.model.wordGroupId = null
      this.model.keyWord = null
      this.selectedArr = val
      if (this.selectedArr.length === 1) {
        this.model.keyWord = val[0].keyWord
        this.wordGroupList.map(item => {
          if (item.name === val[0].name) {
            this.model.wordGroupId = item.id
          }
        })
      }
    },
    exchangeSort (type, id, scope) {
      let parms = { type, id }
      this.$http.fetch(this.$api.guide.updateQuicklyWordSort, parms).then(resp => {
        this.$reload()
      }).catch(resp => {
        this.$notify.error(resp.msg || '系统异常')
      })
    },
    closeDialog () {
      this.dialogFormVisible = false
      this.dialogVisiblePatchChange = false
      this.dialogVisibleSaveQuicklyWordGroup = false
      this.model = {
        id: null,
        wordGroupId: null,
        content: '',
        keyWord: null,
        name: null,
        addName: null,
        searchValue: null,
        param: {}
      }
    },
    onSaveOpen (row) { // 新增或编辑
      let arr = Object.keys(row)
      this.dialogFormVisible = true
      this.dialogVisiblePatchChange = false
      this.titleText = (row.id && '编辑话术') || '新增话术'
      if (arr.length !== 0) {
        this.model = Object.assign({}, row)
      } else {
        this.model = {
          id: null,
          wordGroupId: null,
          content: '',
          keyWord: null,
          name: null,
          addName: null,
          searchValue: null,
          param: {}
        }
      }
      if (!row || !row.id) {
        this.model.addName = this.addName
      }
    },
    onSaveQuicklyWordGroupOpen (item) {
      this.addOrEditModel = {
        id: null,
        name: null
      }
      if (item.id) {
        this.addOrEditModel = {
          id: item.id,
          name: item.name
        }
      }
      this.titleText = (item.id && '编辑分类') || '新增分类'
      this.dialogVisibleSaveQuicklyWordGroup = true
      this.dialogFormVisible = false
      this.dialogVisiblePatchChange = false
    },
    onPatchChangeOpen () { // 批量管理
      if (!this.selectedArr.length > 0) {
        this.$notify.warning('请选择要操作的数据')
        return
      }
      this.dialogVisiblePatchChange = true
      this.dialogFormVisible = false
      this.titleText = '批量管理'
    },
    onSave () { // 快捷话术保存功能
      let that = this
      this.InternetMemeShow = false
      this.$refs.form.validate(valid => {
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
      if (this.model.keyWord !== null) {
        if ((this.model.keyWord.split('，').length - 1) < 4) {
          let obj = { quicklyWordIds: '', wordGroupId: wordGroupId, keyWord: keyWord }
          let arr = []
          that.selectedArr.map(item => {
            arr.push(item.id)
          })
          obj.quicklyWordIds = arr.join(',')
          that.$http.fetch(that.$api.guide.patchChange, obj).then(() => {
            that.closeDialog()
            that.$notify.success('保存成功')
            that.$reload()
          }).catch((resp) => {
            that.$notify.error(resp.msg || '保存失败')
          })
        }
      } else {
        let obj = { quicklyWordIds: '', wordGroupId: wordGroupId, keyWord: keyWord }
        let arr = []
        that.selectedArr.map(item => {
          arr.push(item.id)
        })
        obj.quicklyWordIds = arr.join(',')
        that.$http.fetch(that.$api.guide.patchChange, obj).then(() => {
          that.closeDialog()
          that.$notify.success('保存成功')
          that.$reload()
        }).catch((resp) => {
          that.$notify.error(resp.msg || '保存失败')
        })
      }
    },
    onDelete (row) { // 快捷话术删除
      apiRequestConfirm('永久删除该数据')
        .then(() => {
          let that = this
          that.$http.fetch(that.$api.guide.deleteQuicklyWord, { quicklyWordIds: String(row.id) }).then(() => {
            that.dialogFormVisible = false
            that.newestDialog = false
            that.$notify.success('删除成功')
            that.$reload()
          }).catch((resp) => {
            that.$notify.error(resp.msg || '删除失败')
          })
        }).catch(resp => {
        // 点击取消事件
        })
    },
    onPatchDelete () { // 快捷话术批量删除
      if (!this.selectedArr.length > 0) {
        this.$notify.warning('您没有选择任何数据')
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
          that.$http.fetch(that.$api.guide.deleteQuicklyWord, obj).then(() => {
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
