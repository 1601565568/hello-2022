import tableMixin from 'mixins/table'
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
      'name': null,
      'shop': null,
      'job': null,
      'guideState': 1
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
      shopFindListLength: [],
      dataList: [],
      allGuideArr: { id: null, pId: null, label: '全部导购' },
      shuJushuzu: {}
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
    vm.initShopList()
    if (typeof vm.$init === 'function') {
    } else {
      vm.$reload()
    }
  },
  computed: {},
  methods: {
    onClickNode (data) {
      var _this = this
      _this.shuJushuzu = data
      _this.$reload()
    },
    // 树节点过滤
    onFilterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    search () {
      var _this = this
      if (_this.model.name === null && _this.model.shop === null && _this.model.job === null) {
        _this.$confirm('请编辑您要搜索的信息!')
      } else {
        _this.$searchAction$()
      }
    },
    initShopList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.customerGetGuideTree).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindList = resp.result
          _this.shopFindList.unshift(_this.allGuideArr)
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
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

    onRedactFun (val) {
      this.$emit('onRedactFun', val)
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
      params.searchMap.guideId = Number(_this.shuJushuzu.id)
      params.searchMap.shopId = Number(_this.shuJushuzu.parentId)
      return params
    }
  }
}
