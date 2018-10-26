import ErrorCode from 'configs/errorCode'
import formMixin from 'mixins/form'
import moment from 'moment'
import Emotion from './EmotionConfig.js' // 表情配置文件

var vm
export default {
  mixins: [formMixin],
  data: function () {
    return {
      remarkSelect: 'private',
      emptyText: '',
      filterText: '',
      treeData: [],
      // 上传文件：
      importVisible: false,
      // 转移
      transferVisible: false,
      emotionList: Emotion,
      transDaTa: {
        ids: '',
        class_type_id: '',
        class_type: {}
      },
      root: {
        id: 0,
        label: '分类短语',
        code: 'root',
        parentId: 0,
        children: [],
        showAdd: true,
        disabled: true
      },
      // 分类短语类型
      treeLoading: false,
      typeVisible: false,
      typeLoading: false,
      typeTitle: '新增分类短语类型',
      treeList: [],
      shopId: '',
      copyType: {},
      classType: [],
      phraseType: {
        type_name: '',
        level: '',
        parent_id: '',
        type_path: '',
        id: ''
      },
      // 分类短语内容
      copyModel: {},
      title: '新增分类短语',
      visible: false,
      loading: false,
      shops: [],
      model: {
        is_public: '0',
        class_type: {},
        class_phrase: '',
        id: '',
        class_type_id: ''
      },
      transDaTaRules: {
        class_type: [{required: true, message: '请选择分类短语类型', trigger: 'change'},
          {validator: (rule, value, callback) => {
            if (JSON.stringify(this.transDaTa.class_type) !== '{}') {
              callback()
            } else {
              callback(new Error('请选择分类短语类型'))
            }
          }}]
      },
      TypeRules: {
        type_name: [{required: true, message: '请输入短语分类名', trigger: 'blur'},
          {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
          {validator: (rule, value, callback) => {
            if (value !== '') {
              vm.$http.fetch(vm.$api.kdjl.phraseType.checkType, {name: vm.phraseType.type_name, id: vm.phraseType.id})
                .then((resp) => {
                  if (resp.code === ErrorCode.TITLE_REPEAT) {
                    callback(new Error(resp.msg))
                  } else {
                    callback()
                  }
                }).catch((resp) => {
                  callback(new Error(resp.msg))
                }).finally()
            } else {
              callback(new Error('请输入短语分类名'))
            }
          }}
        ]
      },
      rules: {
        class_type: [{required: true, message: '请选择分类短语类型', trigger: 'change'},
          {validator: (rule, value, callback) => {
            if (JSON.stringify(this.model.class_type) !== '{}') {
              callback()
            } else {
              callback(new Error('请选择分类短语类型'))
            }
          }}],
        class_phrase: [
          {required: true, message: '请输入快捷内容', trigger: 'blur'},
          {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'},
          {validator: (rule, value, callback) => {
            if (value !== '') {
              if (JSON.stringify(this.model.class_type) !== '{}') {
                var typeId = vm.model.class_type.value
                vm.$http.fetch(vm.$api.kdjl.phrase.checkType, {phrase: vm.model.class_phrase, typeId: typeId, id: vm.model.id})
                .then((resp) => {
                  if (resp.code === ErrorCode.TITLE_REPEAT) {
                    callback(new Error(resp.msg))
                  } else {
                    callback()
                  }
                }).catch((resp) => {
                  callback(new Error(resp.msg))
                }).finally()
              } else {
                callback()
              }
            } else {
              callback(new Error('请输入快捷内容'))
            }
          }}
        ]
      }
    }
  },
  methods: {
    /**
     * 过滤树
     * @param val
     */
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    onNodeClick (data) {
      if (data.id !== 0) {
        vm.$refs.private.model.typeId = data.id
        vm.$refs.team.model.typeId = data.id
      } else {
        vm.$refs.private.model.typeId = ''
        vm.$refs.team.model.typeId = ''
      }
      vm.model.shop_id = vm.shopId
      vm.$refs.private.model.shopId = vm.shopId
      vm.$refs.team.model.shopId = vm.shopId
      vm.$refs.private.$reload()
      vm.$refs.team.$reload()
    },
    // 点击修改按钮
    onEditClick: function (data, node) {
      vm.typeTitle = '修改分类短语类型'
      if (JSON.stringify(this.copyType) === '{}') {
        vm.copyType = JSON.parse(JSON.stringify(vm.phraseType))
      }
      vm.phraseType.shop_id = vm.shop_id
      if (data.id === 0) {
        vm.phraseType.parent_id = 0
        vm.phraseType.level = 0
      } else {
        vm.phraseType.level = 1
        // 设置为选中状态
        vm.$refs.tree.setChecked(data.id, true)
        // 获取菜单路径
        let paths = this.getTreeParentIds(data, node)
        vm.phraseType.type_name = data.label
        vm.phraseType.parent_id = data.parentId
        vm.phraseType.id = data.id
        vm.phraseType.tag_path = paths.pathIds.join('/')
      }
      vm.typeVisible = true
    },
    // 点击添加按钮
    onAddClick: function (data, node) {
      vm.typeTitle = '新增分类短语类型'
      if (JSON.stringify(this.copyType) === '{}') {
        vm.copyType = JSON.parse(JSON.stringify(vm.phraseType))
      }
      vm.phraseType.shop_id = vm.shopId
      if (data.id === 0) {
        vm.phraseType.parent_id = 0
        vm.phraseType.level = 0
      } else {
        // 获取菜单路径
        let paths = this.getTreeParentIds(data, node)
        vm.phraseType.tag_path = paths.pathIds.join('/')
        vm.phraseType.level = 1
        vm.phraseType.parent_id = data.id
      }
      vm.typeVisible = true
    },
    // 点击删除按钮
    onDeleteClick: function (data, node) {
      var info = '是否确定删除“' + data.label + '”节点？'
      var url = vm.$api.kdjl.phraseType.deleteById
      var params = {id: data.id}
      vm.$confirm(info, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: function (action) {
          if (action === 'confirm') {
            vm.treeLoading = true
            vm.$http.fetch(url, params).then(resp => {
              vm.getTreeData()
              vm.$notify.success(resp.msg)
            }).catch((resp) => {
              vm.$notify.error(resp.msg)
            }).finally(() => {
              vm.treeLoading = false
            })
          }
        }
      })
    },
    // 获取树父节点指定字段的数组
    getTreeParentIds: function (data, node) {
      let paths = {
        pathIds: [data.id],
        pathNames: [data.label]
      }
      if (node.parent && node.parent.data.id !== 0) {
        let path = this.getTreeParentIds(node.parent.data, node.parent)
        paths.pathIds = path.pathIds.concat(paths.pathIds)
        paths.pathNames = path.pathNames.concat(paths.pathNames)
      }
      return paths
    },
    // 查询菜单树数据
    getTreeData: function () {
      vm.loading = true
      vm.root.children = []
      vm.$http.fetch(vm.$api.kdjl.phraseType.queryTree, {shopId: vm.shopId})
        .then((resp) => {
          if (resp.result.tree !== null) {
            vm.root.children = resp.result.tree
          }
          if (resp.result.treeTable !== null) {
            vm.treeList = resp.result.treeTable
          }
          vm.$set(vm, 'treeData', [vm.root])
          vm.classType = vm.root.children
        }).catch(() => {
          vm.emptyText = vm.$t('prompt.noData')
          vm.$notify.error('加载失败')
        }).finally(() => {
          vm.loading = false
        })
    },
    onTypeClose () {
      vm.$refs['typeForm'].resetFields()
      vm.phraseType = JSON.parse(JSON.stringify(vm.copyType))
      vm.typeVisible = false
    },
    onTypeSave () {
      if (typeof (vm.shopId) !== 'undefined' && vm.shopId !== '') {
        vm.$refs['typeForm'].validate((valid) => {
          if (valid) {
            vm.tyloading = true
            vm.$http.fetch(vm.$api.kdjl.phraseType.saveOrUpdate, vm.phraseType)
              .then((resp) => {
                vm.getTreeData()
                vm.$notify.success(resp.msg)
                vm.onTypeClose()
              }).catch((resp) => {
                vm.$notify.error(resp.msg)
              }).finally(() => {
                vm.tyloading = false
              })
          } else {
            return false
          }
        })
      } else {
        vm.$notify.warming('请选择店铺')
      }
    },
    changeSelect (obj) {
      if (obj.name === 'private') {
        vm.model.is_public = 0
      } else {
        vm.model.is_public = 1
      }
    },
    add: function () {
      vm.title = '新增分类短语'
      if (JSON.stringify(this.copyModel) === '{}') {
        this.copyModel = JSON.parse(JSON.stringify(vm.model))
      }
      vm.visible = true
    },
    update: function (obj) {
      if (JSON.stringify(this.copyMemo) === '{}') {
        this.copyModel = JSON.parse(JSON.stringify(vm.model))
      }
      vm.title = '修改分类短语'
      vm.model.class_phrase = obj.class_phrase
      vm.model.shop_id = obj.shop_id
      vm.model.id = obj.id
      if (vm.treeList.length > 0) {
        for (let data of vm.treeList) {
          if (data.value === obj.class_type_id) {
            vm.model.class_type = data
            break
          }
        }
      }
      vm.visible = true
    },
    onSave: function () { // 保存
      vm.$refs['form'].validate((valid) => {
        if (valid) {
          vm.loading = true
          vm.model.class_type_id = vm.model.class_type.value
          vm.$http.fetch(vm.$api.kdjl.phrase.saveOrUpdate, vm.model)
          .then((resp) => {
            vm.$notify.success(resp.msg)
            vm.dataReload()
            vm.onClose()
          }).catch((resp) => {
            vm.$notify.error(resp.msg)
          }).finally(() => {
            vm.loading = false
          })
        } else {
          return false
        }
      })
    },
    dataReload () {
      if (vm.model.is_public === '0') {
        vm.$refs.private.$reload()
      } else {
        vm.$refs.team.$reload()
      }
    },
    onClose: function () { // 关闭
      vm.$refs['form'].resetFields()
      vm.$set(vm, 'model', JSON.parse(JSON.stringify(vm.copyModel)))
      vm.$set(vm.model, 'class_type', {})
      vm.visible = false
    },
    transOpen (obj) {
      vm.transDaTa.ids = obj
      vm.transferVisible = true
    },
    updateTrans (obj) {
      vm.title = '转移分类短语'
      vm.transDaTa.ids = obj.id
      if (vm.treeList.length > 0) {
        for (let data of vm.treeList) {
          if (data.value === obj.class_type_id) {
            vm.transDaTa.class_type = data
            break
          }
        }
      }
      vm.transferVisible = true
    },
    onTransClose () {
      vm.$refs['transForm'].resetFields()
      vm.$set(vm.transDaTa, 'class_type', {})
      vm.transferVisible = false
    },
    onSaveTrans () {
      vm.$refs['transForm'].validate((valid) => {
        if (valid) {
          vm.loading = true
          vm.transDaTa.class_type_id = vm.transDaTa.class_type.value
          vm.$http.fetch(vm.$api.kdjl.phrase.batchUpdateClassTypeId, {ids: vm.transDaTa.ids, typeId: vm.transDaTa.class_type_id})
            .then((resp) => {
              vm.$notify.success(resp.msg)
              if (vm.model.is_public === '0') {
                vm.$refs.private.$reload()
              } else {
                vm.$refs.team.$reload()
              }
              vm.onTransClose()
            }).catch((resp) => {
              vm.$notify.error(resp.msg)
            }).finally(() => {
              vm.loading = false
            })
        } else {
          return false
        }
      })
    },
    importFile () {
      vm.importVisible = true
    },
    onCloseImportDialog: function () { // 关闭导入弹框
      vm.$refs.file.clearFiles()
      vm.$refs['importForm'].resetFields()
      vm.importVisible = false
    },
    beforeUpload: function (file) { // 上传导入
      const istype = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const isSize = file.size / 1024 / 1024 < 1
      if (!istype) {
        vm.$notify.error('上传文件只能是xls/xlsx格式')
      }
      if (!isSize) {
        vm.$notify.error('上传文件大小不能超过 1MB')
      }
      return istype && isSize
    },
    onImportSave: function () { // 保存导入
      vm.importLoading = true
      if (this.$refs.file.uploadFiles.length > 0) {
        vm.$refs.file.submit()
      } else {
        vm.$notify.warning('请上传文件')
      }
    },
    uploadFile: function (file) { // 上传
      let param = new FormData()
      param.append('filename', file.file)
      param.append('shopId', vm.shopId)
      param.append('typeId', vm.transDaTa.class_type.value)
      param.append('isPublic', vm.model.is_public)
      vm.$refs['importForm'].validate((valid) => {
        if (valid) {
          vm.loading = false
          vm.$http.fetch(vm.$api.kdjl.phrase.importFile, param)
              .then((resp) => {
                if (resp.msg === ErrorCode.SUBMIT_FAIL) {
                  vm.$notify.warning('上传分类短语数量：0')
                } else {
                  vm.$notify.success(resp.msg)
                  vm.dataReload()
                }
                vm.onCloseImportDialog()
              }).catch((resp) => {
                vm.$notify.error(resp.msg)
              }).finally(() => {
                vm.loading = false
              })
        } else {
          return false
        }
      })
    },
    changeShop (obj) {
      vm.shopId = obj
      vm.getData()
    },
    getData () {
      vm.model.shop_id = vm.shopId
      vm.$refs.private.model.shopId = vm.shopId
      vm.$refs.team.model.shopId = vm.shopId
      vm.getTreeData()
      vm.$refs.private.$reload()
      vm.$refs.team.$reload()
    },
    exportFile (obj) {
      if (vm.model.is_public !== '') {
        this.$confirm('如果不想使用客道为你生成的文件名，自定义文件名?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showInput: true,
          center: false,
          type: 'warning'
        }).then((value) => {
          vm.$http.fetch(vm.$api.kdjl.phrase.exportFile, {phrases: obj, shopId: vm.shopId, isPublic: vm.model.is_public, value: value.value})
            .then((resp) => {
            }).catch((resp) => {
            // 创建一个blob对象,file的一种
              let blob = new Blob([resp], { type: 'application/x-xls' })
              let link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
            // 配置下载的文件名
              link.download = (value.value !== null ? value.value : '分类短语' + moment(new Date()).format('YYYYMMDDhhmmss')) + '.xls'
              link.click()
            }).finally()
        }).catch(() => {})
      } else {
        vm.$notify.error('请选择店铺')
      }
    },
    setEmotionWords (word) {
      vm.model.class_phrase = vm.model.class_phrase + word
    }
  },
  watch: {
    filterText: function (val) {
      this.$refs.tree.filter(val)
    }
  },
  created: function () {
    vm = this
    vm.$http.fetch(vm.$api.core.common.queryShopListForTopByBrand)
      .then((resp) => {
        vm.shops = resp.result
      }).catch((resp) => {
        vm.$notify.error(resp.msg)
      }).finally(() => {
        if (vm.shops.length > 0) {
          vm.shopId = vm.shops[0].value
          vm.getData()
        }
      })
  },
  mounted: function () {
  }
}
