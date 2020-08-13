import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import Emotion from './EmotionConfig.js' // 表情配置文件
import { getErrorMsg } from '@/utils/toast'
import { data } from 'jquery'

export default {
  name: 'List',
  mixins: [tableMixin, scrollHeight],
  data: function () {
    return {
      /* todo 左侧页面滚动区域 */
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 63 // 按钮+分类+间距的大小
      },
      /* search model */
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
      /* 搜索分类 */
      categoryModel: {
        name: ''
      },
      // 左侧树
      wordGroupList: null,
      // 选择树
      selectwordGroupList: null,
      allCategoryObj: { id: null, label: '全部', name: '全部' },
      /* 编辑分类 model */
      addOrEditCategory: {
        type: 'add',
        title: '',
        visible: false,
        model: { name: '' },
        nodeData: null,
        loading: false,
        rules: {
          'name': [
            { required: true, message: '分类名称不能为空', trigger: 'blur' },
            { max: 10, message: '长度在1-10个字符以内', trigger: 'blur' }
          ]
        }
      },
      /* todo 编辑话术 model */
      /* todo 基本配置项 */
      showOrder: false,
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
      InternetMemeShow: false,
      orignalGroup: null,
      orignalKeyWord: null,
      index: 0,
      checkText: '',
      titleText: '',
      dialogFormVisible: false,
      dialogVisiblePatchChange: false,
      dialogVisible: false,
      loadingTable: false,
      height: 0,
      tableList: [],
      batchDis: false,
      _table: {
        table_buttons: []
      },
      rules: {
        'wordGroupId': [{ required: true, message: '话术类别不能为空' }],
        'content': [{ required: true, message: '话术内容不能为空' },
          { max: 190, message: '长度在 200 以内', trigger: 'blur' }],
        'name': [{ required: true, message: '分类内容不能为空' }]
      }
    }
  },
  mounted: function () {
    this.findQuicklyWordGroupList(true)
    this.findAddName()
    this.height = window.innerHeight - 170
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  methods: {
    /* 左边操作集合 - start */
    /**
     * 新增、编辑分类弹窗
     * @param data 当前操作的节点
     */
    onAddCategory (data, node) {
      this.onOpenCategory(data, node, 'add')
    },
    onEditCategory (data, node) {
      this.onOpenCategory(data, node, 'edit')
    },
    onOpenCategory (data, node, type) {
      this.$refs.addOrEditCategory && this.$refs.addOrEditCategory.resetFields()
      this.addOrEditCategory = {
        ...this.addOrEditCategory,
        type,
        title: type === 'edit' ? '编辑分类' : '新增分类',
        visible: true,
        model: {
          name: type === 'edit' ? data.name : ''
        },
        nodeData: data
      }
    },
    /**
     * 新增、编辑分类保存
     */
    onSaveCategory () {
      this.$refs.addOrEditCategory.validate((valid) => {
        if (valid) {
          this.addOrEditCategory.loading = true
          const { nodeData, model, type } = this.addOrEditCategory
          const params = {
            ...model,
            id: type === 'edit' ? data.id : undefined,
            parentId: type === 'add' && nodeData ? data.id : undefined
          }
          this.$http.fetch(this.$api.guide.saveOrUpdateQuicklyWordGroup, params).then(resp => {
            if (resp.success) {
              this.$notify.success(`${params.id ? '编辑' : '新增'}成功`)
              // 编辑成功 - 重新请求列表
              this.findQuicklyWordGroupList()
              this.closeDialog()
            }
          }).catch(resp => {
            this.$notify.error(getErrorMsg(`${params.id ? '编辑' : '新增'}失败`, resp))
          }).finally(() => {
            this.addOrEditCategory.loading = false
          })
        }
      })
    },
    formatWordGroupList (list, isSub = false) {
      return list.map(o => {
        if (o.children) {
          o.children = this.formatWordGroupList(o.children, true)
        }
        return {
          ...o,
          showEdit: true,
          showDelete: true,
          showAdd: !isSub
        }
      })
    },
    /**
     * 获取分类列表
     * @param isFirst 是否第一次请求
     */
    findQuicklyWordGroupList (isFirst) {
      this.$http.fetch(this.$api.guide.findQuicklyWordGroupList, { ...this.categoryModel }).then(resp => {
        if (resp.success) {
          this.wordGroupList = this.formatWordGroupList(resp.result.data || [])
          // 搜索内容为空时，添加全部选项
          if (!this.categoryModel.name) {
            this.wordGroupList.unshift(this.allCategoryObj)
          }
          // 进入页面初始化时，同步选择列表
          if (isFirst) {
            this.selectwordGroupList = this.wordGroupList.slice(1)
          }
        }
      }).catch(resp => {
        this.$notify.error(getErrorMsg('系统异常', resp))
      })
    },
    /**
     * 按分类检索话术
     */
    onTreeSelect (data) {
      this.showOrder = data && data.id !== null
      this.model.wordGroupId = data.id
      // todo 搜索参数
      this.parameter.searchMap = this.model
      this.$queryList$(this.parameter)
    },
    /**
     * 删除分类
     */
    onRemoveCategory (data) {
      this.$http.fetch(this.$api.guide.deleteQuicklyWordGroup, { id: data.id }).then(resp => {
        if (resp.success) {
          this.findQuicklyWordGroupList()
          this.$notify.success('删除成功')
          // todo id是否一致，一致才需要重置分类搜索
          this.parameter.wordGroupId = null
          this.$resetInputAction$()
        }
      }).catch(resp => {
        this.$notify.error(getErrorMsg('删除失败', resp))
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
    /**
     * 设置分类顺序
     */
    changeQuicklyWordGroupSort (startId, endId) {
      this.$http.fetch(this.$api.guide.changeQuicklyWordGroupSort, { startId: startId, endId: endId }).then(resp => {
        if (resp.success) {
          this.$notify.success('分类顺序设置成功')
        }
      }).catch(resp => {
        this.$notify.error(getErrorMsg('分类顺序设置失败', resp))
      })
    },
    /* 标签处理 */
    faceFace () { // 表情头像按钮
      this.InternetMemeShow = !this.InternetMemeShow
    },
    setEmotionWords (list) { // 选中的表情添加按钮
      if (this.model.content.length < 200) {
        this.model.content = this.model.content + list
      }
    },
    reset () {
      this.$resetInputAction$()
    },
    findAddName () {
      this.$http.fetch(this.$api.guide.findAddName, {}).then(resp => {
        if (resp.success && resp.result) {
          this.model.addName = resp.result
          this.addName = resp.result
        }
      }).catch(resp => {
        this.$notify.warning(getErrorMsg('系统异常', resp))
      })
    },
    handleSelectionChange (val) {
      this.batchDis = val.length > 0
      this.selectedArr = val
    },
    exchangeSort (type, id, scope) {
      let parms = { type, id }
      this.$http.fetch(this.$api.guide.updateQuicklyWordSort, parms).then(resp => {
        this.$reload()
      }).catch(resp => {
        this.$notify.error(getErrorMsg('系统异常', resp))
      })
    },
    closeDialog () {
      this.dialogFormVisible = false
      this.dialogVisiblePatchChange = false
      this.addOrEditCategory.visible = false
    },
    onSaveOpen (row = {}) { // 新增或编辑
      let arr = Object.keys(row)
      this.dialogFormVisible = true
      this.dialogVisiblePatchChange = false
      if (this.titleText === '新增话术') {
        this.$refs.form.resetFields()
      }
      this.titleText = (row.id && '编辑话术') || '新增话术'
      if (arr.length !== 0) {
        this.model = Object.assign({}, row)
      } else {
        this.model = {
          id: null,
          wordGroupId: null,
          content: '',
          keyWord: '已弃用',
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
      window.console.log('新创建的快捷话术=>' + this.model.content.replace(/\s+|[\r\n]/g, '').length)
      if (this.model.content.replace(/\s+|[\r\n]/g, '').length === 0) {
        that.$notify.error('保存失败,不能输入纯空格或换行')
        return
      }
      this.InternetMemeShow = false
      this.$refs.form.validate(valid => {
        if (valid) {
          that.$http.fetch(that.$api.guide.saveOrUpdateQuicklyWord, that.model).then(() => {
            that.closeDialog()
            that.$notify.success('保存成功')
            that.$reload()
          }).catch((resp) => {
            that.$notify.error(getErrorMsg('保存失败', resp))
          })
        }
      })
    },
    onPatchChange () { // 快捷话术批量管理
      // debugger
      if (this.model.wordGroupId <= 0) {
        this.$notify.warning('请选择一条有效分组')
        return
      }
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
            that.$notify.success('保存' + this.selectedArr.length + '成功')
            that.$reload()
          }).catch((resp) => {
            that.$notify.error(getErrorMsg('保存失败', resp))
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
          that.$notify.success('修改' + this.selectedArr.length + '条数据成功')
          that.$reload()
        }).catch((resp) => {
          that.$notify.error(getErrorMsg('保存失败', resp))
        })
      }
    },
    /**
     * 删除单条快捷话术
     */
    onDelete (row) {
      this.$confirm(`此操作将永久删除该条数据，是否继续？`, '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(() => {
        that.$http.fetch(that.$api.guide.deleteQuicklyWord, { quicklyWordIds: `${row.id}` }).then(() => {
          this.$notify.success('删除成功')
          that.$reload()
        }).catch((resp) => {
          this.$notify.error(getErrorMsg('删除失败', resp))
        })
      }).catch(() => {})
    },
    /**
     * 批量删除快捷话术
     */
    onPatchDelete () {
      if (!this.selectedArr.length) {
        this.$notify.warning('至少选择一条数据')
        return
      }
      this.$confirm(`此操作将永久删除${this.selectedArr.length}条数据，是否继续？`, '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(() => {
        let quicklyWordIds = this.selectedArr.map(o => o.id).join(',')
        that.$http.fetch(that.$api.guide.deleteQuicklyWord, { quicklyWordIds }).then(() => {
          this.$notify.success('删除成功')
          that.$reload()
        }).catch((resp) => {
          this.$notify.error(getErrorMsg('删除失败', resp))
        })
      }).catch(() => {})
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
    },
    searchLength (val) {
      var v = val
      if (val.length > 200) {
        this.model.searchValue = v.substring(0, 200)
      }
    },
    contentCheck (val) {
      var v = val
      // window.console.log('===', val.length)
      if (val.length > 190) {
        this.$refs['form'].validateField('content')
        this.model.content = v.substring(0, 190)
      }
    },
    keyWordCheck (val) {
      var v = val
      if (val.length > 25) {
        this.$refs['form'].validateField('keyWord')
        this.model.keyWord = v.substring(0, 25)
      }
    }
  }
}
