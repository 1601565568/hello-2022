import tableMixin from 'mixins/table'
export default {
  name: 'CustomerTable',
  mixins: [tableMixin],
  data: function () {
    let that = this
    let tableButtons = [
      {
        'func': function () {
          let data = that.$refs.table.selection
          if (data.length <= 0) {
            that.$message.warning('请至少选择一个客户')
            return
          }
          that.$emit('sendSmsList', data)
        },
        'name': '发短信'
      }
    ]
    let quickInput = [{'name': 'customer_name'}]
    let quickSearchNames = quickInput.map(x => x.name)
    let quickSearchModel = {}
    let model = Object.assign({},
      {
        customer_name: null,
        true_name: null,
        mobile: null,
        memberState: null,
        member_card: null,
        payAmountStart: null,
        payAmountEnd: null,
        payTimesStart: null,
        payTimesEnd: null
      },
      {})
    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
        },
        enumerable: true
      })
    })
    return {
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      url: this.$api.mall.customer.findList,
      payAmountRadio: null,
      payTimesRadio: null,
      _table: {
        table_buttons: tableButtons,
        quickSearchMap: {},
        quickSearchNames: quickSearchNames
      }
    }
  },
  mounted: function () {
  },
  methods: {
    changePayAmountRadio (label) {
      if (label === 1) {
        this.model.payAmountStart = null
        this.model.payAmountEnd = null
      } else if (label === 2) {
        this.model.payAmountStart = 100
        this.model.payAmountEnd = 500
      } else if (label === 3) {
        this.model.payAmountStart = 500
        this.model.payAmountEnd = 2000
      } else if (label === 4) {
        this.model.payAmountStart = 2000
        this.model.payAmountEnd = null
      }
    },
    changePayTimesRadio (label) {
      if (label === 1) {
        this.model.payTimesStart = null
        this.model.payTimesEnd = null
      } else if (label === 2) {
        this.model.payTimesStart = 0
        this.model.payTimesEnd = 10
      } else if (label === 3) {
        this.model.payTimesStart = 10
        this.model.payTimesEnd = 50
      } else if (label === 4) {
        this.model.payTimesStart = 50
        this.model.payTimesEnd = null
      }
    },
    resetInputAction () {
      this.model = {
        customer_name: null,
        true_name: null,
        mobile: null,
        memberState: null,
        member_card: null,
        payAmountStart: null,
        payAmountEnd: null
      }
      this.$searchAction$()
    }
  }
}
