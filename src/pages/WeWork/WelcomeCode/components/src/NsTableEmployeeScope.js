/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
/*
 * @Descripttion: 使用员工组件
 * @Author: yuye.huang
 * @Date: 2020-03-09 13:55:17
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-27 11:12:17
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
    let model = {
      employeeName: '',
      welcomeCodeUuid: ''
    }
    return {
      _table: {
        searchMap: {},
        quickSearchMap: {}
      },
      model: model,
      url: this.$api.weWork.welcomeCode.findWelcomeCodeEmployeeList,
	  cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType // 平台判断
    }
  },
  mounted () {
    this.model = Object.assign({}, this.model, this.childData)
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
