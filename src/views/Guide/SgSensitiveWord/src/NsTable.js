import tableMixin from 'web-crm/src/mixins/table'
import moment from 'moment'
import { getErrorMsg } from '@/utils/toast'

export default {
  name: 'NsTable',
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
        'name': '新增敏感词'
      },
      {
        'func': function () {
          this.$emit('add')
        },
        'name': '敏感词监控'
      }
    ]
    let quickSearchModel = {}
    let findVo = {
      'name': null,
      'mobile': null,
      'nickName': null,
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
      findGroupList: [],
      findGroupListLength: [],
      dataList: [],
      allGuideArr: { id: 0, pId: null, label: '全部导购' },
      shuJushuzu: {},
      loading: false,
      offsetHeight: false,
      height: 0
    }
  },
  watch: {
    // 导购树过滤
    filterTreeText (val) {
      this.$refs.groupTree.filter(val)
    }
  },
  mounted: function () {
    var vm = this
    vm.initList()
    vm.height = window.innerHeight - 130
    if (typeof vm.$init === 'function') {
    } else {
      vm.loading = true
      vm.$reload().then(rep => {
        vm.loading = vm._data._loading
      })
    }
  },
  updated () {
    this.$refs.elTree.offsetHeight > window.screen.availHeight ? this.offsetHeight = true : this.offsetHeight = false
  },
  computed: {},
  methods: {
    moment (time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    onClickNode (data) {
      var _this = this
      _this.shuJushuzu = data
      _this.loading = true
      _this.$reload().then(rep => {
        _this.loading = _this._data._loading
      })
    },
    // 树节点过滤
    onFilterNode (value, data) {
      if (!value) { return true }
      return data.label.indexOf(value) !== -1
    },
    initList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.sensitiveWord.getGroupTree).then(resp => {
        if (resp.success && resp.result !== null) {
          _this.findGroupList = resp.result
          _this.findGroupList.unshift(_this.allGuideArr)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
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
