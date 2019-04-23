import Vue from 'vue'
let tradeVInner = this
Vue.component('business-inner-checkbox', {
  data () {
    return {
      checkboxvalinner: false,
      isIndeterminate: false
    }
  },
  props: {
    checkboxValInner: Boolean,
    isIndeterminateInner: Boolean
  },
  watch: {
    checkboxvalinner: {
      handler (val) {
      },
      immediate: true,
      deep: true
    },
    isIndeterminateInner: {
      handler (val) {
        this.isIndeterminate = val
      },
      immediate: true,
      deep: true
    },
    checkboxValInner: {
      handler (val) {
        this.checkboxvalinner = val
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    changeFun () {
      tradeVInner.default.methods.changeValInner()
    }
  },
  template: '<el-checkbox v-model="checkboxvalinner" :indeterminate="isIndeterminate" @change="changeFun"></el-checkbox>'
})

export default {
  name: 'NsAffarisOrder',
  props: {
    types: Object
  },
  data: function () {
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    var tableButtons = []

    var operateButtons = []

    return {
      rules: Object.assign({}, {}, {}),
      pagination: pagination,
      indeterminate: false,
      selections: [],
      page: 1,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchMap: {}
      },
      _queryConfig: {
        expand: false
      },
      checkboxValInner: false, // 表格头部是否选中
      isIndeterminateInner: false, // 表格是否全选
      tableData6: [{
        identifier: '237492739472394',
        orderTime: '2017-11-12 13:44:55',
        confirmTime: '2017-11-12 13:44:55',
        people: {
          nickname: 'ccc',
          name: '曹操',
          phone: '15312341234',
          level: '初级会员/非会员',
          service: '小小'
        },
        source: '淘宝',
        pay: '705.00',
        expressFee: '60.00',
        tradeState: 1, // 交易状态 0-关闭， 1-成功
        logistics: '', // 物流信息
        evaluate: '', // 是否评价
        list: [
          {
            imgUrl: 'data:image/jpeg;base64,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',
            title: '科大讯飞机器人TYS1',
            explain: '颜色分类:深灰色;参考身高:吊牌130码建议身高120左右',
            identifier: 'KZ000655',
            univalent: '235.00',
            number: '2'
          }
        ]
      }, {
        identifier: '237492739472394',
        orderTime: '2017-11-12 13:44:55',
        confirmTime: '2017-11-12 13:44:55',
        people: {
          nickname: 'ccc',
          name: '曹操',
          phone: '15312341234',
          level: '初级会员/非会员',
          service: '小小'
        },
        source: '淘宝',
        pay: '705.00',
        expressFee: '60.00',
        tradeState: 0, // 交易状态 0-关闭， 1-成功
        logistics: '', // 物流信息
        evaluate: '', // 是否评价
        list: [
          {
            imgUrl: 'data:image/jpeg;base64,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',
            title: '科大讯飞机器人TYS1',
            explain: '颜色分类:深灰色;参考身高:吊牌130码建议身高120左右',
            identifier: 'KZ000655',
            univalent: '235.00',
            number: '2'
          }
        ]
      }]
    }
  },
  watch: {},
  mounted: function () {
  },
  methods: {
    created: function () {},
    /**
     * 表格单元格合并
     */
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return [1, 5]
      }
    },
    // 在渲染表头的时候，会调用此方法，h为createElement的缩写版  添加on.change事件即可
    renderProductId (h, { column }) {
      return h('business-inner-checkbox', {
        props: {
          checkboxValInner: this.checkboxValInner,
          isIndeterminateInner: this.isIndeterminateInner
        }
      })
    },
    changeValInner () {
      this.checkboxValInner = !this.checkboxValInner
      this.selectionInnerAll(this.checkboxValInner)
    }
  }
}
