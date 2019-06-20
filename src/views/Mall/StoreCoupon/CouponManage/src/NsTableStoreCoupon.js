import tableMixin from 'web-crm/src/mixins/table'
import moment from 'moment'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'
export default {
  name: 'NsTableStoreCoupon',
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
        'name': '新增'
      }
    ]
    const operateButtons = [
      {
        'func': function (args) {
          this.$emit('edit', args.row)
        },
        'icon': '',
        'name': '编辑',
        'auth': '',
        'visible': ''
      },
      {
        'func': function (args) {
          this.$emit('delete', args.row)
        },
        'icon': '',
        'name': '删除',
        'auth': '',
        'visible': ''
      }
    ]
    let quickSearchModel = { name: '' }
    let model = {
      name: '',
      state: null,
      type: null,
      invalidStartTime: null,
      invalidEndTime: null
    }
    return {
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false }
    }
  },
  mounted: function () {
    // 加载表格数据
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  computed: {},
  methods: {
    /**
     * 更改启用状态
     * @param call
     * @param currVal
     * @param row
     */
    onStatusChange: function (call, currVal, row) {
      let that = this
      let info
      let status
      if (currVal === 1) {
        status = 0
        info = '禁用该优惠券'
      } else if (currVal === 0) {
        status = 1
        info = '启用该优惠券'
      }
      apiRequestConfirm(info).then(() => {
        that.$http.fetch(that.$api.coupon.storeCoupon.updateStatus, { couponId: row.id, status: status })
          .then(() => {
            that.$reload()
            call()
          }).catch((resp) => {
            that.$message.error(resp.msg || '状态更新失败，请重试')
          })
      }).catch(() => {})
    },
    /**
     * 处理查询请求参数
     * @param param
     * @returns {*}
     */
    $handleParams (param) {
      let searchMap = param.searchMap
      if (searchMap && searchMap.invalidStartTime) {
        searchMap.invalidStartTime = moment(searchMap.invalidStartTime).format('YYYY-MM-DD HH:mm:ss')
      }
      if (searchMap && searchMap.invalidEndTime) {
        searchMap.invalidEndTime = moment(searchMap.invalidEndTime).format('YYYY-MM-DD HH:mm:ss')
      }
      return param
    }
  }
}
