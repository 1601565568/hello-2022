import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import targetDetail from '../targetDetail'
import { getErrorMsg } from '@/utils/toast'
import ShopSelectLoad from '@/components/ShopSelectLoad'
export default {
  name: 'NsTableGuide',
  mixins: [tableMixin],
  components: { targetDetail, ShopSelectLoad },
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
      memberBelongingtitle: null,
      scopeRowCountShow: false,
      shopFindLists: null,
      quickSearchModel: {},
      title: '变更详情',
      multipleSelection: [],
      staffFindLists: [],
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
        { label: '授权管理', value: 10 },
        { label: '快捷话术', value: 11 },
        { label: '售后处理', value: 12 },
        { label: '订单处理', value: 13 }
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
      },
      fuscous: process.env.VUE_APP_THEME,
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
    }
  },

  mounted: function () {
    var vm = this
    vm.staffFindList()
    if (typeof this.$init === 'function') {
    } else {
      this.$reload()
    }
  },
  computed: {},
  methods: {
    scopeRowCount (row) {
      let _this = this
      this.showTargetDetail = false
      _this.scopeRowCountShow = true
      _this.showTargetDetail = false
      _this.memberBelongingtitle = '查看（' + row.name + '）所属门店详情'
      _this.$http.fetch(_this.$api.guide.guide.findGuideShopList, { guideId: row.id, shopState: 1, shopStatus: 1 }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindLists = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
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
        _this.$notify.error(getErrorMsg('查询失败', resp))
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
