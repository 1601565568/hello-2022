import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import ShopSelectLoad from '@/components/ShopSelectLoad'
import TableItem from '../components/TableItem'
import NewFolder from '../components/NewFolder'
import FolderTree from '../components/FolderTree'
import LabelManage from '../components/LabelManage'
import LabelMake from '../components/LabelMake'
import Catalogue from '../components/Catalogue'
import Preview from '@/components/NsPreview'
import DetailList from '../components/DetailList'
import moment from 'moment'
import { getErrorMsg } from '@/utils/toast'

export default {
  components: { ShopSelectLoad, ElBreadcrumb, ElBreadcrumbItem, TableItem, NewFolder, FolderTree, LabelManage, LabelMake, Catalogue, Preview, DetailList },
  data: function () {
    return {
      // 表格顶部
      operateButtons: [
        {
          'name': '新建素材',
          'type': 'primary',
          'visible': true,
          'func': () => {
            this.$router.push({ name: 'LibraryEdit', params: { breadcrumb: this.breadcrumb, listMode: this.listMode } })
          }
        },
        {
          'name': '新建文件夹',
          'func': () => {
            const parent = this.breadcrumb[this.breadcrumb.length - 1]
            this.$refs.newFolder.show({ parent })
          },
          'visible': true
        },
        {
          'name': '标签管理',
          'func': () => {
            this.$refs.labelManage.show()
          },
          'visible': true
        },
        {
          'name': '打标签',
          'func': () => {
            this.$refs.labelMake.show(this.selectRows, this.labelList)
          },
          'icon': 'dabiaoqian',
          'visible': false
        },
        {
          'name': '移动到',
          'func': () => {
            this.$refs.folderTree.show(this.selectRows)
          },
          'icon': 'yidongdao',
          'visible': false
        },
        {
          'name': '删除',
          'func': () => {
            this.batchRemove()
          },
          'icon': 'shanchu',
          'visible': false
        }
      ],
      // 搜索接口参数
      searchObj: {
        start: 0,
        length: 15,
        searchMap: {}
      },
      // 快速搜索
      quickObj: {
        expanded: false,
        searchKey: 'name',
        collapseText: '展开搜索'
      },
      // 搜索数据
      model: {
        name: '',
        content: '',
        sourceId: '',
        subdivisionId: '',
        mType: '',
        codeType: '',
        time: [],
        outerId: '',
        shelfTime: '',
        endTime: '',
        currentStatus: ''
      },
      // table列表配置
      table: {
        loading: false,
        data: [],
        operate_buttons: [
          {
            'name': '使用分析',
            'func': (scope) => {
              const { id } = scope.row
              this.$router.push({
                path: `/Guide/Material/MaterialAnalysis/details/${id}`
              })
            },
            'visible': false
          },
          {
            'name': '移动到',
            'func': (scope) => {
              this.$refs.folderTree.show(scope.row)
            }
          },
          {
            'name': '编辑',
            'func': (scope) => {
              const { isDirectory, mType, id, name } = scope.row
              if (isDirectory === 1) {
                const parent = this.breadcrumb[this.breadcrumb.length - 1]
                this.$refs.newFolder.show({ type: 'edit', model: { name, id }, parent })
              } else {
                this.$router.push({
                  name: 'LibraryEdit',
                  params: { breadcrumb: this.breadcrumb, listMode: this.listMode },
                  query: { mType, id }
                })
              }
            }
          },
          {
            'name': '删除',
            'func': (scope) => {
              this.removeItem(scope.row)
            }
          },
          {
            'name': '自创明细',
            'func': (scope) => {
              this.showGuideLists(scope.row)
            }
          }
        ]
      },
      // 分页配置
      pagination: {
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      // 瀑布流配置
      waterfall: {
        folders: [],
        materials: [],
        operate_buttons: [
          {
            'name': '移动到',
            'icon': 'yidongdao',
            'func': (row) => {
              this.$refs.folderTree.show(row)
            }
          },
          {
            'name': '编辑',
            'icon': 'edit',
            'func': (row) => {
              const { isDirectory, mType, id, name } = row
              if (isDirectory === 1) {
                const parent = this.breadcrumb[this.breadcrumb.length - 1]
                this.$refs.newFolder.show({ type: 'edit', model: { name, id }, parent })
              } else {
                this.$router.push({
                  name: 'LibraryEdit',
                  params: { breadcrumb: this.breadcrumb, listMode: this.listMode },
                  query: { mType, id }
                })
              }
            }
          },
          {
            'name': '删除',
            'icon': 'shanchu',
            'func': (row) => {
              this.removeItem(row)
            }
          },
          {
            'name': '自创明细',
            'icon': 'shanchu',
            'func': (row) => {
              this.showGuideLists(row)
            }
          }
        ]
      },
      indeterminate: false,
      checkAll: false,
      listMode: 'waterfall', // list
      insertList: [
        {
          id: 0,
          shopName: this.$store.state.user.remumber.remumber_login_info.companyName
        }
      ],
      labelList: [],
      selectRows: [],
      typeList: [{ name: '全部', id: '' }, { name: '图文素材', id: 1 }, { name: '视频素材', id: 2 }, { name: '文章素材', id: 0 }],
      codeTypeList: [{ name: '全部', id: '' }, { name: '带码', id: 1 }, { name: '不带码', id: 2 }],
      breadcrumb: [{ name: '素材库', id: 0 }],
      filterValue: '',
      queryNum: 0,
      // 搜索时，排除文件夹的字段
      excludeQuery: ['content', 'subdivisionId', 'mType', 'outerId'],
      queryLoading: null,
      selectItem: {},
      materialScriptId: 0,
      matericalTitle: ''
    }
  },
  computed: {
    operate_buttons () {
      let checked = this.selectRows.length
      return this.operateButtons.filter(o => {
        return o.visible || checked
      })
    },
    isEmpty () {
      return this.listMode === 'list' ? this.table.data.length === 0 : this.waterfall.materials.length === 0
    },
    subdivisionList () {
      return this.labelList.filter(o => o.subdivisionName.toUpperCase().indexOf(this.filterValue) > -1)
    },
    enable () {
      return this.listMode === 'list' || !this.isEmpty
    },
    searching () {
      return Object.keys(this.searchObj.searchMap).length > 0
    }
  },
  watch: {
    /**
     * 选中数据发生变化
     */
    selectRows (newValue) {
      const { folders, materials } = this.waterfall
      const list = this.listMode === 'list' ? this.table.data : folders.concat(materials)
      let checkAll = list.length !== 0
      let indeterminate = false
      list.forEach(l => {
        let index = newValue.findIndex(o => o.id === l.id)
        if (index < 0) {
          checkAll = false
        } else {
          indeterminate = true
        }
      })
      this.checkAll = checkAll
      this.indeterminate = !checkAll && indeterminate
    },
    /**
     * 监听列表模式切换
     */
    listMode () {
      this.pagination.page = 1
      this.setHeight()
      this.reloadList()
    },
    enable () {
      this.setHeight()
    },
    'quickObj.expanded' () {
      this.setHeight()
    }
  },
  methods: {
    currentStatusChange (item) {
      // const nowTime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss')
      // if (item.currentStatus === '1') {
      //   // 上架
      //   item.shelfType = 0
      //   item.shelfTime = nowTime
      // }
      // if (item.currentStatus === '2') {
      //   // 下架
      //   item.endType = 0
      //   item.endTime = nowTime
      // }
      // const params = { ...item }
      // this.$http
      //   .fetch(this.$api.guide.materialEdit, params)
      //   .then(resp => {
      //     this.$notify.success('保存成功')
      //     this.loadList()
      //   })
      //   .catch(resp => {
      //     this.$notify.error(getErrorMsg('保存失败', resp))
      //   })
      //   .finally(() => {
      //   })
    },
    strToRichText (text) {
      const preRegexp = new RegExp('\\{' + 'EMOJI_' + '\\[', 'g')
      const afterRegexp = new RegExp(']}', 'g')
      const str = text
        .replace(
          preRegexp,
          '<img src="https://kedaocdn.oss-cn-zhangjiakou.aliyuncs.com/ecrm/wxemoji/v1/'
        )
        .replace(afterRegexp, '.png"/>')
        .replace(/\n/g, '<br/>')
      return str
    },
    /**
     * 标签筛选
     */
    subdivisionFilter (v) {
      this.filterValue = v.toUpperCase()
    },
    /**
     * 标签筛选重置
     */
    subdivisionVisible (val) {
      if (!val) {
        this.filterValue = ''
        if (this.selectItem.subdivisionIds) {
          this.subdivisionChange(this.selectItem)
          this.selectItem = {}
        }
      }
    },
    /**
     * 标签
     */
    updateSubs (val, item) {
      item.subdivisionIds = Array.from(val)
      this.selectItem = item
      // this.subdivisionChange(item)
    },
    /**
     * 标签改变
     */
    subdivisionChange (item) {
      const params = {
        subdivisionIds: item.subdivisionIds || [],
        itemList: [{
          id: item.id,
          isDirectory: item.isDirectory,
          parentPath: item.parentPath
        }]
      }
      this.setSubdivision(params)
    },
    /**
     * 清空选中状态
     */
    clearSelect () {
      this.checkAll = false
      this.indeterminate = false
      this.selectRows = []
      this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
    },
    /**
     * 搜索模式切换
     */
    handleSearchType () {
      const { expanded } = this.quickObj
      this.quickObj = {
        ...this.quickObj,
        expanded: !expanded,
        collapseText: expanded ? '展开搜索' : '收起搜索'
      }
    },
    /**
     * 每页条数发生变化
     */
    handleSizeChange (size) {
      this.pagination = {
        ...this.pagination,
        size,
        page: 1
      }
      this.reloadList()
    },
    /**
     * 页码发生变化
     */
    handlePageChange (page) {
      this.pagination.page = page
      this.reloadList()
    },
    /**
     * 获取数据
     */
    loadList () {
      const params = this.generateParams()
      params.searchMap.parentId = this.breadcrumb[this.breadcrumb.length - 1].id
      // 检测是否搜索的仅是素材，如果是，清空folders
      const excludeIndex = this.excludeQuery.findIndex(key => {
        return !!params.searchMap[key] || params.searchMap[key] === 0
      })
      if (this.listMode === 'list') {
        if (excludeIndex > -1) {
          params.searchMap.isDirectory = 0
        }
        this.queryList(params)
      } else {
        this.queryLoading = this.$loading({ target: '.library-wrapper', fullscreen: false, text: '正在加载...' })
        this.queryNum = 2
        if (excludeIndex > -1) {
          this.queryNum--
          this.waterfall.folders = []
        } else {
          this.queryFolders(params)
        }
        this.queryMaterials(params)
      }
    },
    /**
     * 获取文件夹、素材列表
     */
    queryList (params) {
      this.table.loading = true
      this.$http.fetch(this.$api.guide.materialList, params).then(resp => {
        this.table.data = (resp.result.data || []).map(o => {
          let numArr = [{ num: 0, suffix: '个文件夹' }, { num: 0, suffix: '个素材' }]
          if (o.isDirectory === 1) {
            numArr[0].num = +o.childDirectoryCount
            numArr[1].num = +o.childMaterialCount
          }
          numArr = numArr.filter(n => n.num > 0).map(t => `${t.num}${t.suffix}`)
          return {
            ...o,
            subdivisionId: o.subdivisionId === -1 ? null : o.subdivisionId,
            imageList: o.imageList || [],
            description: numArr.join('，')
          }
        })
        this.pagination.total = +resp.result.recordsTotal || 0
      }).catch(resp => {
        this.$notify.error(getErrorMsg('查询素材列表失败', resp))
      }).finally(() => {
        this.table.loading = false
      })
    },
    /**
     * 获取文件夹列表 - 瀑布流
     */
    queryFolders (params) {
      this.$http.fetch(this.$api.guide.findDirectoryList, { ...params.searchMap }).then(resp => {
        this.waterfall.folders = resp.result || []
      }).catch(resp => {
        this.$notify.error(getErrorMsg('查询文件夹列表失败', resp))
      }).finally(() => { this.checkLoading() })
    },
    /**
     * 获取素材列表 - 瀑布流
     */
    queryMaterials (params) {
      this.$http.fetch(this.$api.guide.materialList, {
        ...params,
        searchMap: { ...params.searchMap, isDirectory: 0 }
      }).then(resp => {
        this.waterfall.materials = (resp.result.data || []).map(o => {
          return {
            ...o,
            subdivisionId: o.subdivisionId === -1 ? null : o.subdivisionId,
            imageList: o.imageList || []
          }
        })
        this.pagination.total = +resp.result.recordsTotal || 0
      }).catch(resp => {
        this.$notify.error(getErrorMsg('查询素材列表失败', resp))
      }).finally(() => { this.checkLoading() })
    },
    checkLoading () {
      this.queryNum--
      if (this.queryNum === 0) {
        this.queryLoading && this.queryLoading.close()
      }
    },
    onMtypeChange (val) {
      if (val !== 1) {
        this.model.codeType = ''
      }
    },
    /**
     * 标准搜索
     */
    searchAction () {
      let params = {}
      // 数据格式化
      Object.keys(this.model).forEach(k => {
        if (this.model[k] !== '') {
          params[k] = k === 'sourceId' ? +this.model[k] : this.model[k]
        }
      })
      if (params.time && params.time.length === 2) {
        params.timeStart = moment(params.time[0]).format('YYYY-MM-DD HH:mm:ss')
        params.timeEnd = moment(params.time[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      delete params.time
      if (params.shelfTime && params.shelfTime.length === 2) {
        params.shelfTimeStart = moment(params.shelfTime[0]).format('YYYY-MM-DD HH:mm:ss')
        params.shelfTimeEnd = moment(params.shelfTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      delete params.shelfTime

      if (params.endTime && params.endTime.length === 2) {
        params.endTimeStart = moment(params.endTime[0]).format('YYYY-MM-DD HH:mm:ss')
        params.endTimeEnd = moment(params.endTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      delete params.endTime

      this.searchObj.searchMap = params
      this.pagination.page = 1
      this.reloadList()
    },
    /**
     * 重置搜索
     */
    resetAction () {
      var model = this.originModel
      var keys = Object.keys(model)
      for (var i = 0; i < keys.length; i++) {
        this.model[keys[i]] = model[keys[i]]
      }
      this.pagination.page = 1
      this.searchAction()
    },
    /**
     * 快速搜索
     */
    quickSearch () {
      this.pagination.page = 1
      this.searchObj.searchMap = {
        name: this.model[this.quickObj.searchKey]
      }
      this.reloadList()
    },
    /**
     * 进入文件夹：需要清空选中内容
     */
    onEnter (row) {
      var formatRow = this.formatDirectoryName(row)
      if (formatRow.isDirectory === 1) {
        let path = this.breadcrumb.map(o => o.id).join('/')
        if (path === formatRow.parentPath) {
          this.breadcrumb.push(formatRow)
          this.pagination.page = 1
          this.resetAction()
        } else {
          this.$http.fetch(this.$api.guide.getParentPath, {
            parentId: formatRow.parentId
          }).then(resp => {
            const { parentPath, parentPathName } = resp.result
            const parentIds = parentPath.split('/')
            const parentNames = parentPathName.split('/')
            const breadcrumb = parentIds.map((id, index) => ({ id: +id, name: parentNames[index] }))
            this.breadcrumb = breadcrumb.concat(formatRow)
            this.pagination.page = 1
            this.resetAction()
          }).catch(resp => {
            this.$notify.error(getErrorMsg('文件夹打开失败', resp))
          })
        }
      }
    },
    // 素材库标题长度修改150字。超出20溢出隐藏
    formatDirectoryName (row) {
      var newRow = JSON.parse(JSON.stringify(row))
      if (newRow.name.length > 20) {
        newRow.name = newRow.name.slice(0, 19) + '...'
      }
      return newRow
    },
    /**
     * 切换当前目录：需要清空选中内容
     */
    onExchange (row) {
      let index = this.breadcrumb.findIndex(o => o.id === row.id)
      if (index > -1 && index < this.breadcrumb.length - 1) {
        this.pagination.page = 1
        this.breadcrumb.splice(index + 1)
        this.resetAction()
      }
    },
    /**
     * 切换文件夹
     */
    reloadList () {
      this.clearSelect()
      this.loadList()
    },
    /**
     * 格式化params
     */
    generateParams () {
      return {
        start: (this.pagination.page - 1) * this.pagination.size,
        length: this.pagination.size,
        searchMap: { ...this.searchObj.searchMap }
      }
    },
    /**
     * 图片、视频预览
     */
    togglePreview (current, list, type) {
      this.$refs.preview.toggleShow(current, list, type, true)
    },
    /**
     * 设置素材标签
     */
    setSubdivision (params) {
      this.$http
        .fetch(this.$api.guide.materialSetGroud, { ...params })
        .then(() => {
          this.$notify.success('设置标签成功')
          this.loadList()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('设置标签失败', resp))
        })
    },
    /**
     * 删除素材、视频
     */
    removeItem (row) {
      const { isDirectory, materialScriptType } = row
      let showStr = ''
      if (materialScriptType === 2) {
        showStr = '删除该剧本后，员工根据该剧本创建的素材也将被删除，是否删除？'
      } else {
        showStr = `此操作将永久删除该${isDirectory === 1 ? '文件夹' : '条数据'}，是否继续？`
      }
      this.$confirm(showStr, '确定删除', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '删除'
      }).then(() => {
        this.toDelete([row])
      }).catch(() => {})
    },
    /**
     * 自创明细
     */
    showGuideLists (row) {
      this.materialScriptId = row.id
      this.matericalTitle = row.name
      this.$refs.detailList.closeDeawer(row.id)
    },
    /**
     * 批量删除素材、视频
     */
    batchRemove () {
      let numArr = [{ num: 0, suffix: '条素材' }, { num: 0, suffix: '个文件夹' }]
      this.selectRows.forEach(o => {
        o.isDirectory === 1 ? numArr[1].num++ : numArr[0].num++
      })
      let strArr = numArr.map(o => o.num ? `${o.num}${o.suffix}` : '').filter(s => !!s)
      this.$confirm(`已选择${strArr.join('、')}，确认要删除吗？`, '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(() => {
        this.toDelete(this.selectRows)
      }).catch(() => {})
    },
    toDelete (rows) {
      const itemList = rows.map(o => ({
        id: o.id,
        isDirectory: o.isDirectory,
        parentPath: o.parentPath
      }))
      this.$http
        .fetch(this.$api.guide.batchDeleteMaterial, { itemList })
        .then(resp => {
          this.$notify.success('删除成功')
          this.selectRows = []
          this.loadList()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('删除失败', resp))
        })
    },
    /**
     * 文件夹以及素材移动成功回调
     */
    refreshList () {
      this.selectRows = []
      this.loadList()
    },
    /**
     * 获取标签列表-全量
     */
    getAllLabel () {
      this.$http
        .fetch(this.$api.guide.materialGroudListAll, {})
        .then(resp => {
          this.labelList = resp.result
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    /**
     * 列表 - 选中数据
     */
    onHandleSelectChange (val) {
      this.selectRows = val
    },
    /**
     * 瀑布流 - 选中数据
     */
    onSelect (row) {
      this.selectRows.push(row)
    },
    /**
     * 瀑布流 - 取消选中
     */
    onRemove (row) {
      let index = this.selectRows.findIndex(o => o.id === row.id)
      if (index > -1) {
        this.selectRows.splice(index, 1)
      }
    },
    /**
     * 全选
     */
    onSelectAll (checked) {
      const { folders, materials } = this.waterfall
      let list = this.listMode === 'list' ? this.table.data : folders.concat(materials)
      list.forEach(l => {
        let index = this.selectRows.findIndex(o => l.id === o.id)
        if (index < 0 && checked) {
          this.selectRows.push(l)
          this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(l, true)
        } else if (index > -1 && !checked) {
          this.selectRows.splice(index, 1)
          this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(l, false)
        }
      })
    },
    setHeight: function () {
      this.$nextTick(() => {
        let extraHeight = this.$refs.fullScreen.$el.getBoundingClientRect().top || 0
        extraHeight += (this.enable ? 38 : 0) + 17 + 5
        this.$refs.fullScreen.$el.children[0].style.maxHeight = window.innerHeight - extraHeight + 'px'
      })
    },
    /**
     * 企微个号环境判断
     */
    getMemberManagePlan () {
      this.$http
        .fetch(this.$api.guide.materialAnalysis.getMemberManagePlan)
        .then(res => {
          if (res.success) {
            // 1 企微  2个号
            let employeeIdShow = res.result
            if (employeeIdShow === 2) {
              // 1 企微  2个号
              this.$set(this.table.operate_buttons[0], 'visible', true)
              let obj = {
                'name': '使用分析',
                'icon': 'fenxi',
                'func': (row) => {
                  const { id } = row
                  this.$router.push({
                    path: `/Guide/Material/MaterialAnalysis/details/${id}`
                  })
                }
              }
              this.waterfall.operate_buttons.unshift(obj)
            }
          } else {
            this.$notify.error('获取系统方案失败')
          }
        })
        .catch(err => {
          this.$notify.error('获取系统方案失败' + err)
        })
    }
  },
  created () {
    let { breadcrumb, listMode } = this.$route.params
    if (breadcrumb && breadcrumb.length) {
      this.breadcrumb = breadcrumb
    }
    this.listMode = listMode || 'waterfall'
    this.setHeight()
    window.addEventListener('resize', this.setHeight)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setHeight)
  },
  mounted () {
    this.originModel = JSON.parse(JSON.stringify(this.model))
    this.getAllLabel()
    this.getMemberManagePlan()
    this.loadList()
  }
}
