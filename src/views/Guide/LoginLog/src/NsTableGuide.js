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
    const operateButtons = []
    let quickSearchModel = {}

    let searchModel = {
      operateId: null,
      operateName: null,
      shopId: null,
      accountType: null,
      validTime: null
    }
    return {
      model: searchModel,
      quickSearchModel: quickSearchModel,
      _pagination: pagination,
      _table: {
        operate_buttons: operateButtons,
        quickSearchMap: {}
      },
      _queryConfig: {expand: false},
      staffFindLists: [],
      shopFindList: [],
      select: true,
      operator: [
        {label: '员工', value: 1},
        {label: '品牌方', value: 0},
        {label: '操作人ID', value: 2}
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },

  mounted: function () {
    var vm = this
    vm.initShopList()
    vm.staffFindList()
    if (typeof this.$init === 'function') {
    } else {
      this.$reload()
    }
  },
  computed: {},
  methods: {
    staffFindList () {
      let _this = this
      let obj = {}
      let searchMap = {}
      obj.start = 0
      obj.searchMap = searchMap
      searchMap.shop = _this.model.shopId

      _this.$http.fetch(_this.$api.guide.guide.findList, obj).then(resp => {
        if (resp.success && resp.result != null) {
          _this.staffFindLists = resp.result.data
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    handleClose () {
    },
    initShopList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.shop.findBrandShopList, {isOnline: 0}).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindList = resp.result
          _this.model.shopId = _this.shopFindList[0].id
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    }
  }
}
