import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import Emotion from './EmotionConfig.js' // 表情配置文件
import NsTree from '@nascent/ecrp-ecrm/src/components/NsTree'
import NsDroptree from '@nascent/ecrp-ecrm/src/components/NsDroptree'
import importQuick from '../ImportQuick'
import { getErrorMsg } from '@/utils/toast'

export default {
  components: { NsTree, NsDroptree, importQuick },
  name: 'List',
  mixins: [tableMixin, scrollHeight],
  data: function () {
    return {
      ENV: process.env.VUE_APP_THEME,
      /* 左侧页面滚动区域 */
      scrollBarDeploy: [
        {
          ref: 'fullScreen',
          excludeHeight: 96
        },
        {
          ref: 'tableScreen',
          excludeHeight: 81
        }
      ],
      /* 话术搜索 */
      addNameList: [],
      model: {
        // 添加人id
        name: '',
        // 话术内容
        content: ''
      },
      /* 分类搜索 */
      categorySearchObj: {
        name: '',
        searchValue: ''
      },
      // 左侧树
      wordGroupList: null,
      expandedKeys: [],
      // 分类id
      wordGroupId: 0,
      // 选择树
      selectwordGroupList: null,
      allCategoryObj: { id: 0, label: '全部' },
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
      /* 编辑话术 model */
      addOrEditModel: {
        title: '新增话术',
        visible: false,
        loading: false,
        model: {
          wordGroup: {},
          content: ''
        },
        rules: {
          wordGroup: [{ validator: this.checkWordGroup, trigger: 'blur' }],
          content: [
            { required: true, message: '话术内容不能为空', trigger: 'blur' },
            { max: 200, message: '长度在1-200个字符以内', trigger: 'blur' }
          ]
        }
      },
      /* 基本配置项 */
      batchDis: false,
      showOrder: false,
      selectedArr: [],
      emotionList: Emotion,
      addName: null,
      emojiShow: false,
      _table: {},
      batchSetModel: {
        visible: false,
        model: {
          wordGroup: {}
        },
        rules: {
          wordGroup: [{ validator: this.checkWordGroup, trigger: 'blur' }]
        },
        loading: false
      },
      productConfig: {}
    }
  },
  created () {
    const { remumber_login_info: userInfo } = (this.$store.state.user || {}).remumber || {}
    this.productConfig = (userInfo || {}).productConfig || {}
  },
  mounted: function () {
    this.findQuicklyWordGroupList()
    this.findAddName()
    this.getAddNameList()
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  watch: {
    '_data._queryConfig.expand' (newVal) {
      this.scrollBarDeploy[1].excludeHeight = newVal ? 114 : 81
    }
  },
  methods: {
    importExcelClose (value) {
      this.findQuicklyWordGroupList()
      this.$reload()
    },
    /**
     * 获取快捷话术添加人列表
     */
    getAddNameList () {
      this.$http.fetch(this.$api.guide.getAddNameList, {}).then(resp => {
        if (resp.success && resp.result) {
          this.addNameList = resp.result
        }
      }).catch(resp => {
        this.$notify.warning(getErrorMsg('系统异常', resp))
      })
    },
    checkWordGroup (rule, value, callback) {
      if (!value.value) {
        callback(new Error('分类不能为空'))
      }
      callback()
    },
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
          name: type === 'edit' ? data.label : ''
        },
        nodeData: data
      }
    },
    // 打开弹窗
    ImportQuick () {
      // console.log(this.$refs.importQuickDialog)
      this.$refs.importQuickDialog.showToggle()
    },
    // loadListFun(){
    //   this.$reload()
    // },
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
            id: type === 'edit' ? nodeData.id : undefined,
            parentId: type === 'add' && nodeData ? nodeData.id : undefined
          }
          this.$http.fetch(this.$api.guide.saveOrUpdateQuicklyWordGroup, params).then(resp => {
            if (resp.success) {
              this.$notify.success('保存成功')
              this.findQuicklyWordGroupList()
              this.closeDialog()
              if (params.id) {
                this.$queryList$(this.$generateParams$())
              }
            }
          }).catch(resp => {
            this.$notify.error(getErrorMsg('保存失败', resp))
          }).finally(() => {
            this.addOrEditCategory.loading = false
          })
        }
      })
    },
    /**
     * 删除分类
     */
    onRemoveCategory (data) {
      this.$http.fetch(this.$api.guide.deleteQuicklyWordGroup, { id: data.id }).then(resp => {
        if (resp.success) {
          this.findQuicklyWordGroupList()
          this.$notify.success('删除成功')
          if (data.id === this.wordGroupId) {
            this.wordGroupId = null
            this.$queryList$(this.$generateParams$())
          }
        }
      }).catch(resp => {
        this.$notify.error(getErrorMsg('删除失败', resp))
      })
    },
    onNodeExpand (nodeData) {
      let index = this.expandedKeys.findIndex(key => nodeData.id === key)
      if (index < 0) {
        this.expandedKeys.push(nodeData.id)
      }
    },
    onNodeCollapse (nodeData) {
      let index = this.expandedKeys.findIndex(key => nodeData.id === key)
      if (index > -1) {
        this.expandedKeys.splice(index, 1)
      }
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
     */
    findQuicklyWordGroupList () {
      this.$http.fetch(this.$api.guide.findQuicklyWordGroupList, {}).then(resp => {
        if (resp.success) {
          this.wordGroupList = this.formatWordGroupList(resp.result.data || [])
          // 搜索内容为空时，添加全部选项
          this.wordGroupList.unshift(this.allCategoryObj)
          // 同步选择列表
          this.selectwordGroupList = this.wordGroupList.slice(1)
          // 设置默认选中项
          this.$nextTick(() => {
            this.$refs.categoryTree.filter(this.categorySearchObj.searchValue)
            this.$refs.categoryTree.setCurrentKey(this.wordGroupId)
          })
        }
      }).catch(resp => {
        this.$notify.error(getErrorMsg('系统异常', resp))
      })
    },
    /**
     * 触发分类筛选
     */
    onFireFilter () {
      this.categorySearchObj.searchValue = this.categorySearchObj.name
      this.$refs.categoryTree.filter(this.categorySearchObj.searchValue)
    },
    /**
     * 分类筛选
     */
    onTreeFilter (value, data) {
      if (!value) {
        return true
      }
      if (data.label) {
        return data.label.indexOf(value) > -1
      }
      return false
    },
    /**
     * 按分类检索话术
     */
    onTreeSelect (data) {
      this.showOrder = data && data.id !== null
      this.wordGroupId = data.id
      this.$queryList$(this.$generateParams$())
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      this.changeQuicklyWordGroupSort(draggingNode.data.id, dropNode.data.id)
    },
    allowDrop (draggingNode, dropNode, type) {
      return type !== 'inner' && dropNode.data.id !== null && draggingNode.data.parentId === dropNode.data.parentId
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
          this.findQuicklyWordGroupList()
          this.$notify.success('分类顺序设置成功')
        }
      }).catch(resp => {
        this.$notify.error(getErrorMsg('分类顺序设置失败', resp))
      })
    },
    /* 标签处理 */
    faceFace () { // 表情头像按钮
      this.emojiShow = !this.emojiShow
    },
    setEmotionWords (list) { // 选中的表情添加按钮
      if (this.addOrEditModel.model.content.length < 200) {
        this.addOrEditModel.model.content = this.addOrEditModel.model.content + list
      }
    },
    findAddName () {
      this.$http.fetch(this.$api.guide.findAddName, {}).then(resp => {
        if (resp.success && resp.result) {
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
      this.addOrEditModel.visible = false
      this.addOrEditCategory.visible = false
      this.batchSetModel.visible = false
    },
    /**
     * 快捷话术弹窗
     */
    onSaveOpen (row = {}) {
      if (this.$refs.addOrEditForm) {
        this.$refs.addOrEditForm.resetFields()
        this.$refs.addOrEditForm.clearValidate()
      }
      let isEdit = row && row.id
      let model = {
        id: null,
        wordGroup: {},
        content: '',
        addName: this.addName,
        keyWord: '已弃用',
        ...row
      }
      if (isEdit) {
        model.wordGroup = { value: row.wordGroupId, text: row.name }
      }
      this.addOrEditModel = {
        ...this.addOrEditModel,
        model,
        visible: true,
        title: isEdit ? '编辑话术' : '新增话术'
      }
    },
    /**
     * 快捷话术保存
     */
    onSave () {
      const { content, wordGroup } = this.addOrEditModel.model
      this.emojiShow = false
      this.$refs.addOrEditForm.validate(valid => {
        if (valid) {
          if (content.replace(/\s+|[\r\n]/g, '').length === 0) {
            this.$notify.error('保存失败,不能输入纯空格或换行')
            return
          }
          const params = { ...this.addOrEditModel.model }
          params.wordGroupId = wordGroup.value
          params.name = wordGroup.text
          delete params.wordGroup
          this.$http.fetch(this.$api.guide.saveOrUpdateQuicklyWord, params).then(() => {
            this.closeDialog()
            this.$notify.success('保存成功')
            this.$reload()
          }).catch((resp) => {
            this.$notify.error(getErrorMsg('保存失败', resp))
          })
        }
      })
    },
    /**
     * 打开批量设置分类
     */
    onBatchSetOpen () {
      if (!this.selectedArr.length) {
        this.$notify.warning('请至少选择一条数据')
        return
      }
      if (this.selectedArr.length === 1) {
        this.batchSetModel.model.wordGroup = {
          value: this.selectedArr[0].wordGroupId,
          text: this.selectedArr[0].name
        }
      } else {
        this.batchSetModel.model.wordGroup = {}
      }
      this.batchSetModel.visible = true
    },
    /**
     * 批量设置分类
     */
    onBatchChange () {
      this.$refs.batchSetForm.validate((valid) => {
        if (valid) {
          const { wordGroup } = this.batchSetModel.model
          this.batchSetModel.loading = true
          const params = { wordGroupId: wordGroup.value }
          params.quicklyWordIds = this.selectedArr.map(o => o.id).join(',')
          this.$http.fetch(this.$api.guide.patchChange, params).then(() => {
            this.closeDialog()
            this.$notify.success('修改' + this.selectedArr.length + '条数据成功')
            this.$reload()
          }).catch((resp) => {
            this.$notify.error(getErrorMsg('修改失败', resp))
          }).finally(() => {
            this.batchSetModel.loading = false
          })
        }
      })
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
        this.$http.fetch(this.$api.guide.deleteQuicklyWord, { quicklyWordIds: `${row.id}` }).then(() => {
          this.$notify.success('删除成功')
          this.$reload()
        }).catch((resp) => {
          this.$notify.error(getErrorMsg('删除失败', resp))
        })
      }).catch(() => {})
    },
    /**
     * 批量删除快捷话术
     */
    onBatchDelete () {
      if (!this.selectedArr.length) {
        this.$notify.warning('请至少选择一条数据')
        return
      }
      this.$confirm(`此操作将永久删除${this.selectedArr.length}条数据，是否继续？`, '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(() => {
        let quicklyWordIds = this.selectedArr.map(o => o.id).join(',')
        this.$http.fetch(this.$api.guide.deleteQuicklyWord, { quicklyWordIds }).then(() => {
          this.$notify.success('删除成功')
          this.$reload()
        }).catch((resp) => {
          this.$notify.error(getErrorMsg('删除失败', resp))
        })
      }).catch(() => {})
    },
    $queryList$: function (params) {
      this._data._table.loadingtable = true
      const searchMap = { ...params.searchMap, wordGroupId: this.wordGroupId || null }
      if (!searchMap.name) {
        searchMap.name = null
      }
      return this.$http.fetch(this.$api.guide.findQuicklyWordList, { ...params, searchMap }).then((resp) => {
        this._data._table.data = resp.result.data
        this._data._pagination.total = parseInt(resp.result.recordsTotal)
        if (this._data._pagination.total > 0) {
          this._data._table.key = 1
        } else if (this._data._pagination.total === 0) {
          this._data._table.key = 2
        }
      }).catch((err) => {
        this.$notify.error(err && err.msg ? err.msg : '网络异常，获取数据失败！')
      }).finally(() => {
        this._data._table.loadingtable = false
      })
    }
  }
}
