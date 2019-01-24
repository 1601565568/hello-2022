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
    const tableButtons = []
    const operateButtons = []
    let quickInput = [{
      'template': '',
      'inline': false,
      'name': 'name',
      'text': '任务名称',
      'placeholder': '请输入任务名称',
      'type': 'text',
      'value': ''
    }]
    let quickSearchNames = quickInput.map(x => x.name)
    let quickSearchModel = {}

    let searchModel = {
      operator: 1,
      operators: null,
      staff: null,
      brandParty: null,
      moduleType: null,
      operatorId: null,
      operatorName: null,
      shopId: null,
      terminalType: null,
      validTime: null,
      sgGuide: {
        brand_id: null,
        name: null,
        nickname: null,
        sex: 1,
        mobile: null,
        birthday: null,
        work_id: null,
        password: null,
        image: null,
        validTime: null,
        dataModule: null

      },
      sgGuideShop: {
        id: null,
        shop_id: null,
        job: 0
      }
    }
    let findVo = {
      'name': null,
      'shop': null,
      'job': null,
      'guideState': 1
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    return {
      model: model,
      quickSearchModel: quickSearchModel,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: {expand: false},
      title: '变更详情',
      multipleSelection: [],
      staffFindLists: [],
      shopFindList: [],
      select: true,
      dataModule: [
        {label: '员工信息', value: 1},
        {label: '会员信息', value: 2},
        {label: '门店指标', value: 3},
        {label: '任务管理', value: 4},
        {label: '提成奖励设置', value: 5},
        {label: '素材分组', value: 6},
        {label: '素材库', value: 7},
        {label: '优惠券', value: 8},
        {label: '导购指标', value: 9}
      ],
      operator: [
        {label: '员工', value: 1},
        {label: '品牌方', value: 2},
        {label: '操作人ID', value: 3}
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
      obj.length = 15
      obj.start = 0
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
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    viewDetails (value) {
      this.$emit('viewDetails', value)
    }
  }
}
