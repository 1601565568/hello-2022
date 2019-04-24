import tableMixin from 'web-crm/src/mixins/table'
import targetDetail from '../targetDetail'
export default {
  name: 'NsTableGuide',
  mixins: [tableMixin],
  components: { targetDetail },
  props: {
    url: Object
  },
  data: function () {
    let searchModel = {
      operator: 1,
      operators: null,
      moduleType: null,
      operatorId: null,
      operatorName: null,
      shopId: null,
      terminalType: null,
      validTime: null
    }
    let findVo = {
      'name': null,
      'shop': null,
      'job': null,
      'targetId': null
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    return {
      showTargetDetail: false,
      model: model,
      quickSearchModel: {},
      title: '变更详情',
      multipleSelection: [],
      staffFindLists: [],
      shopFindList: [],
      select: true,
      dataModule: [
        { label: '员工信息', value: 1 },
        { label: '会员信息', value: 2 },
        { label: '门店指标', value: 3 },
        { label: '任务管理', value: 4 },
        { label: '提成奖励设置', value: 5 },
        { label: '素材分组', value: 6 },
        { label: '素材库', value: 7 },
        { label: '优惠券', value: 8 },
        { label: '导购指标', value: 9 },
        { label: '授权管理', value: 10 }
      ],
      operator: [
        { label: '员工', value: 2 },
        { label: '品牌方', value: 1 },
        { label: '操作人ID', value: 3 }
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
    /** 搜索操作人监听事件 */
    terminalTypeChange (val) {
      let _this = this
      _this.model.operatorId = null
      _this.model.operatorName = null
    },
    staffFindList () {
      let _this = this
      _this.$http.fetch(_this.$api.guide.guide.getGuideList).then(resp => {
        if (resp.success && resp.result != null) {
          _this.staffFindLists = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    initShopList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.shop.findBrandShopList, { isOnline: 0 }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindList = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    viewDetails (value) {
      this.$emit('viewDetails', value)
    },
    showDetail () {
      let _this = this
      _this.showTargetDetail = true
    }
  }
}
