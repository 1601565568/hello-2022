/*
 * @Descripttion: 使用员工组件
 * @Author: yuye.huang
 * @Date: 2020-03-09 13:55:17
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-09 14:26:02
 */
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

export default {
  name: 'NsTableEmployeeScope',
  props: {
    data: {
      type: Object,
      default () {
        return {
          visible: false
        }
      }
    }
  },
  mixins: [tableMixin],
  data () {
    let model = Object.assign({
      employeeName: ''
    }, this.model, this.childData)
    return {
      _table: {
        searchMap: {},
        quickSearchMap: {}
      },
      model: model,
      url: this.$api.weWork.welcomeCode.findWelcomeCodeEmployeeList
    }
  },
  mounted () {
    this.model = Object.assign({}, this.model, this.childData)
    // 加载列表数据
    if (typeof this.$init === 'function') {
      this.$init()
    } else {
      this.$reload()
    }
  },
  methods: {
  },
  computed: {
    childData: {
      get: function () {
        return this.data
      }
    }
  }
}
