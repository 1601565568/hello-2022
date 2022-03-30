import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import moment from 'moment'
import { getErrorMsg } from '@/utils/toast'
import LocalStorage from 'store/dist/store.legacy.min.js'
import $ from 'jquery'

export default {
  name: 'NsTableGuide',
  mixins: [tableMixin],
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    let that = this
    const tableButtons = [
      {
        'func': function () {
          that.changeShop('guide')
        },
        'name': '更换导购'
      },
      {
        'func': function () {
          that.changeShop('shop')
        },
        'name': '更换门店'
      }
    ]
    let quickSearchModel = {}
    let findVo = {
      customerName: null,
      nick: null,
      mobile: null,
      cardId: null,
      time: null,
      grade: null,
      isNotAll: true
    }
    let copyModel = Object.assign({}, findVo)
    return {
      totalNumTrige: null,
      filterTreeText: '',
      model: copyModel,
      quickSearchModel: quickSearchModel,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        quickSearchMap: {}
      },
      checkShopStatus: ['1', '-1'],
      checkGuideStatus: ['1'],
      _queryConfig: { expand: false },
      multipleSelection: [],
      select: true,
      shopFindList: [],
      url: this.$api.guide.guide.customerFindCustomerList,
      dataList: [],
      allGuideArr: { id: 0, pId: null, label: '全部导购' },
      shuJushuzu: {},
      offLineShopId: null,
      loading: false,
      offsetHeight: false,
      height: 0,
      showChangeGuide: true,
      gradeInfo: [], // 等级信息下拉框
      shopTreePage: {
        total: 0,
        page: 1,
        size: 50,
        shopName: ''
      },
      total: '0', // 页面table总数居
      checkAll: false, // 是否全选
      isIndeterminate: false, // 全选样式显示状态
      isManual: true, // 是否是手动触发全选
      removeCheckList: [], // 记录全选状态下面的取消的list
      addcheckList: [], // 记录表格勾选的数据
      outGuideId: null,
      shopCustomerTransferTaskStatus: null, // 判断门店是否有转移任务
      shopCustomerTransferTaskStatusTime: null, // 定时调用判断门店转移任务状态显示
      visibleAreaTreeDialog: false, // 区域树组件是否显示
      selectedAreaInfo: { id: -1, label: '' },
      areaTree: [],
      selectItem: {
        label: ''
      },
      chooesQA: process.env.VUE_APP_THEME,
      filter: 'filter-area',
      filterQA: 'filter-areaQA',
      selects: 'selected-area',
      selectQA: 'selected-areaQA',
      checkQA: 'checkQA',
      checks: 'checks',
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },
  computed: {
    /**
     * 区域id
     */
    areaId () {
      return this.$store.state.user.area.id
    },
    viewId () {
      return this.$store.state.user.remumber.remumber_login_info.productConfig.viewId
    }
  },
  watch: {
    // 导购树过滤
    filterTreeText (val) {
      this.$refs.guideTree.filter(val)
    },
    shopFindList (val) {
      this.$nextTick(function () {
        this.appendShopInfo(val)
      })
    },
    removeCheckList (value) {
      if (this.checkAll) {
        if (value.length > 0 && value.length < this.total) {
          this.isIndeterminate = true
        } else if (value.length === 0) {
          this.isIndeterminate = false
          return false
        } else if (value.length === parseInt(this.total)) {
          // 添加删除的数组等于总条数，相当于没有全部取消
          this.isIndeterminate = false
          this.removeCheckList = []
          this.checkAll = false
        }
      }
    },
    addcheckList (value) {
      if (!this.checkAll) {
        if (value.length > 0 && value.length < this.total) {
          this.isIndeterminate = true
        } else if (value.length === 0) {
          this.isIndeterminate = false
          this.checkAll = false
          return false
        } else if (value.length === parseInt(this.total)) {
          // 添加勾选的数组等于总条数相当于全部选择
          this.isIndeterminate = false
          this.checkAll = true
          this.addcheckList = []
        }
      }
    }
  },
  async mounted () {
    var vm = this
    vm.height = window.innerHeight - 120
    let limitHeight = window.innerHeight - 32 - 10 - this.$refs.shopTreeDiv.$el.getBoundingClientRect().top
    this.$refs.shopTreeDiv.$el.children[0].style.height = limitHeight + 'px'
  },
  updated () {
    if (this.$refs.elTree) {
      this.$refs.elTree.offsetHeight > window.screen.availHeight ? this.offsetHeight = true : this.offsetHeight = false
    }
  },
  async created () {
    // 初始化确定全局区域下的区域列表
    await this.getAreaList()
    await this.initShopList()
  },
  beforeDestroy () {
    clearInterval(this.shopCustomerTransferTaskStatusTime)
  },
  methods: {
    changeShop (type) {
      if (this.total === '0') {
        this.$notify.error('请选择要更换导购的会员')
        return
      }
      const checkAll = this.checkAll
      const isIndeterminate = this.isIndeterminate
      let name = this.selectItem.label || ''
      const children = this.selectItem.children || []
      if (name.indexOf('(') !== -1 && name.indexOf(')') !== -1) {
        name = name.substring(0, name.indexOf('('))
      }
      const typeName = children.length > 0 ? '门店' : '导购'
      if (checkAll && !isIndeterminate) {
        const h = this.$createElement
        this.$confirm('提示信息', {
          title: '提示信息',
          message: h('div', null, [
            h('div', null, `您正在转移${typeName}（${name}）全部会员，是否继续？`),
            h('div', { style: 'font-size:14px; color: rgba(0, 0, 0, 0.45); margin-top: 8px' }, ` 选择的会员范围与筛选条件无关`)
          ]),
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleChange(type)
        }).catch(() => {
        })
      } else {
        this.handleChange(type)
      }
    },
    handleChange (type) {
      if (type === 'shop') {
        this.$emit('handlereplaceShop')
      } else if (type === 'guide') {
        this.$emit('add')
      }
    },
    changeGuide () {
      if (this.total === '0') {
        this.$notify.error('请选择要更换导购的会员')
        return
      }
      this.$emit('add')
    },
    showShopOrGuideName () {
      const maxLen = 12
      let name = this.selectItem.label || ''
      if (name.indexOf('(') !== -1 && name.indexOf(')') !== -1) {
        name = name.substring(0, name.indexOf('('))
      }
      if (name.length > maxLen) {
        name = name.substring(0, maxLen) + '...'
      }
      return name
    },
    // 查询区域列表
    async getAreaList (data) {
      const resp = await this.$http.fetch(this.$api.guide.shop.findDigitalShopList, {
        start: 0,
        length: 50,
        searchMap: {
          areaName: ''
        }
      })

      if (resp.success) {
        this.areaTree = resp.result.data
        if (resp.result.data[0]) {
          this.selectedAreaInfo = { id: resp.result.data[0].id, label: resp.result.data[0].label }
        }
      } else {
        this.$notify.error('获取区域列表失败')
      }
    },
    confirmAreaInfo (data) {
      this.selectedAreaInfo = data
      this.initShopList()
    },
    handlereplaceShop () {
      this.$emit('handlereplaceShop')
    },
    moment (time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    changeStatus () {
      this.initShopList()
    },
    // 门店树选择
    onClickNode (data) {
      var _this = this
      if (this._data._table.data.length > 0) {
        this._data._table.data = []
      }
      if (_this.gradeInfo) {
        _this.gradeInfo = []
      }
      _this.offLineShopId = data.parentId !== '0' ? data.parentId : data.id
      this.outGuideId = data.parentId !== '0' ? data.id : null
      _this.$emit('offLineShopId', { 'shopId': _this.offLineShopId, 'areaId': _this.selectedAreaInfo.id })
      _this.shuJushuzu = data
      _this.loading = true
      // 页码重置,觉得不应该有这个问题.
      _this._data._pagination.page = 1
      _this.$reload().then(rep => {
        _this.loading = _this._data.loading
        this.totalForUnconditionalSearch(data)
      })
      // 设置搜索及重置可用
      this.searchButton = false
      this.restButton = false
      // 全部情况不需要请求等级
      // if (data.id !== '1') {
      // this.showChangeGuide = true
      _this.$http.fetch(_this.$api.guide.shop.findShopGrade,
        { shopId: _this.offLineShopId }).then(resp => {
        if (resp.success && resp.result !== null) {
          _this.gradeInfo = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询等级信息失败', resp))
      })
      this.clearRemoveStatus()
    },
    setStatus () {
      let _this = this
      let user = this.$store.state.user.remumber.remumber_login_info.productConfig.user
      let userId = user.nickId
      this.shopCustomerTransferTaskStatus = null
      if (!this.offLineShopId) {
        clearInterval(this.shopCustomerTransferTaskStatusTime)
        return false
      }
      _this.getShopCustomerTransferTaskStatus(userId).then(() => {
        clearInterval(_this.shopCustomerTransferTaskStatusTime)
        _this.shopCustomerTransferTaskStatusTime = setInterval(() => {
          if (_this.shopCustomerTransferTaskStatus && _this.shopCustomerTransferTaskStatus.status !== 3) {
            _this.getShopCustomerTransferTaskStatus(userId)
          } else {
            clearInterval(_this.shopCustomerTransferTaskStatusTime)
          }
        }, 1000 * 10)
      })
    },
    clearRemoveStatus () {
      // 会员转移新需求
      this.checkAll = false // 是否全选
      this.isIndeterminate = false // 全选样式显示状态
      this.removeCheckList = [] // 记录全选状态下面的取消的list
      this.addcheckList = [] // 记录表格勾选的数据
      this.setStatus()
    },
    updateSetAjax (data) {
      if (data === 2) {
        this.$searchAction$()
      }
      this.setStatus()
    },
    // 查询门店客户转移任务状态
    getShopCustomerTransferTaskStatus (userId) {
      return new Promise((resolve, reject) => {
        this.$http.fetch(this.$api.guide.shop.getShopCustomerTransferTaskStatus, {
          shopId: this.offLineShopId
        }).then((res) => {
          this.shopCustomerTransferTaskStatus = res.result
          if (this.shopCustomerTransferTaskStatus && this.shopCustomerTransferTaskStatus.status === 3 && parseInt(userId) === parseInt(this.shopCustomerTransferTaskStatus.operator)) {
            this.$searchAction$()
          }
          resolve(true)
        }).catch((err) => {
          reject(err)
          this.$notify.error('获取门店客户转移任务状态失败')
        })
      })
    },
    getFindCustomerTotal () {
      let param = {
        shopId: this.offLineShopId
      }
      this.$http.fetch(this.$api.guide.guide.findCustomerTotal, param).then(resp => {
        this.total = resp.result.total // 显示页面所有数据
      })
    },
    totalForUnconditionalSearch (data) {
      this.selectItem = data
      let isShop = false
      let param = {
        shopId: this.offLineShopId
      }
      // 代表门店
      if (data.parentId === '0') {
        isShop = true
      } else {
        // 专属导购
        param.guideId = data.id
      }
      this.$http.fetch(this.$api.guide.guide.findCustomerTotal, param).then(resp => {
        if (resp.success && resp.result !== null) {
          // 遍历门店.asd
          if (isShop && this.totalNumTrige) {
            for (let nodeIndex in this.$refs.guideTree.children) {
              let node = this.$refs.guideTree.children[nodeIndex]
              let index = node.label.lastIndexOf(this.totalNumTrige)
              if (index > -1) {
                node.label = node.label.substr(0, index)
              }
            }
          }
          // 显示 total
          let showLabel = data.label
          if (showLabel.indexOf('(') !== -1 && showLabel.indexOf(')') !== -1) {
            showLabel = showLabel.substring(0, showLabel.indexOf('('))
          }
          let addLabel = '(' + resp.result.total + ')'
          this.total = resp.result.total // 显示页面所有数据
          if (isShop) {
            this.totalNumTrige = addLabel
          }
          // 特殊处理
          let addText = data.status === 2 ? '(已离职)' : ''
          data.label = showLabel + addText + addLabel
        }
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('统计门店客户总数失败', resp))
      })
    },
    // 树节点过滤
    onFilterNode (value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) {
        return true
      }
      // 如果传入的value和data中的label相同说明是匹配到了
      if (data.label.indexOf(value) !== -1) {
        return true
      }
      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node)
    },
    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode (value, data, node) {
      const level = node.level
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false
      }
      // 先取当前节点的父节点
      let parentData = node.parent
      // 遍历当前节点的父节点
      let index = 0
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.label.indexOf(value) !== -1) {
          return true
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent
        index++
      }
      // 没匹配到返回false
      return false
    },
    initShopList (page) {
      this.shopTreePage.page = page || 1
      if (this.shopTreePage.shopName) {
        if (this.checkShopStatus.length === 0) {
          this.$notify.info('请先选择店铺状态')
          return
        }
      }
      this.$http.fetch(this.$api.guide.guide.getShopAndGuideTree, {
        start: (this.shopTreePage.page - 1) * this.shopTreePage.size,
        length: this.shopTreePage.size,
        searchMap: {
          shopName: this.shopTreePage.shopName,
          shopStatus: this.checkShopStatus.join(','),
          guideStatus: this.checkGuideStatus.join(','),
          areaId: this.selectedAreaInfo.id
        }
      }).then(resp => {
        if (resp.success && resp.result !== null) {
          this.shopTreePage.total = Number(resp.result.recordsTotal)
          this.shopFindList = resp.result.data
          if (this.shopFindList.length > 0) {
            this.$nextTick(function () {
              this.$refs.guideTree.setCurrentKey(this.shopFindList[0].id)
            })
            this.onClickNode(this.shopFindList[0])
          } else {
            this._data._table.data = []
            this._data._pagination.total = 0
            this.shuJushuzu.id = ''
            this.offLineShopId = ''
            this.setStatus()
            this.$emit('offLineShopId', { 'shopId': this.offLineShopId, 'areaId': this.selectedAreaInfo.id })
          }
        }
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    shopDel (index) {
      this.guideShopList.splice(index, 1)
    },
    appendShopInfo (val) {
      val.forEach((item, index) => {
        if (document.getElementsByClassName('subdivision-tree-node')[index].children.length === 1) {
          let statusInfo = document.createElement('span')
          statusInfo.className = 'text-error'
          statusInfo.style = 'display:inline;margin-left:8px'
          if (item.ext1 && item.ext1 === -1) {
            statusInfo.innerText = '(暂停)'
          }
          if (item.ext1 && item.ext1 === -2) {
            statusInfo.innerText = '(关店)'
          }
          document.getElementsByClassName('subdivision-tree-node')[index].appendChild(statusInfo)
        }
      })
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
    // handleSelectionChange (val) {
    //   this.$emit('handleSelectionChange', val)
    // },
    onRedactFun (val, offLineShopId) {
      this.$emit('onRedactFun', val, offLineShopId, this.selectedAreaInfo.id)
    },
    showTagDailog (val, offLineShopId) {
      this.$emit('showTag', val, offLineShopId, this.selectedAreaInfo.id)
    },
    onDelsTipFun (val) {
      this.$emit('onDelsTipFun', val)
    },
    dimissionFun (val) {
      this.$emit('dimissionFun', val)
    },
    // 解析后台传进来的字符串
    strToJson (str) {
      if (str && str.length > 0) {
        return JSON.parse(str)
      } else {
        return null
      }
    },
    '$handleParams': function (params) {
      var _this = this
      if (_this.shuJushuzu.parentId === '0') {
        params.searchMap.shopId = _this.shuJushuzu.id === '' ? null : Number(_this.shuJushuzu.id)
      } else {
        params.searchMap.guideId = Number(_this.shuJushuzu.id)
        params.searchMap.shopId = Number(_this.shuJushuzu.parentId)
      }
      return params
    },
    // 全选全部所有数据
    handleCheckAllChange (val) {
      if (val) {
        let list = this._data._table.data
        list.forEach((item) => {
          this.$refs.table && this.$refs.table.toggleRowSelection(item, true)
        })
        this.addcheckList = []
      } else {
        this.removeCheckList = []
        this.$refs.table.clearSelection()
      }
      this.isIndeterminate = false
    },
    // table表格勾选全部
    hanledSelecAllChange (val) {
      let pagedataAll = val.length === 0 // 判断是全选还是全部取消
      // 切换page 会导致调用此方法， isManual  用作判断
      if (!this.isManual) {
        return false
      }
      if (this.checkAll) {
        if (pagedataAll) {
          this.removeCheckList = this.removeCheckList.concat(this._data._table.data)
          // 数组去重
          this.removeCheckList = this.unique(this.removeCheckList)
        } else {
          this.removeCheckList = this.diffArr(this.removeCheckList, this._data._table.data)
        }
      } else {
        if (pagedataAll) {
          this.addcheckList = this.diffArr(this.addcheckList, this._data._table.data)
        } else {
          this.addcheckList = this.addcheckList.concat(this._data._table.data)
          this.addcheckList = this.unique(this.addcheckList)
        }
      }
    },
    // 全选状态下，勾选全部选中
    diffArr (arr1, arr2) {
      let deffArr = arr1.filter(item =>
        !arr2.some(ele => JSON.stringify(ele.nickInfoList[0]) === JSON.stringify(item.nickInfoList[0]))
      )
      return deffArr
    },
    // 去重
    unique (arr) {
      let newArr = JSON.parse(JSON.stringify(arr))
      if (newArr.length === 0) {
        return false
      }
      for (var i = 0; i < newArr.length; i++) {
        for (var j = i + 1; j < newArr.length; j++) {
          if (JSON.stringify(newArr[i].nickInfoList[0]) === JSON.stringify(newArr[j].nickInfoList[0])) {
            newArr.splice(j, 1)
            j--
          }
        }
      }
      return newArr
    },
    handleSelectChange (selection, row) {
      if (this.checkAll) {
        this.addremoveCheck(selection, row)
        // this.isCheckList.push(row)
      } else {
        this.addCheck(selection, row)
      }
    },
    // 全选状态下，添加取消的数组
    addremoveCheck (selection, row) {
      let nickInfoList = row.nickInfoList[0]
      var nick = nickInfoList.nick
      var platform = nickInfoList.platform
      let selectionIndex = selection.findIndex((item) => {
        return item.nickInfoList[0].platform === platform && item.nickInfoList[0].nick === nick
      })
      // selectionIndex 有值默认是勾选的，无值是取消的
      if (selectionIndex < 0) {
        this.removeCheckList.push(row)
      } else {
        this.delRemoveCheck(nick, platform)
      }
    },
    // 全选状态下，取消添加的数组
    delRemoveCheck (nick, platform) {
      if (this.removeCheckList.length === 0) {
        return false
      }
      let removeIndex = this.removeCheckList.findIndex((item) => {
        return item.nickInfoList[0].platform === platform && item.nickInfoList[0].nick === nick
      })
      this.removeCheckList.splice(removeIndex, 1)
    },
    // 非全选状态下，勾选目标数据
    addCheck (selection, row) {
      let selectionIndex = selection.findIndex((item) => {
        return JSON.stringify(item.nickInfoList[0]) === JSON.stringify(row.nickInfoList[0])
      })
      if (selectionIndex >= 0) {
        this.addcheckList.push(row)
      } else {
        this.delAddCheck(row)
      }
    },
    // 非全选状态下，取消勾线已选择
    delAddCheck (row) {
      if (this.addcheckList.length === 0) {
        return false
      }
      let removeIndex = this.addcheckList.findIndex((item) => {
        return JSON.stringify(item.nickInfoList[0]) === JSON.stringify(row.nickInfoList[0])
      })
      this.addcheckList.splice(removeIndex, 1)
    },
    // 勾选全部数据记录所有数据勾选状态
    async $onSizeChange$ (size) {
      await this.$sizeChange$(size)
      this.tableState()
    },
    async $onPageChange$ (page) {
      await this.$pageChange$(page)
      this.tableState()
    },
    async searchAction () {
      // this.$searchAction$()
      this._data._table.searchMap = $.extend(true, {}, this.model)
      // 页码变更会触发reload动作
      this._data._pagination.page = 1
      this.$formatTextToShow$()
      await this.$reload()
      this.$nextTick(() => {
        this.tableState()
      })
    },
    resetInputAction: function () {
      if (typeof this.$resetInput === 'function') {
        const model = this.$resetInput(this.model)
        if (model) {
          this.$set(this, 'model', model)
        }
      } else {
        this.$resetInput$()
      }
      this.searchAction()
    },
    // table表格显示状态
    tableState () {
      let _this = this
      if (this.checkAll) {
        this.isManual = false
        this.$refs.table.toggleAllSelection()
        if (this.removeCheckList.length >= 0) {
          // toggleAllSelection 异步事件导购取消勾选后，异步执行完成后勾选
          setTimeout(() => {
            this.isManual = true
            _this._data._table.data.forEach(row => {
              _this.removeCheckList.forEach((item) => {
                if (JSON.stringify(row.nickInfoList[0]) === JSON.stringify(item.nickInfoList[0])) {
                  _this.$refs.table.toggleRowSelection(row, false)
                }
              })
            })
          }, 50)
        }
      } else {
        this.$refs.table.clearSelection()
        if (this.addcheckList.length === 0) {
          return false
        }
        setTimeout(() => {
          _this._data._table.data.forEach(row => {
            _this.addcheckList.forEach((item) => {
              if (JSON.stringify(row.nickInfoList[0]) === JSON.stringify(item.nickInfoList[0])) {
                _this.$refs.table.toggleRowSelection(row, true)
              }
            })
          })
        }, 50)
      }
    }
  }
}
