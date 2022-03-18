/*
 * @Descripttion: 智能欢迎语
 * @Author: yuye.huang
 * @Date: 2020-03-01 16:34:26
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-06-28 17:46:50
 */
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import annexType from '@/config/annexType.js'
import moment from 'moment'

export default {
  name: 'NsTableWelcomeCode',
  mixins: [tableMixin],
  data: function () {
    let tableButtons = [
      {
        'func': function (scope) {
          this.$emit('onRedactFun', scope.row)
        },
        'icon': '',
        'name': '详情',
        'auth': ``,
        'visible': ``
      }
    ]
    let quickSearchModel = {}
    let searchModel = {
      'name': '',
      'orderKey': 'updateTime',
      'order': 'descending',
      // 员工组建 员工值
      userIds: [],
      'timeStart': '',
      'timeEnd': '',
      timeRange: []
    }
    let model = Object.assign({}, searchModel)
    return {
      // 附带内容类型
      annexType: annexType,
      url: this.$api.weWork.weWorkCustomer.getRepeatCustomerList,
      model: model,
      quickSearchModel: quickSearchModel,
      _table: {
        table_buttons: tableButtons,
        loadingtable: false
      },
      // 判断系统环境
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType
    }
  },
  mounted () {
    this.$reload()
  },
  computed: {
  },
  methods: {
    /**
     * @msg: 時間变更
     */
    changeTime (e) {
      if (e != null) {
        this.model.timeStart = moment(e[0]).format('YYYY-MM-DD HH:mm:ss')
        this.model.timeEnd = moment(e[1]).format('YYYY-MM-DD HH:mm:ss')
      } else {
        this.model.timeStart = ''
        this.model.timeEnd = ''
      }
      this.$searchAction$()
    },
    handleChangeGuide (value) {
      value = value.map(el => (el + ''))
      this.changeSearchfrom({ userIds: value })
    },
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    handleSearch () {
      this.changeSearchfrom()
    },
    /**
     * @msg:  从后台获取数据,重新排序
     * @param {Object} val {prop: 'date', order: 'descending'}
     */
    onSortChange (val) {
      this.model.orderKey = val.prop
      this.model.order = val.order
      this.$searchAction$()
    },
    /**
     * @msg: 查看欢迎语员工使用范围
     * @param {type} scope.row
     */
    onShowEmployeeScope (data) {
      this.$emit('onShowEmployeeScope', data)
    },
    /**
     * @msg: 查看欢迎语渠道使用范围
     * @param {type} scope.row
     */
    onShowChannelScope (data) {
      this.$emit('onShowChannelScope', data)
    },
    /**
     * @msg: 查看欢迎语门店使用范围
     * @param {type} scope.row
     */
    onShowShopScope (data) {
      this.$emit('onShowShopScope', data)
    },
    /**
     * @msg: 转换附带内容类型 k-v
     * @param {Number} 附带内容类型值
     * @return: 附带内容类型名称
     */
    convertAnnexType (k) {
      let v = this.annexType.Collection[k]
      if (v) {
        return v
      }
      return '-'
    },
    onRedactFun (row) {
    },
    checkUrl (url) {
      if (url !== null && url !== '') {
        if (url.indexOf('img.alicdn.com') !== -1) {
          url = url + '_200x200.jpg'
        }
      }
      return url
    }
  }
}
