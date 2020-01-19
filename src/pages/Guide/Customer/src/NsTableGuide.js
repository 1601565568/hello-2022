import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import moment from 'moment'
import { getErrorMsg } from '@/utils/toast'

export default {
  name: 'NsTableGuide',
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
        'func': function () {
          this.$emit('add')
        },
        'name': '更换导购'
      }
    ]
    let quickSearchModel = {}
    let findVo = {
      'customerName': null,
      'nick': null,
      'mobile': null,
      'cardId': null,
      'time': null,
      'grade': null
    }
    let model = Object.assign({}, findVo, {})
    return {
      filterTreeText: '',
      model: model,
      quickSearchModel: quickSearchModel,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false },
      multipleSelection: [],
      select: true,
      shopFindList: [],
      // url: this.$api.guide.guide.customerFindCustomerList,
      dataList: [],
      allGuideArr: { id: 0, pId: null, label: '全部导购' },
      shuJushuzu: {},
      offLineShopId: null,
      loading: false,
      offsetHeight: false,
      height: 0,
      gradeInfo: [], // 等级信息下拉框
      shopTreePage: {
        total: 0,
        page: 1,
        size: 50,
        shopName: ''
      }
    }
  },
  watch: {
    // 导购树过滤
    filterTreeText (val) {
      this.$refs.guideTree.filter(val)
    }
  },
  mounted: function () {
    var vm = this
    vm.height = window.innerHeight - 120
    // if (typeof vm.$init === 'function') {
    // } else {
    //   vm.loading = true
    //   vm.$reload().then(rep => {
    //     vm.loading = vm._data._loading
    //   })
    // }
    let limitHeight = window.innerHeight - 32 - 10 - this.$refs.shopTreeDiv.$el.getBoundingClientRect().top
    this.$refs.shopTreeDiv.$el.children[0].style.height = limitHeight + 'px'
    this.$searchAction$()
  },
  updated () {
    if (this.$refs.elTree) {
      this.$refs.elTree.offsetHeight > window.screen.availHeight ? this.offsetHeight = true : this.offsetHeight = false
    }
  },
  computed: {},
  created: function () {
    this.initShopList()
  },
  methods: {
    moment (time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    onClickNode (data) {
      var _this = this
      if (this._data._table.data.length > 0) {
        this._data._table.data = []
      }
      if (_this.gradeInfo) {
        _this.gradeInfo = []
      }
      _this.offLineShopId = data.parentId !== 0 ? data.parentId : data.id
      _this.$emit('offLineShopId', _this.offLineShopId)
      _this.shuJushuzu = data
      _this.loading = true
      _this.$reload().then(rep => {
        _this.loading = _this._data._loading
        var showLabel = data.label
        if (showLabel.indexOf('(') !== -1) {
          showLabel = showLabel.substring(0, showLabel.indexOf('('))
        }
        data.label = showLabel + '(' + _this._data._pagination.total + ')'
      })
      // 设置搜索及重置可用
      this.searchButton = false
      this.restButton = false
      _this.$http.fetch(_this.$api.guide.shop.findShopGrade,
        { shopId: _this.offLineShopId }).then(resp => {
        if (resp.success && resp.result !== null) {
          _this.gradeInfo = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询等级信息失败', resp))
      })
    },
    // 树节点过滤
    onFilterNode (value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) { return true }
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
      this.$http.fetch(this.$api.guide.guide.customerGetGuideTree, {
        start: (this.shopTreePage.page - 1) * this.shopTreePage.size,
        length: this.shopTreePage.size,
        searchMap: {
          shopName: this.shopTreePage.shopName
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
          }
        }
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    shopDel (index) {
      this.guideShopList.splice(index, 1)
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
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    onRedactFun (val, offLineShopId) {
      this.$emit('onRedactFun', val, offLineShopId)
    },
    showTagDailog (val, offLineShopId) {
      this.$emit('showTag', val, offLineShopId)
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
        params.searchMap.shopId = Number(_this.shuJushuzu.id)
      } else {
        params.searchMap.guideId = Number(_this.shuJushuzu.id)
        params.searchMap.shopId = Number(_this.shuJushuzu.parentId)
      }
      return params
    }
  }
}
