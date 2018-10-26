import tableMixin from 'mixins/table' // 引入tableMixin
// import ErrorCode from 'configs/errorCode'
// import apiRequestConfirm from 'utils/apiRequestConfirm'
export default {
  name: 'NsTableIntegralClear',
  mixins: [tableMixin],
  data: function () {
    // 分页 （可以直接复制）
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    // 表格内操作的button
    var tableButtons = []
    // 操作按钮
    var operateButtons = [
      {
        'func': function () {
          this.$emit('open-dialog')
        },
        'icon': '$.noop',
        'name': '\u65B0\u589E',
        'auth': ``,
        'visible': ` `
      }
    ]
    // 赋值
    return {
      state: {},
      url: this.$api.integral.integralClearTask.queryIntegralClearTask,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons
      },
      _queryConfig: {expand: false}
    }
  },
  mounted: function () {
    // 初始化搜索框的事件监听
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  computed: {},
  methods: {
    onHandleSelectChange: function (val) {
      this.$set(this, 'selectRows', val)
    },
    onEffectiveChange: function (call, currVal, row) {
      this.$emit('effective-change', call, currVal, row)
    },
    onDefaultChange: function (call, currVal, row) {
      this.$emit('default-change', call, currVal, row)
    }
  },
  created: function () {
  }
}
