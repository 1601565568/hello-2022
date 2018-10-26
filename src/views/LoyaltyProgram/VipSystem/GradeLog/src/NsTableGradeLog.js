import tableMixin from 'mixins/table'

export default {
  name: 'NsTableGradeLog',
  mixins: [tableMixin],
  props: {
    url: Object
  },
  data: function () {
    let quickInput = [{
      'template': '',
      'inline': false,
      'name': 'customerName',
      'text': '客户名称',
      'placeholder': '请输入客户名称',
      'type': 'text',
      'value': ''
    }]
    let quickSearchNames = quickInput.map(x => x.name)

    let model = {
      'customerName': '',
      'type': '',
      'mobile': '',
      'memberCard': '',
      'oldGrade': '',
      'newGrade': '',
      'operateType': '',
      'changeRange': []
    }

    return {
      model: model,
      quickSearchModel: {},
      _table: {
        table_buttons: [],
        operate_buttons: [],
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: {expand: false},
      gradeData: []
    }
  },
  mounted: function () {
    // 查询等级下拉数据
    this.getGradeOptions()
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  computed: {},
  methods: {
    /**
     * 获取等级下拉数据
     */
    getGradeOptions () {
      let that = this
      that.$http.fetch(that.$api.core.common.getGradeOptions)
        .then(resp => {
          that.gradeData = resp.result
        })
    },
    /**
     * 处理查询请求参数
     * @param param
     * @returns {*}
     */
    $handleParams (param) {
      if (param.searchMap) {
        param.searchMap.startTime = param.searchMap.changeRange[0]
        param.searchMap.endTime = param.searchMap.changeRange[1]
      }
      return param
    }
  }
}
